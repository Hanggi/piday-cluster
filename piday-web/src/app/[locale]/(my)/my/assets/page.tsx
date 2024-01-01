import { BreadCrumb } from "@/src/components/BreadCrumb";

import { MyAssetsBanner } from "./_components/Banner";
import { LandByCategories } from "./_components/LandByCategories";

// import { LandPerCityTable } from "./_components/LandPerCityTable";

export const metadata = {
  title: "Asset Center",
};

export default function MyAssetsPage() {
  return (
    <main className="container">
      <BreadCrumb />
      <MyAssetsBanner />
      {/* <br />
      <LandPerCityTable /> */}
      <br />
      <LandByCategories />
      <br />
    </main>
  );
}
