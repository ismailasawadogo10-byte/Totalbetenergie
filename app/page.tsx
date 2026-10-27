import prisma from "@/lib/prisma";
import { ensureSeedData, getProducts, getSettings } from "@/lib/auth";

export default async function HomePage() {
  await ensureSeedData();
  const products = await getProducts();
  const settings = await getSettings();

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">T</div>
            <span>{settings.logoText}</span>
          </div>
          <nav className="nav-links">
            <a href="#produits">Produits</a>
            <a href="#avantages">Avantages</a>
            <a href="#contact">Contact</a>
            <a href="/login" className="btn btn-primary">Connexion</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div>
              <div className="badge" style={{ background: "rgba(245,201,74,0.18)", color: "#f5c94a" }}>Investissement 180 jours</div>
              <h1>Investissez dans l’énergie de demain.</h1>
              <p>
                Total Énergie vous permet de faire croître votre capital en toute simplicité avec des rendements journaliers, une validation manuelle de dépôts et une plateforme pensée pour les marchés Bénin, Cameroun, Côte d’Ivoire, Burkina Faso et Niger.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a className="btn btn-primary" href="/register">Créer un compte</a>
                <a className="btn btn-warning" href="/login">Se connecter</a>
              </div>
              <div className="hero-stat-grid">
                <div className="stat-box">
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Gain journalier</div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 800 }}>+25% / +3% / +2%</div>
                </div>
                <div className="stat-box">
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Montant min</div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 800 }}>2 000 FCFA</div>
                </div>
              </div>
            </div>

            <div className="hero-card">
              <div style={{ fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", opacity: 0.76, marginBottom: 16 }}>Pays autorisés</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {settings.allowedCountries.map((country) => (
                  <span key={country} style={{ background: "rgba(245,201,74,0.18)", color: "#f7d777", borderRadius: 999, padding: "8px 12px", fontWeight: 700, fontSize: "0.82rem" }}>{country}</span>
                ))}
              </div>
              <div style={{ marginTop: 22 }}>
                <div style={{ fontSize: 14, opacity: 0.8 }}>Canal Telegram</div>
                <div style={{ marginTop: 12 }}>
                  <a className="btn btn-telegram" href={settings.telegramLink} target="_blank" rel="noreferrer">Rejoindre le canal</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell" id="produits">
          <div style={{ marginTop: 30 }}>
            <h2 className="section-title">Nos produits d’investissement</h2>
            <p className="muted">Des plans conçus pour générer des gains quotidiens sur 180 jours.</p>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-visual" style={{ backgroundImage: `url('${product.imageUrl}')` }}>
                  <div style={{ background: "rgba(10, 19, 15, 0.32)", borderRadius: 12, padding: "8px 10px", fontWeight: 800, color: "white" }}>{product.name}</div>
                </div>
                <div className="product-body">
                  <div className="badge">{product.label}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 8 }}>{product.amount.toLocaleString("fr-FR")} FCFA</div>
                  <div style={{ color: "#475569", lineHeight: 1.7 }}>
                    <div>Gain quotidien : {product.dailyReturn.toLocaleString("fr-FR")} FCFA</div>
                    <div>Rendement total : {product.totalReturn.toLocaleString("fr-FR")} FCFA</div>
                    <div>Durée : {product.durationDays} jours</div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <a className="btn btn-primary" href="/register">Investir</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="page-shell" id="avantages">
          <div className="card" style={{ marginTop: 30 }}>
            <h3 className="section-title" style={{ fontSize: "2rem" }}>Pourquoi choisir Total Énergie ?</h3>
            <div className="dashboard-grid">
              <div className="metric-card">
                <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8 }}>Paiement instantané</div>
                <div className="muted">Dépôts et retraits gérés avec validation manuelle sécurisée.</div>
              </div>
              <div className="metric-card">
                <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8 }}>Gain quotidien</div>
                <div className="muted">Des gains calculés automatiquement sur 180 jours.</div>
              </div>
              <div className="metric-card">
                <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8 }}>Parrainage</div>
                <div className="muted">25% / 3% / 2% sur 3 niveaux pour fidéliser votre réseau.</div>
              </div>
              <div className="metric-card">
                <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8 }}>Support Telegram</div>
                <div className="muted">Accès direct au canal et au support client.</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
