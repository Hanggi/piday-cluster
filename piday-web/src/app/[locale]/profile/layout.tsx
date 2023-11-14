import { Wrapper } from "@/src/components/Wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Wrapper className="container">{children}</Wrapper>;
}
