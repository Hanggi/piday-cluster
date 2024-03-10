import { MyProfileAside } from "./_components/MyProfileAside";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mb-32 mt-8">
      <div className=" flex max-md:flex-col gap-8 mb-32 mt-8">
        <MyProfileAside className="" />
        <div className="grow">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
