"use client";

import AuthStatusButton from "../auth/AuthStatusButton";
import Navbar, { NavType } from "./Navbar";

export default function Header() {
  return (
    <header>
      <Navbar navType={NavType.HEADER}>
        <AuthStatusButton />
      </Navbar>
    </header>
  );
}
