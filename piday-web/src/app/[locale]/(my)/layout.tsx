import { WrapperCard } from "@/src/components/WrapperCard";

import { MyProfileAside } from "./_components/MyProfileAside";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WrapperCard className="container flex max-md:flex-col mb-32">
      <MyProfileAside className="-translate-y-16" />
      <main className="grow p-4 md:px-7">{children}</main>
    </WrapperCard>
  );
}
