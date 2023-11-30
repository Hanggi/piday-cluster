"use client";

import { cn } from "@/src/utils/cn";

import { Typography } from "@mui/joy";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { isNavActive } from "../../_lib/utils";

type SideNavProps = ComponentProps<"div">;

export function SideNav({ className, ...props }: SideNavProps) {
  const { t } = useTranslation("profile");
  const pathname = usePathname();
  return (
    <div className={cn(className)} {...props}>
      {navItems.map((nav) => (
        <Link
          className={cn(
            "flex min-w-[190px] last:grow items-center gap-2 p-4 border-b",
            {
              "bg-secondary/10 rounded-md": isNavActive(nav.href, pathname),
            },
          )}
          href={`${pathname}/${nav.href}`}
          key={nav.translationKey}
        >
          <Image
            alt=""
            className="brightness-0"
            height={20}
            src={nav.icon}
            width={20}
          />
          <Typography className="text-sm grow">
            {t(nav.translationKey)}
          </Typography>{" "}
          <i className="ri-arrow-right-s-line"></i>
        </Link>
      ))}
      <Link
        className={cn(
          "flex min-w-[190px] translate-y-16 items-center gap-2 absolute bottom-0 p-4 border rounded-xl",
        )}
        href={""}
      >
        <Image alt="" height={20} src="/img/profile/power.svg" width={20} />
        <Typography className="text-sm grow">{t("nav.logout")}</Typography>{" "}
        <i className="ri-arrow-right-s-line"></i>
      </Link>
    </div>
  );
}

const navItems = [
  {
    translationKey: "nav.enterTeam",
    href: "user",
    icon: "/img/profile/users.svg",
  },
  {
    translationKey: "nav.leaderboard",
    href: "leaderboard",
    icon: "/img/profile/trophy.svg",
  },
  {
    translationKey: "nav.blogCenter",
    href: "blog",
    icon: "/img/profile/newspaper.svg",
  },
  {
    translationKey: "nav.aboutParty",
    href: "pid",
    icon: "/img/profile/pid.png",
  },
];