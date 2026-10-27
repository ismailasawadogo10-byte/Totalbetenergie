import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { allowedCountries, getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="page-shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="card" style={{ width: "100%", maxWidth: 540 }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div className="brand-mark" style={{ margin: "0 auto 14px" }}>T</div>
          <h1 style={{ margin: 0 }}>Créer un compte</h1>
        </div>

        <form action={registerAction} className="form-grid">
          <label className="label">
            Nom complet
            <input className="input" name="name" required />
          </label>

          <label className="label">
            Pays
            <select className="select" name="country" required>
              <option value="">Choisissez votre pays</option>
              {allowedCountries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </label>

          <label className="label">
            Numéro de téléphone
            <input className="input" name="phone" placeholder="Ex : 97000001" required />
          </label>

          <label className="label">
            Mot de passe
            <input className="input" name="password" type="password" minLength={6} required />
          </label>

          <label className="label">
            Code de parrainage
            <input className="input" name="referralCode" placeholder="Optionnel" />
          </label>

          <button className="btn btn-primary" type="submit">S’inscrire</button>
        </form>

        <div style={{ marginTop: 18, textAlign: "center", color: "#475569" }}>
          Vous avez déjà un compte ? <a href="/login" style={{ color: "#1d7a43", fontWeight: 700 }}>Connexion</a>
        </div>
      </div>
    </main>
  );
}

async function registerAction(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const referralCode = String(formData.get("referralCode") ?? "").trim();

  if (!name || !country || !phone || !password) redirect("/register");

  const validCountry = allowedCountries.some((item) => item === country);
  if (!validCountry) redirect("/register");

  const existingUser = await prisma.user.findFirst({
    where: {
      country,
      phone,
    },
  });

  if (existingUser) redirect("/register");

  const passwordHash = await bcrypt.hash(password, 10);
  const generatedEmail = `${phone}@${country.replace(/\s+/g, "").toLowerCase()}.local`;

  const user = await prisma.user.create({
    data: {
      name,
      email: generatedEmail,
      phone,
      country,
      passwordHash,
      balance: 500,
      role: "USER",
      referredBy: referralCode || null,
    },
  });

  cookies().set("session_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}
