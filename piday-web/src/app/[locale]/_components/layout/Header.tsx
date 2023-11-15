"use client";

import AuthStatusButton from "../auth/AuthStatusButton";
import Navbar, { NavType } from "./Navbar";

export default function Header() {
  return (
    <Navbar navType={NavType.HEADER}>
      <AuthStatusButton />
    </Navbar>
  );
}
