import { BreadCrumb } from "@/src/components/BreadCrumb";

import { Banner } from "./_components/banner";

export const metadata = {
  title: "Asset Center",
};

export default function AssetCenterPage() {
  return (
    <main className="container">
      <BreadCrumb />
      <Banner />
      AssetCenterPage
    </main>
  );
}
