import Card from "@mui/joy/Card";

import { MyProfileAside } from "./_components/MyProfileAside";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mb-32 mt-8">
      <div className=" flex max-md:flex-col gap-8 mb-32 mt-8">
        <MyProfileAside className="" />
        <div className="grow">
          <Card size="lg">
            <main>{children}</main>
          </Card>
        </div>
      </div>
    </div>
  );
}
