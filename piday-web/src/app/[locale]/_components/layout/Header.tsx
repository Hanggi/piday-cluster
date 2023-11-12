"use client";

import AuthStatusButton from "../auth/AuthStatusButton";
import Navbar, { navType } from "./Navbar";

export default function Header() {
  return (
    <Navbar navType={navType.header}>
      <AuthStatusButton />
    </Navbar>
  );
}
