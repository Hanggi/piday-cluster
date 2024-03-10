import { BreadCrumb } from "@/src/components/BreadCrumb";

import { MyAssetsBanner } from "./_components/Banner";
import { MyVirtualEstateTransactionHistroy } from "./_components/MyVirtualEstateTransactionHistroy";
import { MyVritualEstates } from "./_components/MyVritualEstates";

export const metadata = {
  title: "Asset Center",
};

export default function MyAssetsPage() {
  return (
    <main className="">
      <BreadCrumb />
      <MyAssetsBanner />
      <div className="mt-8">
        <MyVritualEstates />
      </div>

      <div className="mt-8">
        <MyVirtualEstateTransactionHistroy />
      </div>
    </main>
  );
}
