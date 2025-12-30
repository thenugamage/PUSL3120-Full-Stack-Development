import { NavLink } from "react-router-dom";
import "./sidebar.css";

function SLogo() {
  // simple inline mark similar to the screenshot’s top emblem
  return (
    <div className="sbLogo">
      <div className="sbLogoMark">
        <span className="sbLogoFlower">❀</span>
      </div>
      <div className="sbBrand">
        <div className="sbBrandTitle">Sudu Araliya</div>
        <div className="sbBrandSub">Super City</div>
      </div>
    </div>
  );
}

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" };

  const stroke = "#1f2937";
  const s2 = { stroke, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <path d="M4 4h6v6H4V4Z" {...s2} />
          <path d="M14 4h6v6h-6V4Z" {...s2} />
          <path d="M4 14h6v6H4v-6Z" {...s2} />
          <path d="M14 14h6v6h-6v-6Z" {...s2} />
        </svg>
      );
    case "products":
      return (
        <svg {...common}>
          <path d="M12 2 3.5 6.5 12 11l8.5-4.5L12 2Z" {...s2} />
          <path d="M3.5 6.5V17.5L12 22V11" {...s2} />
          <path d="M20.5 6.5V17.5L12 22" {...s2} />
        </svg>
      );
    case "inventory":
      return (
        <svg {...common}>
          <path d="M4 7h16" {...s2} />
          <path d="M7 7V4h10v3" {...s2} />
          <path d="M6 7v14h12V7" {...s2} />
          <path d="M9 11h6" {...s2} />
          <path d="M9 15h6" {...s2} />
        </svg>
      );
    case "orders":
      return (
        <svg {...common}>
          <path d="M7 6h15l-2 8H8L7 6Z" {...s2} />
          <path d="M7 6 6 3H2" {...s2} />
          <path d="M9 19a1.5 1.5 0 1 0 0 .01" {...s2} />
          <path d="M19 19a1.5 1.5 0 1 0 0 .01" {...s2} />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" {...s2} />
          <path d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6" {...s2} />
        </svg>
      );
    case "promotions":
      return (
        <svg {...common}>
          <path d="M20 12 12 20 4 12l8-8 8 8Z" {...s2} />
          <path d="M12 20V4" {...s2} />
        </svg>
      );
    case "reports":
      return (
        <svg {...common}>
          <path d="M4 18V6" {...s2} />
          <path d="M4 18h16" {...s2} />
          <path d="M7 14l3-3 3 2 5-6" {...s2} />
        </svg>
      );
    case "categories":
      return (
        <svg {...common}>
          <path d="M4 6h16" {...s2} />
          <path d="M4 12h16" {...s2} />
          <path d="M4 18h16" {...s2} />
          <path d="M7 6v12" {...s2} />
          <path d="M17 6v12" {...s2} />
        </svg>
      );
    default:
      return null;
  }
}

const items = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/products", label: "Products", icon: "products" },
  { to: "/admin/inventory", label: "Inventory", icon: "inventory" },
  { to: "/admin/orders", label: "Orders", icon: "orders" },
  { to: "/admin/users", label: "Users", icon: "users" },
  { to: "/admin/promotions", label: "Promotions", icon: "promotions" },
  { to: "/admin/reports", label: "Reports", icon: "reports" },
  { to: "/admin/categories", label: "Categories", icon: "categories" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebarTop">
        <SLogo />
        <div className="sbAdminTitle">Admin</div>
      </div>

      <nav className="sbNav">
        {items.map((it) => (
          <NavLink
            key={it.label}
            to={it.to}
            end={it.to === "/admin"}
            className={({ isActive }) => (isActive ? "sbItem sbItem--active" : "sbItem")}
          >
            <span className="sbItemIcon">
              <Icon name={it.icon} />
            </span>
            <span className="sbItemText">{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sbFooter">
        <div className="sbUser">
          <div className="sbAvatar">A</div>
          <div className="sbUserMeta">
            <div className="sbUserName">Admin User</div>
            <div className="sbUserEmail">admin@store.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
