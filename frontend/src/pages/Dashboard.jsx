import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container" style={{ padding: "20px" }}>
      <div
        style={{
          background: "var(--bg-card)",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "20px",
          }}
        >
          <h1 style={{ color: "var(--odoo-purple)" }}>WorkZen Dashboard</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/profile")}
              className="btn btn-secondary"
              style={{ width: "auto" }}
            >
              My Profile
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-primary"
              style={{ width: "auto" }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="alert alert-success">
          ✅ Welcome back, {user?.profile?.full_name || user?.email}!
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--odoo-purple) 0%, var(--odoo-purple-dark) 100%)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3>Role</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{user?.role}</p>
          </div>

          <div
            style={{
              background: "var(--input-bg)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              textAlign: "center",
            }}
          >
            <h3>Employee Code</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "var(--odoo-purple)",
              }}
            >
              {user?.profile?.employee_code || "N/A"}
            </p>
          </div>

          <div
            style={{
              background: "var(--input-bg)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              textAlign: "center",
            }}
          >
            <h3>Department</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "var(--odoo-purple)",
              }}
            >
              {user?.profile?.department || "Not Assigned"}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "var(--input-bg)",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "var(--odoo-purple)" }}>
            User Information
          </h2>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "10px", color: "var(--text-secondary)" }}>
                  Email:
                </td>
                <td style={{ padding: "10px" }}>{user?.email}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "10px", color: "var(--text-secondary)" }}>
                  Full Name:
                </td>
                <td style={{ padding: "10px" }}>
                  {user?.profile?.full_name || "N/A"}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "10px", color: "var(--text-secondary)" }}>
                  Company:
                </td>
                <td style={{ padding: "10px" }}>
                  {user?.profile?.company_name || "N/A"}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "10px", color: "var(--text-secondary)" }}>
                  Phone:
                </td>
                <td style={{ padding: "10px" }}>
                  {user?.profile?.phone || "N/A"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", color: "var(--text-secondary)" }}>
                  Designation:
                </td>
                <td style={{ padding: "10px" }}>
                  {user?.profile?.designation || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="alert alert-info" style={{ marginTop: "30px" }}>
          ℹ️ This is a basic dashboard. More modules (Attendance, Leave
          Management, Payroll) will be implemented in the next phase.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
