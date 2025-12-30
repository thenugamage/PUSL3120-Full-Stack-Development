import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  // keep it open for now (no login yet)
  return <Outlet />;
}
