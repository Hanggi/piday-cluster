export function isNavActive(href: string, path: string) {
  return href === "/" ? path === "/" : path?.includes(href);
}
