import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <Outlet />
      <Analytics />
    </>
  );
}