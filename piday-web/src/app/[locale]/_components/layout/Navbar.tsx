import { useMediaQuery } from "@/src/hooks/navigation-events/media-query";
import { cn } from "@/src/utils/cn";

import { Dropdown, Menu, MenuButton } from "@mui/joy";

import Image from "next/image";
import Link from "next/link";

import { NavMenu } from "./NavMenu";

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
  const isMd = useMediaQuery("md");
  return (
    <div
      className={cn("top-0 w-full max-md:py-4 md:h-20", {
        "absolute max-md:pt-0": navType === NavType.header,
      })}
    >
      {navType === NavType.header && (
        <Image
          alt="banner"
          className="w-full md:hs-[240px] object-cover object-bottom -z-10 absolute "
          height={240}
          src={`/img/banner.png`}
          width={1024}
        />
      )}
      <nav
        className={cn(
          "container mx-auto px-2 h-full flex  justify-between items-center",
          { "max-md:flex-col": navType === NavType.footer },
        )}
      >
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

        {navType === NavType.header ? (
          isMd ? (
            <NavMenu navType={navType}>{children}</NavMenu>
          ) : (
            <Dropdown>
              <MenuButton>
                <i className="ri-menu-3-line"></i>
              </MenuButton>
              <Menu className="!bg-primary  [&>ul]:flex items-center [&>ul]:flex-col">
                <NavMenu navType={navType}>{children}</NavMenu>
              </Menu>
            </Dropdown>
          )
        ) : (
          <NavMenu navType={navType}>{children}</NavMenu>
        )}
      </nav>
    </div>
  );
}
