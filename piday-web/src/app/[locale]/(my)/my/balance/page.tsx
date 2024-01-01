import { BreadCrumb } from "@/src/components/BreadCrumb";

import { MyBalanceBanner } from "./_components/Banner";
import MyBalanceRecords from "./_components/MyBalanceRecords";

export default function MyBalancePage() {
  return (
    <main className="container">
      <BreadCrumb />
      <MyBalanceBanner />

      <div className="mt-8">
        <MyBalanceRecords />
      </div>
    </main>
  );
}
