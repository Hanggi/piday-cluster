"use client";

import Navbar, { NavType } from "./Navbar";

export default function Footer() {
  return (
    <footer className="w-full  bg-primary">
      <Navbar navType={NavType.FOOTER}>hello</Navbar>
    </footer>
  );
}
