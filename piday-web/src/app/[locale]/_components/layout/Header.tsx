"use client";

import { cn } from "@/src/utils/cn";

import Button from "@mui/joy/Button";

import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "react-i18next";

import AuthStatusButton from "../auth/AuthStatusButton";

export default function Header() {
  const { t } = useTranslation("common");

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

        <ul className="lg:flex items-center capitalize gap-5 hidden">
          <Button className="!text-slate-100 hover:!text-black" variant="plain">
            <Link
              className={cn("flex items-center gap-1.5 py-1 rounded px-5", {})}
              href="/market"
            >
              <i className="ri-store-2-line text-xl"></i>
              <p className="text-lg">{t("common:nav.store")}</p>
            </Link>
          </Button>
          <Button className="!text-slate-100 hover:!text-black" variant="plain">
            <Link
              className={cn("flex items-center gap-1.5 py-1 rounded px-5", {})}
              href="/mining"
            >
              <i className="ri-hammer-line text-xl"></i>
              <p className="text-lg">{t("common:nav.mining")}</p>
            </Link>
          </Button>
          <Button className="!text-slate-100 hover:!text-black" variant="plain">
            <Link
              className={cn("flex items-center gap-1.5 py-1 rounded px-5", {})}
              href="/my/balance"
            >
              <i className="ri-wallet-3-line text-xl"></i>
              <p className="text-lg">{t("common:nav.wallet")}</p>
            </Link>
          </Button>
        </ul>

        <AuthStatusButton />
      </div>
      {/* <Navbar navType={NavType.header}></Navbar> */}
    </header>
  );
}
