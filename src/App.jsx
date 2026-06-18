import { useState, useRef, useEffect, useCallback } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const INVESTMENTS = [
  {
    id: 1,
    address: "4218 Kingshighway Blvd",
    city: "St. Louis, MO 63116",
    type: "Single Family · 3BR / 2BA",
    sqft: "1,840",
    purchasePrice: "$72,000",
    rehabBudget: "$48,000",
    arv: "$165,000",
    totalNeeded: "$120,000",
    projectedProfit: "$45,000",
    roi: "37.5",
    timeline: "6–8 months",
    contractType: "Equity Partnership",
    investorShare: "40% of net proceeds",
    exitStrategy: "Sell at ARV",
    highlights: ["New roof (2024)", "HVAC replaced", "Full kitchen remodel planned", "Bevo Mill — actively appreciating"],
  },
  {
    id: 2,
    address: "1102 N 20th Street",
    city: "St. Louis, MO 63106",
    type: "Duplex · 2 × (2BR / 1BA)",
    sqft: "2,400",
    purchasePrice: "$55,000",
    rehabBudget: "$62,000",
    arv: "$155,000",
    totalNeeded: "$117,000",
    projectedProfit: "$38,000",
    roi: "32.5",
    timeline: "5–7 months",
    contractType: "Preferred Return + Equity",
    investorShare: "35% equity + 8% preferred",
    exitStrategy: "BRRRR — Refinance & Hold",
    highlights: ["Tenant in place (Unit 1)", "Near SLU Medical Center", "Dual income potential", "Strong rental demand"],
  },
  {
    id: 3,
    address: "822 Sycamore Lane",
    city: "Quincy, IL 62301",
    type: "Single Family · 4BR / 2BA",
    sqft: "2,100",
    purchasePrice: "$68,000",
    rehabBudget: "$41,000",
    arv: "$148,000",
    totalNeeded: "$109,000",
    projectedProfit: "$39,000",
    roi: "35.8",
    timeline: "4–6 months",
    contractType: "Equity Partnership",
    investorShare: "38% of net proceeds",
    exitStrategy: "Sell at ARV",
    highlights: ["Corner lot", "Full unfinished basement", "New electrical panel", "Top-rated school district"],
  },
];

const BEFORE_AFTER = [
  { id: 1, address: "3404 Utah Street", city: "St. Louis, MO", completed: "March 2024", salePrice: "$142,000", profit: "$41,200", img: "https://picsum.photos/seed/mwhome11/900/675" },
  { id: 2, address: "917 Hampshire Ave", city: "St. Louis, MO", completed: "August 2023", salePrice: "$168,000", profit: "$52,400", img: "https://picsum.photos/seed/mwhome22/900/675" },
  { id: 3, address: "2218 Osage Street", city: "St. Louis, MO", completed: "November 2023", salePrice: "$155,000", profit: "$38,700", img: "https://picsum.photos/seed/mwhome33/900/675" },
  { id: 4, address: "1507 Pestalozzi St", city: "St. Louis, MO", completed: "January 2024", salePrice: "$178,000", profit: "$59,100", img: "https://picsum.photos/seed/mwhome44/900/675" },
];

const RENTALS = [
  { id: 1, address: "5512 Gravois Ave", city: "St. Louis, MO 63116", type: "2BR / 1BA", sqft: "980", rent: "950", available: false, features: ["Central air", "Hardwood floors", "Off-street parking", "Updated kitchen"] },
  { id: 2, address: "1441 Arkansas Ave", city: "St. Louis, MO 63104", type: "3BR / 1BA", sqft: "1,240", rent: "1,150", available: true, features: ["W/D hookups", "Fenced yard", "Basement storage", "Near Tower Grove Park"] },
  { id: 3, address: "744 Park Place Drive", city: "Quincy, IL 62301", type: "2BR / 2BA", sqft: "1,100", rent: "875", available: true, features: ["Pet friendly", "In-unit laundry", "Garage included", "Quiet street"] },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700&family=Inter:wght@300;400;500;600&family=Space+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0D0D0B; overflow-x: hidden; }

  /* ── Nav ── */
  .mw-nav-desktop { display: flex; gap: 28px; align-items: center; }
  .mw-hamburger   { display: none; background: transparent; border: none; cursor: pointer; color: #FDFCFA; padding: 4px; }
  .mw-mobile-overlay { display: none; }

  /* ── Layout grids ── */
  .mw-section { padding: 96px 52px; }
  .mw-hero-section { padding: 138px 52px 96px; }
  .mw-about-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .mw-invest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2px; background: rgba(192,154,60,0.14); }
  .mw-ba-grid     { display: grid; grid-template-columns: repeat(auto-fill, minmax(440px, 1fr)); gap: 36px; }
  .mw-rental-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2px; background: #DDD6CA; }
  .mw-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 54px; margin-bottom: 54px; }
  .mw-footer-bottom { display: flex; justify-content: space-between; align-items: center; }
  .mw-cta-strip   { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; padding: 58px 52px; }
  .mw-hero-stats  { display: flex; gap: 52px; flex-wrap: wrap; margin-bottom: 48px; }
  .mw-hero-actions{ display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
  .mw-portrait    { display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .mw-track-grid  { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #E5DFD5; }

  /* ── Interactions ── */
  .mw-nav-link:hover   { color: #C09A3C !important; }
  .mw-invest-cta:hover { opacity: 0.88; }
  .mw-ghost-btn:hover  { background: #0D0D0B !important; color: #F7F3EC !important; }

  /* ──────────────────────────────────────────
     TABLET  ≤ 1024px
  ────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .mw-section       { padding: 80px 36px; }
    .mw-hero-section  { padding: 120px 36px 80px; }
    .mw-about-grid    { gap: 48px; }
    .mw-footer-grid   { grid-template-columns: 1fr 1fr; gap: 36px; }
    .mw-ba-grid       { grid-template-columns: 1fr; gap: 28px; }
    .mw-cta-strip     { padding: 52px 36px; }
    .mw-hero-stats    { gap: 36px; }
  }

  /* ──────────────────────────────────────────
     MOBILE  ≤ 768px
  ────────────────────────────────────────── */
  @media (max-width: 768px) {
    /* Nav */
    .mw-nav-desktop { display: none !important; }
    .mw-hamburger   { display: flex !important; }

    /* Overlay (activated by .open class via React) */
    .mw-mobile-overlay.open {
      display: flex;
      flex-direction: column;
      position: fixed; inset: 0;
      background: rgba(13,13,11,0.98);
      z-index: 200;
      padding: 80px 28px 40px;
    }

    /* Sections */
    .mw-section      { padding: 60px 20px; }
    .mw-hero-section { padding: 96px 20px 60px; }

    /* Grids → single column */
    .mw-about-grid  { grid-template-columns: 1fr !important; gap: 36px !important; }
    .mw-invest-grid { grid-template-columns: 1fr !important; }
    .mw-ba-grid     { grid-template-columns: 1fr !important; gap: 24px !important; }
    .mw-rental-grid { grid-template-columns: 1fr !important; }
    .mw-footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; margin-bottom: 36px; }

    /* Strip / footer */
    .mw-cta-strip     { flex-direction: column; align-items: flex-start; padding: 44px 20px; }
    .mw-footer-bottom { flex-direction: column; gap: 8px; align-items: flex-start; }

    /* Hero stats: wrap into 2-col feel */
    .mw-hero-stats  { gap: 24px; }
    .mw-hero-stat   { min-width: calc(50% - 12px); }

    /* Hide portrait on small screens to reduce scroll weight */
    .mw-portrait { display: none !important; }

    /* Nav padding */
    .mw-nav-outer { padding: 14px 20px !important; }
  }
`;

// ─── Before/After Slider ───────────────────────────────────────────────────────

function BASlider({ img }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);

  const updatePos = useCallback((clientX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(2, Math.min(clientX - rect.left, rect.width - 2));
    setPos((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => updatePos(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, updatePos]);

  const label = (side) => ({
    position: "absolute", bottom: "10px", [side]: "10px",
    fontFamily: "'Space Mono', monospace", fontSize: "0.56rem",
    letterSpacing: "0.16em", textTransform: "uppercase",
    color: "white", background: "rgba(0,0,0,0.62)",
    padding: "4px 9px", backdropFilter: "blur(6px)",
    zIndex: 1, pointerEvents: "none",
  });

  return (
    <div
      ref={ref}
      onMouseDown={(e) => { setDragging(true); updatePos(e.clientX); }}
      onTouchMove={(e) => { e.preventDefault(); updatePos(e.touches[0].clientX); }}
      onTouchStart={(e) => updatePos(e.touches[0].clientX)}
      onClick={(e) => updatePos(e.clientX)}
      style={{
        position: "relative", width: "100%", paddingBottom: "75%",
        overflow: "hidden", cursor: "col-resize", userSelect: "none",
        border: "1px solid rgba(192,154,60,0.2)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(1) brightness(0.46) contrast(1.12)" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "saturate(1.15) brightness(1.06)" }} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: "2px", background: "#C09A3C", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, pointerEvents: "none" }}>
        <div style={{ width: "36px", height: "36px", background: "#C09A3C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 5px rgba(192,154,60,0.22), 0 2px 14px rgba(0,0,0,0.5)", flexShrink: 0 }}>
          <svg width="15" height="9" viewBox="0 0 15 9" fill="none"><path d="M1 4.5H14M1 4.5L4.5 1.5M1 4.5L4.5 7.5M14 4.5L10.5 1.5M14 4.5L10.5 7.5" stroke="#0D0D0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <div style={label("left")}>Before</div>
      <div style={label("right")}>After</div>
    </div>
  );
}

// ─── Investment Card ───────────────────────────────────────────────────────────

function InvestCard({ data }) {
  const [open, setOpen] = useState(false);
  const G = "#C09A3C";

  return (
    <div style={{ background: "#0F0F0D", padding: "28px" }}>
      <div style={{ display: "inline-block", fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#0D0D0B", background: G, padding: "4px 10px", marginBottom: "14px" }}>
        Seeking Investors
      </div>
      <div style={{ borderBottom: "1px solid rgba(192,154,60,0.12)", paddingBottom: "16px", marginBottom: "20px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#FDFCFA", marginBottom: "3px" }}>{data.address}</div>
        <div style={{ fontSize: "0.75rem", color: "#6E6D68" }}>{data.city}</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#9E9D98", marginTop: "7px" }}>{data.type} · {data.sqft} SF</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        {[["Purchase Price", data.purchasePrice, false], ["Rehab Budget", data.rehabBudget, false], ["After-Repair Value", data.arv, false], ["Total Capital Needed", data.totalNeeded, false], ["Projected Profit", data.projectedProfit, false], ["Projected ROI", data.roi + "%", true]].map(([l, v, hi]) => (
          <div key={l}>
            <div style={{ fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6E6D68", marginBottom: "4px" }}>{l}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: hi ? "1.45rem" : "0.98rem", fontWeight: 700, color: hi ? G : "#FDFCFA" }}>{v}</div>
          </div>
        ))}
      </div>

      <ul style={{ listStyle: "none", marginBottom: "20px" }}>
        {data.highlights.map(h => (
          <li key={h} style={{ fontSize: "0.76rem", color: "#9E9D98", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "4px", height: "4px", background: G, display: "inline-block", flexShrink: 0 }} />{h}
          </li>
        ))}
      </ul>

      <button onClick={() => setOpen(!open)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "1px solid rgba(192,154,60,0.22)", color: G, padding: "11px 15px", fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: open ? "0" : "16px" }}>
        Contract Structure
        <span style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </button>

      {open && (
        <div style={{ background: "rgba(192,154,60,0.04)", border: "1px solid rgba(192,154,60,0.15)", borderTop: "none", padding: "14px", marginBottom: "16px" }}>
          {[["Structure", data.contractType], ["Investor Share", data.investorShare], ["Timeline", data.timeline], ["Exit Strategy", data.exitStrategy]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", fontSize: "0.78rem", padding: "7px 0", borderBottom: "1px solid rgba(192,154,60,0.06)" }}>
              <span style={{ color: "#6E6D68", flexShrink: 0, marginRight: "12px" }}>{l}</span>
              <span style={{ color: "#FDFCFA", fontWeight: 500, textAlign: "right", lineHeight: 1.4 }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      <button className="mw-invest-cta" style={{ width: "100%", background: G, color: "#0D0D0B", border: "none", padding: "13px", fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
        Request Investment Packet
      </button>
    </div>
  );
}

// ─── Rental Card ───────────────────────────────────────────────────────────────

function RentalCard({ data }) {
  return (
    <div style={{ background: "#F7F3EC", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(145deg, #1A2635 0%, #0C1520 100%)", aspectRatio: "16/9", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", color: "rgba(192,154,60,0.35)", textTransform: "uppercase" }}>Property Photo</span>
        <span style={{ position: "absolute", top: "12px", right: "12px", fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 10px", background: data.available ? "rgba(18,70,38,0.92)" : "rgba(0,0,0,0.55)", color: data.available ? "#7DD3A8" : "#9E9D98" }}>
          {data.available ? "Available" : "Occupied"}
        </span>
      </div>
      <div style={{ padding: "24px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600, color: "#0D0D0B", marginBottom: "2px" }}>{data.address}</div>
        <div style={{ fontSize: "0.73rem", color: "#9E9D98", marginBottom: "4px" }}>{data.city}</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#9E9D98", marginBottom: "16px" }}>{data.type} · {data.sqft} SF</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.85rem", fontWeight: 700, color: "#0D0D0B" }}>
          ${data.rent}<span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.76rem", fontWeight: 400, color: "#9E9D98" }}> /mo</span>
        </div>
        <ul style={{ listStyle: "none", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #E5DFD5", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {data.features.map(f => (
            <li key={f} style={{ fontSize: "0.73rem", color: "#6E6D68", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "3px", height: "3px", background: "#8A6E28", display: "inline-block", flexShrink: 0 }} />{f}
            </li>
          ))}
        </ul>
        <button style={{ marginTop: "18px", width: "100%", background: "transparent", border: `1px solid ${data.available ? "#0D0D0B" : "#C5BFB7"}`, color: data.available ? "#0D0D0B" : "#C5BFB7", padding: "12px", fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", cursor: data.available ? "pointer" : "not-allowed" }} disabled={!data.available}>
          {data.available ? "Inquire About This Unit" : "Currently Occupied"}
        </button>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const G = "#C09A3C";
  const INK = "#0D0D0B";
  const PARCH = "#F7F3EC";
  const MUTED = "#6E6D68";
  const MUTED_L = "#9E9D98";
  const WHITE = "#FDFCFA";
  const mono = "'Space Mono', monospace";
  const serif = "'Playfair Display', serif";

  const navLinks = [["about","About"],["invest","Invest"],["portfolio","Portfolio"],["rentals","Rentals"]];

  const Eyebrow = ({ text, dark }) => (
    <p style={{ fontFamily: mono, fontSize: "0.65rem", letterSpacing: "0.24em", textTransform: "uppercase", color: dark ? "#8A6E28" : G, marginBottom: "14px" }}>{text}</p>
  );
  const Title = ({ children, light }) => (
    <h2 style={{ fontFamily: serif, fontSize: "clamp(1.85rem, 5vw, 2.7rem)", fontWeight: 700, lineHeight: 1.08, marginBottom: "14px", color: light ? INK : WHITE }}>{children}</h2>
  );
  const Sub = ({ children }) => (
    <p style={{ fontSize: "0.91rem", fontWeight: 300, color: MUTED, lineHeight: 1.78, maxWidth: "500px", marginBottom: "46px" }}>{children}</p>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: INK, color: WHITE, overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* ── Mobile overlay menu ── */}
      <div className={`mw-mobile-overlay ${menuOpen ? "open" : ""}`}>
        <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "18px", right: "20px", background: "transparent", border: "none", cursor: "pointer", color: WHITE }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M17 5L5 17M5 5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <div style={{ fontFamily: serif, fontSize: "1.1rem", fontWeight: 700, marginBottom: "44px" }}>MW<span style={{ color: G }}>&</span> Properties</div>
        {navLinks.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} style={{ fontFamily: mono, fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED_L, textDecoration: "none", padding: "18px 0", borderBottom: "1px solid rgba(192,154,60,0.1)" }}>
            {label}
          </a>
        ))}
        <a href="#contact" onClick={() => setMenuOpen(false)} style={{ display: "inline-block", marginTop: "30px", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: INK, background: G, padding: "14px 28px", textDecoration: "none", alignSelf: "flex-start" }}>
          Contact Marcus
        </a>
      </div>

      {/* ── NAV ── */}
      <nav className="mw-nav-outer" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "22px 52px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(13,13,11,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(192,154,60,0.15)" : "none",
        transition: "all 0.32s ease",
      }}>
        <span style={{ fontFamily: serif, fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.04em" }}>
          MW<span style={{ color: G }}>&</span> Properties
        </span>
        <div className="mw-nav-desktop">
          {navLinks.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="mw-nav-link" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED_L, textDecoration: "none", transition: "color 0.18s" }}>
              {label}
            </a>
          ))}
          <a href="#contact" style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: INK, background: G, padding: "10px 22px", textDecoration: "none" }}>
            Contact Marcus
          </a>
        </div>
        <button className="mw-hamburger" onClick={() => setMenuOpen(true)}>
          <svg width="22" height="15" viewBox="0 0 22 15" fill="none"><path d="M1 1H21M1 7.5H21M1 14H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="mw-hero-section" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 72% 40%, rgba(192,154,60,0.08) 0%, transparent 58%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(192,154,60,0.038) 1px, transparent 1px), linear-gradient(90deg, rgba(192,154,60,0.038) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1060px" }}>
          <p style={{ fontFamily: mono, fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: G, marginBottom: "24px" }}>
            St. Louis · Quincy, IL — Est. 2014
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(2.6rem, 10vw, 5.8rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.022em", color: WHITE, marginBottom: "22px" }}>
            Turning <em style={{ color: G, fontStyle: "italic" }}>Distressed</em><br />
            Into Distinguished
          </h1>
          <p style={{ fontSize: "1rem", fontWeight: 300, color: MUTED_L, maxWidth: "440px", lineHeight: 1.76, marginBottom: "44px" }}>
            MW Properties acquires, renovates, and manages residential real estate — partnering with select investors to generate above-market returns.
          </p>

          <div className="mw-hero-stats">
            {[["24+","Properties Flipped"],["$2.1M","Total Project Value"],["34%","Avg. Investor ROI"],["8","Active Rental Units"]].map(([n,l]) => (
              <div key={l} className="mw-hero-stat">
                <div style={{ fontFamily: serif, fontSize: "clamp(1.9rem, 5vw, 2.4rem)", fontWeight: 700, color: WHITE, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: mono, fontSize: "0.56rem", letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginTop: "6px" }}>{l}</div>
              </div>
            ))}
          </div>

          <div className="mw-hero-actions">
            <a href="#invest" style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: INK, background: G, padding: "15px 32px", textDecoration: "none" }}>
              View Investment Deals
            </a>
            <a href="#portfolio" style={{ fontSize: "0.76rem", fontWeight: 400, color: MUTED_L, textDecoration: "none", borderBottom: "1px solid rgba(192,154,60,0.3)", paddingBottom: "2px" }}>
              See the Work →
            </a>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="mw-section" style={{ background: PARCH, color: INK }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <div className="mw-about-grid">
            {/* Portrait — hidden on mobile via CSS */}
            <div className="mw-portrait" style={{ background: "linear-gradient(155deg, #1C2A39 0%, #0B1520 100%)", aspectRatio: "4/5", position: "relative", border: "1px solid rgba(192,154,60,0.18)", gap: "10px" }}>
              <div style={{ fontFamily: serif, fontSize: "clamp(5rem, 10vw, 9rem)", fontWeight: 900, color: "rgba(192,154,60,0.1)", lineHeight: 1, userSelect: "none" }}>M</div>
              <div style={{ fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.18em", color: "rgba(192,154,60,0.38)", textTransform: "uppercase" }}>Photo Coming Soon</div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: G }} />
            </div>

            <div>
              <Eyebrow text="About Marcus" dark />
              <Title light>A Decade of Doing the Work</Title>
              <p style={{ fontSize: "0.91rem", fontWeight: 300, color: MUTED, lineHeight: 1.8, marginBottom: "16px" }}>
                Marcus has spent over a decade acquiring undervalued residential properties across St. Louis and Quincy, IL — rehabilitating them with hands-on craftsmanship and disciplined project management.
              </p>
              <p style={{ fontSize: "0.91rem", fontWeight: 300, color: MUTED, lineHeight: 1.8, marginBottom: "32px" }}>
                His model is built on trusted contractor relationships, conservative underwriting, and full transparency with every investment partner. Every deal is open-book from acquisition through closing.
              </p>
              <div className="mw-track-grid">
                {[["24+","Flips Completed"],["$2.1M+","Total Project Volume"],["100%","Investor Returns Delivered"],["8","Rental Units Managed"]].map(([n,l],i) => (
                  <div key={l} style={{ padding: "20px", borderRight: i % 2 === 0 ? "1px solid #E5DFD5" : "none", borderBottom: i < 2 ? "1px solid #E5DFD5" : "none" }}>
                    <div style={{ fontFamily: serif, fontSize: "1.65rem", fontWeight: 700, color: INK }}>{n}</div>
                    <div style={{ fontSize: "0.7rem", color: MUTED_L, marginTop: "4px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INVESTMENTS ── */}
      <section id="invest" className="mw-section" style={{ background: "#111110" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <Eyebrow text="Current Opportunities" />
          <Title>Open Investment Deals</Title>
          <Sub>Each project is actively seeking investor capital. All deals come with full documentation — request any packet for due diligence materials, comps, and contract drafts.</Sub>
          <div className="mw-invest-grid">
            {INVESTMENTS.map(inv => <InvestCard key={inv.id} data={inv} />)}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section id="portfolio" className="mw-section" style={{ background: "#191816" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <Eyebrow text="Completed Projects" />
          <Title>Before &amp; After</Title>
          <p style={{ fontSize: "0.91rem", fontWeight: 300, color: MUTED, lineHeight: 1.78, maxWidth: "500px", marginBottom: "8px" }}>
            Drag the divider on any project to reveal the full transformation. Real completed deals — every one on time and on budget.
          </p>
          <p style={{ fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.16em", color: "rgba(192,154,60,0.42)", marginBottom: "40px" }}>← Drag to compare →</p>
          <div className="mw-ba-grid">
            {BEFORE_AFTER.map(ba => (
              <div key={ba.id}>
                <BASlider img={ba.img} />
                <div style={{ paddingTop: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(192,154,60,0.12)" }}>
                  <div style={{ fontFamily: serif, fontSize: "1rem", fontWeight: 600, color: WHITE }}>{ba.address}</div>
                  <div style={{ fontSize: "0.72rem", color: MUTED, marginBottom: "12px" }}>{ba.city} · Completed {ba.completed}</div>
                  <div style={{ display: "flex", gap: "28px" }}>
                    {[["Sale Price", ba.salePrice], ["Profit Delivered", ba.profit]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: "0.57rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>{l}</div>
                        <div style={{ fontFamily: serif, fontSize: "0.98rem", fontWeight: 600, color: G, marginTop: "2px" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RENTALS ── */}
      <section id="rentals" className="mw-section" style={{ background: PARCH, color: INK }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <Eyebrow text="Managed Portfolio" dark />
          <Title light>Rental Properties</Title>
          <Sub>Renovated, professionally managed, and move-in ready. Available units are first-come basis — waitlist open for occupied properties.</Sub>
          <div className="mw-rental-grid">
            {RENTALS.map(r => <RentalCard key={r.id} data={r} />)}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <div className="mw-cta-strip" style={{ background: G }}>
        <div>
          <div style={{ fontFamily: serif, fontSize: "clamp(1.3rem, 4vw, 1.6rem)", fontWeight: 700, color: INK, marginBottom: "6px" }}>Ready to Invest With Marcus?</div>
          <div style={{ fontSize: "0.87rem", color: "rgba(13,13,11,0.6)" }}>Full deal packets available on request. Let's talk numbers.</div>
        </div>
        <a href="#contact" className="mw-ghost-btn" style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: G, background: INK, padding: "14px 32px", textDecoration: "none", transition: "all 0.2s", whiteSpace: "nowrap" }}>
          Get in Touch →
        </a>
      </div>

      {/* ── FOOTER ── */}
      <footer id="contact" className="mw-section" style={{ background: INK, borderTop: "1px solid rgba(192,154,60,0.12)" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <div className="mw-footer-grid">
            <div>
              <div style={{ fontFamily: serif, fontSize: "1.12rem", fontWeight: 700, marginBottom: "12px" }}>MW<span style={{ color: G }}>&</span> Properties</div>
              <p style={{ fontSize: "0.81rem", color: MUTED, lineHeight: 1.72, maxWidth: "270px" }}>
                Acquiring distressed properties. Delivering renovated homes and above-market investor returns across St. Louis and Quincy, IL.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: mono, fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: G, marginBottom: "16px" }}>Navigate</div>
              {navLinks.map(([id, label]) => (
                <div key={id} style={{ marginBottom: "10px" }}>
                  <a href={`#${id}`} style={{ fontSize: "0.81rem", color: MUTED, textDecoration: "none" }}>{label}</a>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: mono, fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: G, marginBottom: "16px" }}>Contact</div>
              {[["Email","marcus@mwproperties.com"],["Phone","(314) 555-0192"],["Markets","St. Louis · Quincy, IL"]].map(([l,v]) => (
                <div key={l} style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED_L, marginBottom: "2px" }}>{l}</div>
                  <div style={{ fontSize: "0.81rem", color: MUTED }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mw-footer-bottom" style={{ borderTop: "1px solid rgba(192,154,60,0.1)", paddingTop: "22px" }}>
            <div style={{ fontSize: "0.67rem", color: MUTED }}>© 2024 MW Properties & Investments. All rights reserved.</div>
            <div style={{ fontFamily: mono, fontSize: "0.54rem", letterSpacing: "0.12em", color: MUTED }}>
              Built by <span style={{ color: G }}>DTE Solutions</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
