import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Custom function to merge classNames
export function cn(...inputs: ClassValue[]) {
  // Merge classNames using clsx library
  // Pass to twMerge function to merge with Tailwind CSS
  return twMerge(clsx(inputs));
}
