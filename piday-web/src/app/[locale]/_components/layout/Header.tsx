"use client";

import Image from "next/image";

import AuthStatusButton from "../auth/AuthStatusButton";
import Navbar, { NavType } from "./Navbar";

export default function Header() {
  return (
    <header>
      <Image
        alt="banner"
        className="w-full md:hs-[240px] object-cover object-bottom -z-10 absolute "
        height={240}
        src={`/img/banner.png`}
        width={1024}
      />
      <div className="container py-4 flex justify-between">
        <div className={"relative h-12 w-28"}>
          <Image
            alt="logo"
            className="block"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src="/logo.png"
          />
        </div>
        <AuthStatusButton />
      </div>
      {/* <Navbar navType={NavType.header}></Navbar> */}
    </header>
  );
}
