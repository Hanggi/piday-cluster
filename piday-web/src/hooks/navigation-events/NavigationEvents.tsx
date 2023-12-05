"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export function useNavigationEvents() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [previousePathname, setPreviousePathname] = useState<string>("");

  useEffect(() => {}, [pathname]);

  return null;
}
