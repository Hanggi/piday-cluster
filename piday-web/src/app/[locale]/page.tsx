import Link from "next/link";

export const metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <section>
      HomePage
      <Link href={"/map"} className="text-5xl block text-center py-4">
        Goto map
      </Link>
    </section>
  );
}
