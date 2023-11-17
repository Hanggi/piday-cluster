import { WrapperCard } from "@/src/components/WrapperCard";

import { Aside } from "./_components/Aside";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WrapperCard className="container  flex">
      <Aside />
      <main className="grow p-4 md:px-7">{children}</main>
    </WrapperCard>
  );
}
