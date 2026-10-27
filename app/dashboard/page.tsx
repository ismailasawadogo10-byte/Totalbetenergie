import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getCurrentUser, requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const products = await prisma.investmentProduct.findMany({ orderBy: { amount: "asc" } });

  return (
    <main className="page-shell" style={{ paddingBottom: 60 }}>
      <div className="layout-grid">
        <aside className="sidebar">
          <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 16 }}>Menu</div>
          <a className="active" href="/dashboard">Tableau de bord</a>
          <a href="/dashboard/deposit">Dépôt / Recharger</a>
          <a href="/dashboard/withdraw">Retrait</a>
          <a href="/dashboard/history">Historique</a>
          <a href="/me">Mon profil</a>
          {user.role === "ADMIN" ? <a href="/admin">Backoffice Admin</a> : null}
          <form action={logoutAction} style={{ marginTop: 26 }}>
            <button className="btn btn-danger" type="submit">Déconnexion</button>
          </form>
        </aside>

        <div>
          <div className="notice">Bienvenue, {user.name}. Votre solde disponible est {user.balance.toLocaleString("fr-FR")} FCFA.</div>

          <div className="dashboard-grid" style={{ marginTop: 18 }}>
            <div className="metric-card">
              <div className="muted">Solde</div>
              <div style={{ fontSize: "2rem", fontWeight: 800 }}>{user.balance.toLocaleString("fr-FR")}</div>
            </div>
            <div className="metric-card">
              <div className="muted">Total investi</div>
              <div style={{ fontSize: "2rem", fontWeight: 800 }}>{user.totalInvested.toLocaleString("fr-FR")}</div>
            </div>
            <div className="metric-card">
              <div className="muted">Dépôts</div>
              <div style={{ fontSize: "2rem", fontWeight: 800 }}>{user.deposits?.length ?? 0}</div>
            </div>
            <div className="metric-card">
              <div className="muted">Retraits</div>
              <div style={{ fontSize: "2rem", fontWeight: 800 }}>{user.withdrawals?.length ?? 0}</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 26 }}>
            <h3 style={{ marginTop: 0 }}>Faire un investissement</h3>
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-visual" style={{ backgroundImage: `url('${product.imageUrl}')` }}>
                    <div style={{ background: "rgba(0,0,0,0.32)", borderRadius: 10, padding: "8px 10px", fontWeight: 800, color: "white" }}>{product.name}</div>
                  </div>
                  <div className="product-body">
                    <div className="badge">{product.label}</div>
                    <div style={{ marginBottom: 8, fontWeight: 800 }}>{product.amount.toLocaleString("fr-FR")} FCFA</div>
                    <div className="muted">Gain quotidien : {product.dailyReturn.toLocaleString("fr-FR")} FCFA</div>
                    <form action={investAction} style={{ marginTop: 14 }}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button className="btn btn-primary" type="submit">Investir</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

async function investAction(formData: FormData) {
  "use server";

  const user = await requireUser();
  const productId = String(formData.get("productId") ?? "");
  const product = await prisma.investmentProduct.findUnique({ where: { id: productId } });
  if (!product) redirect("/dashboard");

  if (user.balance < product.amount) {
    redirect("/dashboard");
  }

  const investedAt = new Date();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      balance: user.balance - product.amount,
      totalInvested: user.totalInvested + product.amount,
    },
  });

  await prisma.investment.create({
    data: {
      userId: user.id,
      productId: product.id,
      amount: product.amount,
      dailyReturn: product.dailyReturn,
      totalReturn: product.totalReturn,
      durationDays: product.durationDays,
      nextPayoutAt: new Date(investedAt.getTime() + 24 * 60 * 60 * 1000),
      totalPaid: 0,
      status: "ACTIVE",
    },
  });

  redirect("/dashboard");
}

async function logoutAction() {
  "use server";
  cookies().delete("session_user_id");
  redirect("/login");
}
