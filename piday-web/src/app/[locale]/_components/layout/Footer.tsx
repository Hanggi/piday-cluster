"use client";

import Navbar, { navType } from "./Navbar";

export default function Footer() {
  return (
    <section className="w-full  bg-primary">
      <Navbar navType={navType.footer}>hello</Navbar>
    </section>
  );
}
