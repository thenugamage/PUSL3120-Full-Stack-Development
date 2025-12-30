import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./adminlayout.css";

export default function AdminLayout() {
  return (
    <div className="adminShell">
      <Sidebar />
      <div className="adminMain">
        <Outlet />
      </div>
    </div>
  );
}
