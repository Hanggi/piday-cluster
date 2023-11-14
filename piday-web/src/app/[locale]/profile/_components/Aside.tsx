import { cn } from "@/src/utils/cn";

import { ComponentProps } from "react";

import { SideNav } from "./SideNav";
import { User } from "./User";

type AsideProps = ComponentProps<"aside">;

export function Aside({ className, ...props }: AsideProps) {
  return (
    <aside className={cn(className)} {...props}>
      <User />
      <SideNav />
    </aside>
  );
}
