"use client";

import Button from "@mui/joy/Button";

import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation("common");

  return (
    <header className="fixed top-0 w-full bg-yellow-500 h-16">
      <nav className="container mx-auto h-full flex justify-between items-center">
        <Link href="/">
          <div className="relative h-12 w-28">
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
        <div>
          <Button>{t("common:header.login")}</Button>
        </div>
      </nav>
    </header>
  );
}
