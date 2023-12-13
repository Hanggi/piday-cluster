import { BreadCrumb } from "@/src/components/BreadCrumb";

import { Banner } from "./_components/Banner";
import { LandByCategories } from "./_components/LandByCategories";
import { LandPerCityTable } from "./_components/LandPerCityTable";

export const metadata = {
  title: "Asset Center",
};

export default function AssetCenterPage() {
  return (
    <main className="container">
      <BreadCrumb />
      <Banner />
      <br />
      <LandPerCityTable />
      <br />
      <LandByCategories />
      <br />
    </main>
  );
}
