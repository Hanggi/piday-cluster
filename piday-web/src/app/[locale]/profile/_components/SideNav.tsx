"use client";

import { cn } from "@/src/utils/cn";

import { Typography } from "@mui/joy";

import Image from "next/image";
import Link from "next/link";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type SideNavProps = ComponentProps<"div">;

export function SideNav({ className, ...props }: SideNavProps) {
  const { t } = useTranslation("profile");
  return (
    <div className={cn(className)} {...props}>
      {navItems.map((nav) => (
        <Link href={nav.href} key={nav.translationKey}>
          <Image
            alt=""
            className="brightness-0"
            height={20}
            src={nav.icon}
            width={20}
          />
          <Typography className="text-sm">{t(nav.translationKey)}</Typography>
        </Link>
      ))}
    </div>
  );
}

const navItems = [
  {
    translationKey: "profile:nav.enterTeam",
    href: "",
    icon: "/img/profile/users.svg",
  },
  {
    translationKey: "profile:nav.leaderboard",
    href: "",
    icon: "/img/profile/trophy.svg",
  },
  {
    translationKey: "profile:nav.blogCenter",
    href: "",
    icon: "/img/profile/newspaper.svg",
  },
  {
    translationKey: "profile:nav.aboutParty",
    href: "",
    icon: "/img/profile/pid.png",
  },
];
