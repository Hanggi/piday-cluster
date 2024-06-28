"use client";

import { cn } from "@/src/utils/cn";

import Button from "@mui/joy/Button";

import Image from "next/image";
import Link from "next/link";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <section className="w-full  bg-[rgba(89,59,139,100)]">
      <div
        className={cn("top-0 w-full max-md:py-4 md:h-20", {
          // "absolute max-md:pt-0": navType === NavType.header,
        })}
      >
        {/* {navType === NavType.header && (
          <Image
            alt="banner"
            className="w-full md:hs-[240px] object-cover object-bottom -z-10 absolute "
            height={240}
            src={`/img/banner.png`}
            width={1024}
          />
        )} */}
        <nav
          className={cn(
            "container mx-auto px-4 h-full flex justify-between items-center",
          )}
        >
          <Link href="/">
            <div className={cn("relative h-12 w-12", {})}>
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

          <ul className="lg:flex items-center capitalize gap-4 hidden">
            <Button
              className="!text-slate-100 hover:!text-black"
              variant="plain"
            >
              <Link
                className={cn(
                  "flex items-center gap-1.5 py-1 rounded px-5",
                  {},
                )}
                href="/market"
              >
                <i className="ri-store-2-line text-xl"></i>
                <p className="text-lg">{t("common:nav.store")}</p>
              </Link>
            </Button>
            <Button
              className="!text-slate-100 hover:!text-black"
              variant="plain"
            >
              <Link
                className={cn(
                  "flex items-center gap-1.5 py-1 rounded px-5",
                  {},
                )}
                href="/mining"
              >
                <i className="ri-hammer-line text-xl"></i>
                <p className="text-lg">{t("common:nav.mining")}</p>
              </Link>
            </Button>
            <Button
              className="!text-slate-100 hover:!text-black"
              variant="plain"
            >
              <Link
                className={cn(
                  "flex items-center gap-1.5 py-1 rounded px-5",
                  {},
                )}
                href="/my/balance"
              >
                <i className="ri-wallet-3-line text-xl"></i>
                <p className="text-lg">{t("common:nav.wallet")}</p>
              </Link>
            </Button>
            <Button
              className="!text-slate-100 hover:!text-black"
              variant="plain"
            >
              <Link
                className={cn(
                  "flex items-center gap-1.5 py-1 rounded px-5",
                  {},
                )}
                href="/about"
              >
                <i className="ri-team-line text-xl"></i>
                <p className="text-lg">{t("common:nav.about")}</p>
              </Link>
            </Button>
          </ul>

          <div className="flex items-center gap-5">
            {socials.map((social) => (
              <Link href={social.href} key={social.href} target="_blank">
                <i className={cn("text-xl", "text-yellow-500", social.icon)} />
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <hr className="opacity-50" />
      <center className="text-white py-4 text-sm font-normal">
        Copyright © Piday Metaverse 2024
      </center>
    </section>
  );
}

const socials = [
  // {
  //   icon: "ri-facebook-circle-fill",
  //   href: "https:facebook.com/",
  // },
  {
    icon: "ri-twitter-x-line",
    href: "https://x.com/PiDayAPP",
  },
  // {
  //   icon: "ri-linkedin-fill",
  //   href: "https:linkedin.com/in/",
  // },
  // {
  //   icon: "ri-instagram-line",
  //   href: "https:instagram.com/",
  // },
];
