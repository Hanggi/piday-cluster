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
      <div className="gap-4 flex items-center my-2">
        {["ri-send-plane-fill", "ri-twitter-x-fill"].map((el) => (
          <Link
            className="bg-secondary rounded-full grid place-content-center h-7 w-7  p-1"
            href=""
            key={el}
          >
            <i className={cn("text-lg text-white", el)} />
          </Link>
        ))}
      </div>
    </div>
  );
}
