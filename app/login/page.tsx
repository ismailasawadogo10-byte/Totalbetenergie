import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="page-shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="card" style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div className="brand-mark" style={{ margin: "0 auto 14px" }}>T</div>
          <h1 style={{ margin: 0 }}>Connexion</h1>
        </div>

        <form action={loginAction} className="form-grid">
          <label className="label">
            Email
            <input className="input" name="email" type="email" required />
          </label>

          <label className="label">
            Mot de passe
            <input className="input" name="password" type="password" required />
          </label>

          <button className="btn btn-primary" type="submit">Se connecter</button>
        </form>

        <div style={{ marginTop: 18, textAlign: "center", color: "#475569" }}>
          Pas encore inscrit ? <a href="/register" style={{ color: "#1d7a43", fontWeight: 700 }}>Créer un compte</a>
        </div>
      </div>
    </main>
  );
}

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) redirect("/login");

  cookies().set("session_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}
