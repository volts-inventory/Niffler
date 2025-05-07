import { Routes, Route, Link } from "react-router-dom";
import FilterPanel from "./components/FilterPanel";
import ProductCard from "./components/ProductCard";
import Loader from "./components/Loader";
import { useGeoPosition } from "./hooks/useGeoPosition";
import { getProducts } from "./api";
import { useState, useEffect, useRef } from "react";

function Navbar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#896A58",
      color: "white",
      fontWeight: "bold",
      marginBottom: "1rem",
      border: '1px solid rgb(215, 204, 200)',
      "border-radius": "12px"
    }}>
      <div style={{ fontSize: "1.2rem",  color: "#f8f6e3"}}>🌿 Seeking Mary</div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link to="/" style={{ color: "#f8f6e3", textDecoration: "none" }}>Find Cheap Herb</Link>
        <Link to="/about" style={{ color: "#f8f6e3", textDecoration: "none" }}>About</Link>
      </div>
    </div>
  );
}

function ProductPage() {
  const { pos, error } = useGeoPosition();
  const [products, setProducts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const runSearch = (formValues) => {
    if (!pos) return;
    getProducts({ ...formValues, ...pos }).then((data) => {
      setProducts(data);
      setCurrentPage(1);
    });
  };

  useEffect(() => {
    if (pos && products === null) {
      runSearch({
        brand: "All",
        type: "Flower",
        store: "All",
        date: new Date().toISOString().split("T")[0],
        thc: 20,
        max_price: 100,
        max_distance_km: 50,
      });
    }
  }, [pos]);

  if (error) return <p>Error: {error}</p>;
  if (!pos) return <Loader />;

  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;
  const currentProducts = products?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: window.innerWidth < 768 ? "column" : "row",
        padding: "1rem",
        maxWidth: 1200,
        margin: "0 auto",
        gap: "1rem"
      }}
    >
      <div style={{ flexShrink: 0, width: window.innerWidth < 768 ? "100%" : "280px" }}>
        <FilterPanel coords={pos} onSearch={runSearch} />
      </div>
      <div style={{ flexGrow: 1 }}>
        {products?.length === 0 ? (
          <p>No results match those filters.</p>
        ) : (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 2fr))",
              gap: "1rem"
            }}>
              {currentProducts.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>← Prev</button>
                <span style={{ margin: "0 1rem" }}>Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AboutPage() {
  return <div style={{ textAlign: "center", padding: "2rem", color: "#5d4037" }}><h2>About This Project</h2><p>This page is under construction.</p></div>;
}

export default function App() {
  const prevWidth = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;

      const prevIsMobile = prevWidth.current < 768;
      const currIsMobile = currentWidth < 768;

      if (prevIsMobile !== currIsMobile) {
        window.location.reload();
      }

      prevWidth.current = currentWidth;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}
