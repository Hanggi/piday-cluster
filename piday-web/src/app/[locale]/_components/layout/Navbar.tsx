import { cn } from "@/src/utils/cn";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTranslation } from "react-i18next";

import { isNavActive } from "../../_lib/utils";

export enum NavType {
  header = "header",
  footer = "footer",
}

export default function Navbar({
  children,
  navType,
}: {
  children: React.ReactNode;
  navType: NavType;
}) {
  const { t } = useTranslation("common");
  const path = usePathname();
  const Wrapper = navType;

  return (
    <div
      className={cn(" top-0 w-full h-20", {
        fixed: navType === NavType.header,
      })}
    >
      {navType === NavType.header && (
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
              grayscale: navType === NavType.footer,
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
        <ul className="flex items-center capitalize gap-5">
          {navData.map((el) => (
            <Link
              className={cn("flex items-center gap-1.5 py-2.5 rounded px-5", {
                "bg-white/40":
                  isNavActive(el.href!, path) && navType === "header",
              })}
              href={el.href || ""}
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
    </div>
  );
}

const navData = [
  {
    icon: "/img/icons/handbag.svg",
    href: "/store",
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
