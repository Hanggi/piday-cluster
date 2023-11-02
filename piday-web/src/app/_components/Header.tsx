import Link from "next/link";

import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-yellow-500 h-16">
      <nav className="container mx-auto">
        <Link href="/">
          <div className="relative ">
            <Image alt="logo" src="/next.svg" fill />
          </div>
        </Link>
      </nav>
    </header>
  );
}
