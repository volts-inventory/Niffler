export default function ProductCard({ p }) {
  return (
    <div style={{
      aspectRatio: "1 / 1",               // forces a square shape
      display: "flex",
      margin: "0 auto",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "#00301e",
      borderRadius: 12,
      padding: 16,
      backgroundColor: "#d1d0be",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
      height: "100%",
      maxHeight: "250px"
    }}>
      {p.image_url && (
        <img
          src={p.image_url}
          alt={p.name}
          style={{
            width: "100%",
            height: "100px",
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 8
          }}
        />
      )}
      <h3 style={{ marginBottom: 4, fontSize: 18 }}>
        <a
          href={p.stats?.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "#5d4037" }}
        >
          <strong>{p.brand}</strong> – <em>{p.name}</em>
        </a>
      </h3>
      <p style={{ margin: "4px 0", color: "#6d4c41" }}>
        {p.thc_percent}% THC • {p.type}
      </p>
      <p style={{ margin: "4px 0", fontWeight: "bold", color: "#4e342e" }}>
        ${p.price?.toFixed(2)} <span style={{ color: "#757575" }}>({p.stats?.price_per_g?.toFixed(2) ?? "n/a"} $/g)</span>
      </p>
      <small style={{ color: "#8d6e63" }}>
        {p.stats?.store_name} – {Math.round(p.stats?.distance / 1000)} km away
      </small>
    </div>
  );
}
