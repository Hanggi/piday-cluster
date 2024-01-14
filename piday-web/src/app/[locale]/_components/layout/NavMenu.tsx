import { cn } from "@/src/utils/cn";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTranslation } from "react-i18next";

import { isNavActive } from "../../_lib/utils";

interface NavMenuProps {
  children: React.ReactNode;
  className?: string;
  navType: "header" | "footer";
}
export const NavMenu = ({ children, className, navType }: NavMenuProps) => {
  const { t } = useTranslation("common");
  const path = usePathname();
  return (
    <>
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
    </>
  );
};

const navData = [
  {
    icon: "/img/icons/handbag.svg",
    href: "/store",
    translationKey: "common:nav.store",
  },
  {
    icon: "/img/icons/tools.svg",
    href: "/mining",
    translationKey: "common:nav.mining",
  },
  {
    icon: "/img/icons/wallet.svg",
    href: "/wallet",
    translationKey: "common:nav.wallet",
  },
];
