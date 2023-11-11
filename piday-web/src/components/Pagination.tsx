"use client";

import { ComponentProps, useState } from "react";

import { cn } from "../utils/cn";

type PaginationProps = ComponentProps<"div">;

export function Pagination({ className, ...props }: PaginationProps) {
  const [page, setPage] = useState(1);
  return (
    <div
      className={cn(
        "flex my-12 justify-center w-full items-center gap-2.5",
        className,
      )}
      {...props}
    >
      <i className="ri-arrow-left-s-line text-xl" role="button" />
      {Array.from(Array(4).keys()).map((el) => (
        <button
          className="tracking-widest w-[30px] aspect-square text-sm selected:bg-primary rounded-full grid place-content-center"
          data-selected={el + 1 === page}
          key={el}
          onClick={() => setPage(el + 1)}
        >
          {el + 1}
        </button>
      ))}
      <div>...</div>
      <button className="tracking-widest w-[30px] aspect-square text-sm  rounded-full grid place-content-center">
        1112
      </button>
      <i className="ri-arrow-right-s-line text-xl" role="button" />
    </div>
  );
}
