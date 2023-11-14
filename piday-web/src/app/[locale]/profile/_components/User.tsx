import { cn } from "@/src/utils/cn";

import Image from "next/image";
import Link from "next/link";

import { ComponentProps } from "react";

type UserProps = ComponentProps<"div">;

export function User({ className, ...props }: UserProps) {
  return (
    <div
      className={cn("flex flex-col items-center gap-1", className)}
      {...props}
    >
      <figure className="relative">
        <Image
          alt="User"
          height={100}
          src={`/img/profile/avatar.png`}
          width={100}
        />
        <Link href={"/settings"}>
          <Image
            alt="Settings"
            className="absolute bottom-0 right-0"
            height={30}
            src={`/img/profile/gear.svg`}
            width={30}
          />
        </Link>
      </figure>
      <p className="text-xl font-medium mt-1">刘备</p>
      <p className="text-black/40 text-sm">ID：213215487</p>
      <div>
        {["ri-telegram-fill", "ri-twitter-x-fill"].map((el) => (
          <Link href="" key={el}></Link>
        ))}
      </div>
    </div>
  );
}
