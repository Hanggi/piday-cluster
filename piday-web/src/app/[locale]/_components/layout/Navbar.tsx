"use client";

import { cn } from "@/src/utils/cn";

import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "react-i18next";

export default function Navbar({
  children,
  Component,
}: {
  children: React.ReactNode;
  Component: "header" | "footer";
}) {
  const { t } = useTranslation("common");
  return (
    <Component
      className={cn(" top-0 w-full h-20", { fixed: Component === "header" })}
    >
      {Component === "header" && (
        <Image
          alt="banner"
          className="w-full h-[240px] object-cover object-bottom -z-10 absolute "
          height={240}
          src={`/img/banner.svg`}
          width={1024}
        />
      )}
      <nav className="container mx-auto px-2 h-full flex  justify-between items-center">
        <Link href="/">
          <div
            className={cn("relative h-12 w-28", {
              grayscale: Component === "footer",
            })}
          >
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
        <ul className="flex items-center capitalize gap-12">
          {navData.map((el) => (
            <Link
              className="flex items-center gap-1.5"
              href={""}
              key={el.label}
            >
              <Image alt={el.label} height={20} src={el.icon} width={20} />
              <span>{t(el.label)}</span>
            </Link>
          ))}
        </ul>
        <div>{children}</div>
      </nav>
    </Component>
  );
}

const navData = [
  {
    icon: "img/icons/Handbag.svg",
    label: "common:nav.store",
  },
  {
    icon: "img/icons/tools.svg",
    label: "common:nav.mining",
  },
  {
    icon: "img/icons/wallet.svg",
    label: "common:nav.wallet",
  },
];
