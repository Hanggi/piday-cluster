"use client";

import { cn } from "@/src/utils/cn";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <section className="w-full  bg-primary">
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
            "container mx-auto px-2 h-full flex  justify-between items-center",
            { "max-md:flex-col": true },
          )}
        >
          <Link href="/">
            <div
              className={cn("relative h-12 w-12", {
                grayscale: true,
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

          <div className="flex items-center gap-5">
            {socials.map((social) => (
              <Link href={social.href} key={social.href} target="_blank">
                <i className={cn("text-lg", social.icon)} />
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <hr className="opacity-50" />
      <center className="text-black/80 py-4 text-sm font-normal">
        Copyright © Piday 2023.
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
