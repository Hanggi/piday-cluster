"use client";

import { cn } from "@/src/utils/cn";

import Link from "next/link";

import Navbar, { NavType } from "./Navbar";

export default function Footer() {
  return (
    <section className="w-full bg-primary">
      <Navbar navType={NavType.footer}>
        <div className="flex items-center gap-5">
          {socials.map((social) => (
            <Link href={social.href} key={social.href} target="_blank">
              <i className={cn("text-lg", social.icon)} />
            </Link>
          ))}
        </div>
      </Navbar>
      <hr className="opacity-50" />
      <center className="text-black/80 py-4 text-sm font-normal">
        Copyright © Piday 2023.
      </center>
    </section>
  );
}

const socials = [
  {
    icon: "ri-facebook-circle-fill",
    href: "https:facebook.com/",
  },
  {
    icon: "ri-twitter-x-line",
    href: "https:x.com/",
  },
  {
    icon: "ri-linkedin-fill",
    href: "https:linkedin.com/in/",
  },
  {
    icon: "ri-instagram-line",
    href: "https:instagram.com/",
  },
];
