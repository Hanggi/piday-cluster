import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-yellow-500 h-16">
      <nav className="container mx-auto h-full flex justify-between items-center">
        <Link href="/">
          <div className="relative h-12 w-28">
            <Image alt="logo" className="block" fill src="/logo.png" />
          </div>
        </Link>
        <div></div>
      </nav>
    </header>
  );
}
