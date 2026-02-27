import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export function NavbarLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}