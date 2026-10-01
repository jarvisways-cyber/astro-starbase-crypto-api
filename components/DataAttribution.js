export default function DataAttribution() {
  return (
    <footer aria-label="Market data attribution" style={{
      marginTop: "28px", padding: "20px 12px", textAlign: "center",
      borderTop: "1px solid #333", color: "#b6b6b6", fontSize: "12px", lineHeight: 1.7
    }}>
      <div>Data provided by <a href="https://www.coingecko.com/en/api/"
        style={{ color: "#f5c518", textDecoration: "underline", textUnderlineOffset: "3px" }}>CoinGecko</a></div>
      <div style={{ fontSize: "11px", color: "#a0a0a0" }}>Market ranking and trading-volume inputs. ASTRO combines multiple data sources.</div>
    </footer>
  );
}
