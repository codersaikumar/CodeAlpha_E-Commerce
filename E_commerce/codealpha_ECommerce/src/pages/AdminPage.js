import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI" }}>
      <h2 style={{ color: "#2193b0" }}>Welcome, Admin 👋</h2>
      <p style={{ marginBottom: "1.5rem" }}>
        You have full access to manage the website.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/admin/products")} style={buttonStyle}>
          📦 Manage Products
        </button>
        <button onClick={() => navigate("/admin/users")} style={buttonStyle}>
          👥 View Users
        </button>
        <button onClick={() => navigate("/admin/vieworders")} style={buttonStyle}>
          📃 View Orders
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "12px 20px",
  backgroundColor: "#2193b0",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background 0.3s",
};

export default AdminPage;
