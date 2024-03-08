
import { usePathname } from "next/navigation";


interface NavMenuProps {
  children: React.ReactNode;
  className?: string;
}
export const NavMenu = ({ children, className }: NavMenuProps) => {
  const path = usePathname();
  return (
    <>
      <div>{children}</div>
    </>
  );
};
