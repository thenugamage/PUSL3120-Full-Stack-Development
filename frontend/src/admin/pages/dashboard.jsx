import "./dashboard.css";
import { useNavigate } from "react-router-dom";

function StatIcon({ variant }) {
  // simple inline SVGs so you don’t need extra icon libs
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" };

  if (variant === "products") {
    return (
      <svg {...common}>
        <path
          d="M12 2 3.5 6.5 12 11l8.5-4.5L12 2Z"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 6.5V17.5L12 22V11"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M20.5 6.5V17.5L12 22"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "orders") {
    return (
      <svg {...common}>
        <path
          d="M7 6h15l-2 8H8L7 6Z"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M7 6 6 3H2"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="19" r="2" fill="white" />
        <circle cx="19" cy="19" r="2" fill="white" />
      </svg>
    );
  }

  if (variant === "revenue") {
    return (
      <svg {...common}>
        <path
          d="M12 3v18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 7.5c0-2-1.8-3.5-4-3.5s-4 1.5-4 3.5S9.8 11 12 11s4 1.5 4 3.5S14.2 18 12 18s-4-1.5-4-3.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // users
  return (
    <svg {...common}>
      <path
        d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActionIcon({ variant }) {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none" };

  if (variant === "add") {
    return (
      <svg {...common}>
        <path
          d="M12 3 4 7.5 12 12l8-4.5L12 3Z"
          stroke="#ff4d3d"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M4 7.5V17l8 4.5V12"
          stroke="#ff4d3d"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M20 7.5V12"
          stroke="#ff4d3d"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 10h4"
          stroke="#ff4d3d"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "orders") {
    return (
      <svg {...common}>
        <path
          d="M7 6h15l-2 8H8L7 6Z"
          stroke="#ff4d3d"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M7 6 6 3H2"
          stroke="#ff4d3d"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="19" r="2" fill="#ff4d3d" />
        <circle cx="19" cy="19" r="2" fill="#ff4d3d" />
      </svg>
    );
  }

  if (variant === "users") {
    return (
      <svg {...common}>
        <path
          d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
          stroke="#ff4d3d"
          strokeWidth="2"
        />
        <path
          d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6"
          stroke="#ff4d3d"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // reports
  return (
    <svg {...common}>
      <path
        d="M4 18V6"
        stroke="#ff4d3d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 18h16"
        stroke="#ff4d3d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 14l3-3 3 2 5-6"
        stroke="#ff4d3d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 7h4v4"
        stroke="#ff4d3d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Static data to match your UI (we’ll connect real APIs after)
  const stats = [
    { icon: "products", label: "Total Products", value: "1,234", delta: "+12%", color: "blue" },
    { icon: "orders", label: "Total Orders", value: "856", delta: "+8%", color: "green" },
    { icon: "revenue", label: "Revenue", value: "$45,678", delta: "+23%", color: "purple" },
    { icon: "users", label: "Active Users", value: "2,891", delta: "+5%", color: "orange" },
  ];

  const orders = [
    { id: "ORD-2023107-001", name: "John Doe", time: "10:30 AM", amount: "$45.89", status: "Pending" },
    { id: "ORD-2023107-002", name: "Jane Smith", time: "11:45 AM", amount: "$78.50", status: "Processing" },
    { id: "ORD-2023107-003", name: "Mike Johnson", time: "2:15 PM", amount: "$123.00", status: "Shipped" },
    { id: "ORD-2023107-004", name: "Sarah Wilson", time: "3:30 PM", amount: "$67.25", status: "Delivered" },
  ];

  const lowStock = [
    { emoji: "🍌", name: "Organic Bananas", min: 50, left: 12, pct: 0.42 },
    { emoji: "🍞", name: "Whole Wheat Bread", min: 30, left: 8, pct: 0.32 },
    { emoji: "🥛", name: "Fresh Milk", min: 40, left: 15, pct: 0.55 },
  ];

  return (
    <div className="adash">
      {/* Header */}
      <div className="adash__header">
        <div>
          <div className="adash__title">Admin Dashboard</div>
          <div className="adash__subtitle">Welcome back! Here's what's happening today.</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="adash__stats">
        {stats.map((s) => (
          <div key={s.label} className="adash__statCard">
            <div className="adash__statTop">
              <div className={`adash__statIcon adash__statIcon--${s.color}`}>
                <StatIcon variant={s.icon} />
              </div>
              <div className="adash__delta">{s.delta}</div>
            </div>

            <div className="adash__statLabel">{s.label}</div>
            <div className="adash__statValue">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="adash__sectionLabel">Quick Actions</div>
      <div className="adash__actions">
        <button className="adash__actionCard" onClick={() => navigate("/admin/products/new")}>
          <div className="adash__actionIcon">
            <ActionIcon variant="add" />
          </div>
          <div className="adash__actionText">Add Product</div>
        </button>

        <button className="adash__actionCard" onClick={() => navigate("/admin/orders")}>
          <div className="adash__actionIcon">
            <ActionIcon variant="orders" />
          </div>
          <div className="adash__actionText">View Orders</div>
        </button>

        <button className="adash__actionCard" onClick={() => navigate("/admin/users")}>
          <div className="adash__actionIcon">
            <ActionIcon variant="users" />
          </div>
          <div className="adash__actionText">Manage Users</div>
        </button>

        <button className="adash__actionCard" onClick={() => navigate("/admin/reports")}>
          <div className="adash__actionIcon">
            <ActionIcon variant="reports" />
          </div>
          <div className="adash__actionText">View Reports</div>
        </button>
      </div>

      {/* Bottom Panels */}
      <div className="adash__bottom">
        {/* Recent Orders */}
        <div className="adash__panel">
          <div className="adash__panelHeader">
            <div className="adash__panelTitle">Recent Orders</div>
            <button className="adash__link" onClick={() => navigate("/admin/orders")}>
              View All
            </button>
          </div>

          <div className="adash__ordersList">
            {orders.map((o) => (
              <div key={o.id} className="adash__orderRow">
                <div className="adash__orderLeft">
                  <div className="adash__orderId">{o.id}</div>
                  <div className="adash__orderName">{o.name}</div>
                  <div className="adash__orderTime">{o.time}</div>
                </div>

                <div className="adash__orderRight">
                  <div className="adash__orderAmount">{o.amount}</div>
                  <div className={`adash__badge adash__badge--${o.status.toLowerCase()}`}>
                    {o.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="adash__panel">
          <div className="adash__panelHeader">
            <div className="adash__panelTitle adash__panelTitle--warn">
              <span className="adash__warnIcon">⚠️</span>
              Low Stock Alert
            </div>
          </div>

          <div className="adash__stockList">
            {lowStock.map((i) => (
              <div key={i.name} className="adash__stockRow">
                <div className="adash__stockTop">
                  <div className="adash__stockLeft">
                    <div className="adash__stockEmoji">{i.emoji}</div>
                    <div>
                      <div className="adash__stockName">{i.name}</div>
                      <div className="adash__stockMin">Min Stock: {i.min}</div>
                    </div>
                  </div>
                  <div className="adash__stockRight">{i.left} left</div>
                </div>

                <div className="adash__bar">
                  <div className="adash__barFill" style={{ width: `${Math.round(i.pct * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button className="adash__manage" onClick={() => navigate("/admin/inventory")}>
            Manage Inventory
          </button>
        </div>
      </div>
    </div>
  );
}
