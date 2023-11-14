import { WrapperCard } from "@/src/components/WrapperCard";

import { Aside } from "./_components/Aside";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WrapperCard className="container  flex">
      <Aside />
      {children}
    </WrapperCard>
  );
}
