import { useState, useEffect } from "react";
import { getBrands, getStores } from "../api";
import Loader from "./Loader";

export default function FilterPanel({ coords, onSearch }) {
  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({
    brand: "All",
    type: "Flower",
    store: "All",
    date: new Date().toISOString().split("T")[0],
    thc: 20,
    max_price: 100,
    max_distance_km: 50,
  });

  useEffect(() => {
    if (!coords) return;
    getBrands(coords.lat, coords.lng, form.max_distance_km).then(setBrands);
    getStores(coords.lat, coords.lng, form.max_distance_km).then(setStores);
  }, [coords, form.max_distance_km]);

  if (!coords || brands.length === 0) return <Loader />;

  const update = (e) => {
    const name = e.target.name;
    const value = e.target.type === "range" ? Number(e.target.value) : e.target.value;
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    if (name === "max_distance_km") {
      onSearch(newForm); // auto-refresh on distance change
    }
  };

  const labelStyle = { color: "#2A2420", fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 };
  const selectStyle = {
    width: "100%",
    maxWidth: "220px",
    backgroundColor: "#d1d0be",
    borderColor: "#d1d0be",
    color: "#2A2420",
    padding: "6px 8px",
    borderRadius: 4,
    textAlign: "right"
  };
  const sliderStyle = {
    width: "100%",
    maxWidth: "220px",
    accentColor: "#02a264",
  };
  const buttonStyle = {
    backgroundColor: "#896A58",
    color: "#d1d0be",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    fontWeight: 600,
    marginTop: "0.5rem",
    alignSelf: "center"
  };

  return (
    
    <div
      style={{
        border: "1px solid #00301e",
        borderRadius: 12,
        maxWidth:"100%",
        padding: "1rem",
        backgroundColor: "#d1d0be",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        marginBottom: "2rem",
        display: "flex",
        flexDirection: "column",
        "text-align": "center"
      }}
    >
      <strong style={{margin: "0 auto", padding: "10px", justifyContent: "center"}}>I'll find the cheapest grass locally. I'll tell you HWAT.</strong>
      <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", "padding-inline": "10px"}}>
        <label style={labelStyle}>Brand </label>
        <select name="brand" value={form.brand} onChange={update} style={selectStyle}>
          <option value="All">All</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", "padding-inline": "10px"}}>
        <label style={labelStyle}>Type </label>
        <select name="type" value={form.type} onChange={update} style={selectStyle}>
          <option value="All">All</option>
          <option>Flower</option>
          <option>Concentrate</option>
          <option>Edible</option>
          <option>Pre-Rolls</option>
          <option>Vaporizers</option>
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", "padding-inline": "10px", "align-items": "center"}}>
        <label style={labelStyle}>Store </label>
        <select name="store" value={form.store} onChange={update} style={selectStyle}>
          <option value="All">All</option>
          {stores.map((s) => (
            <option key={s.store_name} value={s.store_name}>
              {s.store_name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
        <label style={labelStyle}>THC - {form.thc}%</label>
        <input
          type="range"
          name="thc"
          min="0"
          max="100"
          value={form.thc}
          onChange={update}
          style={sliderStyle}
        />
      </div>

      <div style={{ marginBottom: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
        <label style={labelStyle}>Price - ${form.max_price}</label>
        <input
          type="range"
          name="max_price"
          min="0"
          max="200"
          value={form.max_price}
          onChange={update}
          style={sliderStyle}
        />
      </div>

      <div style={{ marginBottom: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
        <label style={labelStyle}>Distance - {form.max_distance_km} km</label>
        <input
          type="range"
          name="max_distance_km"
          min="0"
          max="150"
          value={form.max_distance_km}
          onChange={update}
          style={sliderStyle}
        />
      </div>

      <button onClick={() => onSearch(form)} style={buttonStyle}>
        Search
      </button>
    </div>
  );
}
