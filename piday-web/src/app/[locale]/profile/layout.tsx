import { Wrapper } from "@/src/components/Wrapper";

import { Aside } from "./_components/Aside";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper className="container  flex">
      <Aside />
      {children}
    </Wrapper>
  );
}
