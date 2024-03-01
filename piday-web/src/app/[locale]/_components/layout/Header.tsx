"use client";

import Image from "next/image";
import Link from "next/link";

import AuthStatusButton from "../auth/AuthStatusButton";

export default function Header() {
  return (
    <header className="bg-[rgba(89,59,139,100)]">
      <div className="container py-4 flex justify-between ">
        <Link href="/">
          <div className={"relative h-12 w-12"}>
            <Image
              alt="logo"
              className="block"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src="/logo.png"
            />
          </div>
        </Link>
        <AuthStatusButton />
      </div>
      {/* <Navbar navType={NavType.header}></Navbar> */}
    </header>
  );
}
