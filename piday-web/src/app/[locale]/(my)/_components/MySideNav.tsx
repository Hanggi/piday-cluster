"use client";

import { cn } from "@/src/utils/cn";

import { Typography } from "@mui/joy";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { isNavActive } from "../../_lib/utils";

type SideNavProps = ComponentProps<"div">;

export function MySideNav({ className, ...props }: SideNavProps) {
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
          href={nav.href}
          key={nav.translationKey}
        >
          {/* <Image
            alt=""
            className="brightness-0"
            height={20}
            src={nav.icon}
            width={20}
          /> */}
          <div>{nav.icon}</div>
          <Typography className="text-sm grow">
            {t(nav.translationKey)}
          </Typography>{" "}
          <i className="ri-arrow-right-s-line"></i>
        </Link>
      ))}
    </div>
  );
}

const navItems = [
  {
    translationKey: "nav.myProfile",
    href: "/profile",
    icon: <i className="ri-profile-line"></i>,
  },
  {
    translationKey: "nav.myBalance",
    href: "/my/balance",
    icon: <i className="ri-wallet-3-line"></i>,
  },
  {
    translationKey: "nav.myAssets",
    href: "/my/assets",
    icon: <i className="ri-community-line"></i>,
  },
  {
    // blog page
    translationKey: "nav.blogCenter",
    href: "/blog",
    icon: <i className="ri-article-line"></i>,
  },
  {
    // about piday
    translationKey: "nav.aboutParty",
    href: "/about",
    icon: <i className="ri-information-line"></i>,
  },
  // {
  //   translationKey: "nav.settings",
  //   href: "/my/settings",
  //   icon: <i className="ri-settings-3-line"></i>,
  // },
];
