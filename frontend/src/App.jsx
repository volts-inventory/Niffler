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
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "#896A58",
      color: "white",
      fontWeight: "bold",
      border: "1px solid #00301e",
      "border-radius": "12px",
      "overflow": "hidden",
      "width": "100%",
      "justify-content": "space-between",
      "padding": "7px"
    }}>
      <img
        src="/mynameisjoe.png" 
        alt="Logo"
        style={{
          height: "auto",
          borderRadius: "20px",
          maxHeight: "70px"
        }}
      />
      <div style={{ 
        display: "block", 
        alignItems: "center", 
        textAlign: "center", 
        position: "absolute", 
        left: "50%", 
        transform: "translateX(-50%)" // transform must be a string!
      }}>
        <Link
          to="/"
          style={{
            fontSize: "2rem",
            color: "#053f28",
            textDecoration: "underline",
            textDecorationColor: "#053f28",         // soft green underline
            textUnderlineOffset: "4px",
            fontStyle: "italic",
            fontWeight: "800",
            textShadow: "1px 1pxrgb(5, 5, 0)",          // subtle shadow
            letterSpacing: "1px",
            transition: "color 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#0c6b4b";
            e.target.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#053f28";
            e.target.style.transform = "scale(1)";
          }}
        >
          Seeking Mary
        </Link>
      </div>
      <Link to="/dailyproduct"  style={{
          color: "#00301e",
          textDecoration: "none",
          border: "1px solid #00301e", // Add this
          padding: "0.5rem",                      // Optional: adds space inside the border
          borderRadius: "4px",                     // Optional: rounds the corners
          backgroundColor: "#d1d0be"
        }}
      >Daily<br/>Product</Link>
    </div>
);
}

function ProductPage() {
  const { pos, error } = useGeoPosition();
  const [products, setProducts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const runSearch = (formValues) => {
    if (!pos || pos.state !== "Maryland" || pos.country !== "US") return;
      const distanceKm = Number(formValues.max_distance_km) * 1.60934;
      const updatedFormValues = { ...formValues, max_distance_km: distanceKm, ...pos };
      getProducts(updatedFormValues).then((data) => {
      setProducts(data);
      setCurrentPage(1);
    });
  };

  if (error) return <p>Error: {error}</p>;
  if (!pos) return <Loader />;

  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;
  const currentProducts = products?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: window.innerWidth < 768 ? "column" : "row",
        padding: "10px",
        maxWidth: 1200,
        margin: "0 auto",
        gap: "1rem"
      }}
    >
      <div style={{ flexShrink: 0, width: window.innerWidth < 768 ? "100%" : "280px" }}>
        <FilterPanel coords={pos} onSearch={runSearch} />
      </div>
      <div style={{ flexGrow: 1, background: "#acab9e", "border-radius": "12px"}}>
        {!products || products.length === 0 ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            "flex-direction": "column", 
            "text-align": "center",
            padding: "1px",
            borderRadius: "4px",              
            backgroundColor: "#d1d0be"
            }}
            >
            <img
              src="/mynameisjeff.png" 
              alt="Logo"
              style={{
                height: "auto",
                margin: "0 auto",
                marginBottom: "1rem",
                borderRadius: "50px",
                maxHeight: "208px",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <strong style={{margin: "0 auto", justifyContent: "center"}}>"Why would anyone do drugs when they can just mow a lawn?" - Hank Hill <br/><br/></strong>
            <p style={{margin: "0 auto", justifyContent: "center"}}>Search leverages price per weight and other characteristics to find results.</p>
            <strong style={{margin: "0 auto", justifyContent: "center"}}>This site aggregates and links to products from local shops. It does not sell products.</strong>
            <strong style={{margin: "0 auto", justifyContent: "center"}}>Currently only the state of MD is supported.</strong>
          </div>
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
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(p - 1, 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </button>
                <span style={{ margin: "0 1rem" }}>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(p + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DailyProductPage() {
  const { pos, error } = useGeoPosition();
  const [products, setProducts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    if (!pos || pos.state !== "Maryland" || pos.country !== "US") return;

    const formValues = {
      brand: "All",
      type: "Flower",
      store: "All",
      date: new Date().toLocaleDateString("en-CA"),
      thc: 30,
      max_price: 75,
      max_distance_km: 10,
      limit: 1,
    };

    const updatedFormValues = { ...formValues, ...pos };

    getProducts(updatedFormValues).then((data) => {
      setProducts(data);
    });

  }, [pos]); // Dependency array: run effect only when pos changes

  // Handle loading, error, or empty state
  if (error) return <p>Error: {error}</p>;
  if (!pos || !products) return <Loader />;

  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "#5d4037" }}>
      <h2>Product of the day</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 2fr))",
          gap: "1rem",
        }}
      >
        {currentProducts.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
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
        <Route path="/dailyproduct" element={<DailyProductPage />} />
      </Routes>
    </div>
  );
}
