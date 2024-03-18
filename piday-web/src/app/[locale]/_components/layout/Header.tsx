"use client";

import { cn } from "@/src/utils/cn";

import Button from "@mui/joy/Button";
import Drawer from "@mui/joy/Drawer";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItemButton from "@mui/joy/ListItemButton";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import AuthStatusButton from "../auth/AuthStatusButton";

export default function Header() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[rgba(89,59,139,100)]">
      {/* DESKTOP */}
      <div className="container py-4 lg:flex justify-between hidden">
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

      {/* MOBILE */}
      <div className=" py-2 flex justify-between lg:hidden">
        <IconButton
          className="flex-none w-16"
          color="neutral"
          variant="plain"
          onClick={() => setOpen(true)}
        >
          <i className="ri-menu-line text-white"></i>
        </IconButton>

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

        <AuthStatusButton size="sm" />
      </div>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <List component="nav" size="lg">
          <ListItemButton
            onClick={() => {
              router.push("/");
              setOpen(false);
            }}
          >
            {t("common:nav.home")}
          </ListItemButton>
          <ListDivider />
          <ListItemButton
            onClick={() => {
              router.push("/market");
              setOpen(false);
            }}
          >
            <i className="ri-store-2-line text-xl"></i>
            <p className="text-lg">{t("common:nav.store")}</p>
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              router.push("/mining");
              setOpen(false);
            }}
          >
            <i className="ri-hammer-line text-xl"></i>
            <p className="text-lg">{t("common:nav.mining")}</p>
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              router.push("/my/balance");
              setOpen(false);
            }}
          >
            <i className="ri-wallet-3-line text-xl"></i>
            <p className="text-lg">{t("common:nav.wallet")}</p>
          </ListItemButton>
        </List>
      </Drawer>
    </header>
  );
}
