"use client";

import Navbar, { NavType } from "./Navbar";

export default function Footer() {
  return (
    <section className="w-full  bg-primary">
      <Navbar navType={NavType.FOOTER}>hello</Navbar>
    </section>
  );
}
