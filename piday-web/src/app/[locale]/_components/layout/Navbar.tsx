"use client";

import { cn } from "@/src/utils/cn";

import Image from "next/image";
import Link from "next/link";

import { ElementType } from "react";
import { useTranslation } from "react-i18next";

export default function Navbar({
  children,
  navType,
}: {
  children: React.ReactNode;
  navType: ElementType;
}) {
  const { t } = useTranslation("common");
  const Wrapper = navType;
  return (
    <Wrapper
      className={cn(" top-0 w-full h-20", { fixed: navType === "header" })}
    >
      {navType === "header" && (
        <Image
          alt="banner"
          className="w-full h-[240px] object-cover object-bottom -z-10 absolute "
          height={240}
          src={`/img/banner.png`}
          width={1024}
        />
      )}
      <nav className="container mx-auto px-2 h-full flex  justify-between items-center">
        <Link href="/">
          <div
            className={cn("relative h-12 w-28", {
              grayscale: navType === "footer",
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
              key={el.translationKey}
            >
              <Image
                alt={el.translationKey}
                height={20}
                src={el.icon}
                width={20}
              />
              <span>{t(el.translationKey)}</span>
            </Link>
          ))}
        </ul>
        <div>{children}</div>
      </nav>
    </Wrapper>
  );
}

const navData = [
  {
    icon: "img/icons/Handbag.svg",
    translationKey: "common:nav.store",
  },
  {
    icon: "img/icons/tools.svg",
    translationKey: "common:nav.mining",
  },
  {
    icon: "img/icons/wallet.svg",
    translationKey: "common:nav.wallet",
  },
];