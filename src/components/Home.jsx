import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileInvoiceDollar, FaTasks, FaBoxes, FaArrowRight } from "react-icons/fa";
import Header from "./Header";
import "./Home.css";

function Home({ customers = [], setActiveCustomerIndex, setEditingQuotation }) {
  const navigate = useNavigate();

  // Prefetch Products bundle on hover/focus
  const prefetchProducts = useCallback(() => {
    import("./ImageCards").catch(() => {});
  }, []);

  // Metrics (This Week now reflects by using `quotationCreatedAt` or customerDetails.date)
  const metrics = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    let quotes = 0;
    let quotesThisWeek = 0;
    let itemCount = 0;
    let totalValue = 0;

    const toDate = (v) => {
      if (!v) return null;
      const d = new Date(v);
      return isNaN(d) ? null : d;
    };

    customers?.forEach((c) => {
      if (!c?.quotationNumber) return;
      quotes += 1;

      const created = toDate(c?.quotationCreatedAt) || toDate(c?.customerDetails?.date);
      if (created && created >= weekAgo && created <= now) quotesThisWeek += 1;

      const sysItems = Array.isArray(c?.systemItems) ? c.systemItems : [];
      const addOns = Array.isArray(c?.addOnItems) ? c.addOnItems : [];

      itemCount += sysItems.filter((i) => i?.price != null).length;
      itemCount += addOns.filter((i) => i?.price != null).length;

      const sysTotal = sysItems.reduce((s, i) => s + (Number(i?.price) || 0), 0);
      const addTotal = addOns.reduce((s, i) => s + (Number(i?.price) || 0), 0);
      totalValue += sysTotal + addTotal;
    });

    const avgValue = quotes ? Math.round(totalValue / quotes) : 0;
    return {
      quotes,
      quotesThisWeek,
      itemCount,
      totalValue: Math.round(totalValue),
      avgValue,
    };
  }, [customers]);

  // IMAGES (unchanged structure; only theme changed via CSS)
  const heroBg =
    "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=1600&q=80";
  const createImg =
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80";
  const manageImg =
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80";
  const productsImg =
    "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&w=1400&q=80";

  // Actions
  const handleNewQuotation = () => {
    setActiveCustomerIndex?.(null);
    setEditingQuotation?.(false);
    navigate("/customer", { state: { showQuotation: false } });
  };
  const handleManageQuotations = () => navigate("/manage-quotations");
  const goProducts = () => navigate("/products");

  return (
    <>
      <Header />
      <div className="home-dashboard">
        {/* HERO */}
        <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="hero-overlay" />
          <div className="hero-inner">
            <h1>
              DeskOps <span>Quotation Suite</span>
            </h1>
            <p>Build accurate, branded workspace quotations fast—then manage and export in a click.</p>
            <div className="hero-cta">
              <button className="cta primary" onClick={handleNewQuotation}>
                <FaFileInvoiceDollar aria-hidden /> New Quotation
              </button>
              <button className="cta" onClick={handleManageQuotations}>
                <FaTasks aria-hidden /> Manage Quotations
              </button>
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className="metrics" aria-label="Quotation metrics">
          <div className="metric">
            <div className="metric-num">{metrics.quotes}</div>
            <div className="metric-label">Total quotations</div>
          </div>
          <div className="metric">
            <div className="metric-num">{metrics.quotesThisWeek}</div>
            <div className="metric-label">This week</div>
          </div>
          <div className="metric">
            <div className="metric-num">{metrics.itemCount}</div>
            <div className="metric-label">Items quoted</div>
          </div>
          <div className="metric">
            <div className="metric-num">₹{metrics.totalValue.toLocaleString("en-IN")}</div>
            <div className="metric-label">Total value</div>
          </div>
          <div className="metric">
            <div className="metric-num">₹{metrics.avgValue.toLocaleString("en-IN")}</div>
            <div className="metric-label">Avg / quotation</div>
          </div>
        </section>

        {/* QUICK ACTION CARDS (same structure) */}
        <section className="action-grid">
          <article className="action-card" onClick={handleNewQuotation} tabIndex={0} role="button">
            <img src={createImg} alt="Create a new quotation" loading="lazy" decoding="async" />
            <div className="card-overlay" />
            <div className="card-content">
              <FaFileInvoiceDollar className="card-icon" />
              <h2>Create a new Quotation</h2>
              <p>Guided steps, smart defaults, and ready-to-export layouts.</p>
              <span className="linkish">Start <FaArrowRight aria-hidden /></span>
            </div>
          </article>

          <article className="action-card" onClick={handleManageQuotations} tabIndex={0} role="button">
            <img src={manageImg} alt="Manage existing quotations" loading="lazy" decoding="async" />
            <div className="card-overlay" />
            <div className="card-content">
              <FaTasks className="card-icon" />
              <h2>Manage Quotations</h2>
              <p>Review, update, compare versions, and export anytime.</p>
              <span className="linkish">Open <FaArrowRight aria-hidden /></span>
            </div>
          </article>

          <article
            className="action-card"
            onMouseEnter={prefetchProducts}
            onFocus={prefetchProducts}
            onClick={goProducts}
            tabIndex={0}
            role="button"
          >
            <img src={productsImg} alt="Browse products and categories" loading="lazy" decoding="async" />
            <div className="card-overlay" />
            <div className="card-content">
              <FaBoxes className="card-icon" />
              <h2>Products</h2>
              <p>Explore systems, components, and accessories to add to quotes.</p>
              <span className="linkish">Browse <FaArrowRight aria-hidden /></span>
            </div>
          </article>
        </section>
      </div>
    </>
  );
}

export default Home;