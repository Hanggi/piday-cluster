import { BreadCrumb } from "@/src/components/BreadCrumb";

import { MyBalanceBanner } from "./_components/Banner";
import MyBalanceRecords from "./_components/MyBalanceRecords";

export default function MyBalancePage() {
  const rechargeAddress = process.env.RECHARGE_ADDRESS;

  return (
    <main className="">
      <BreadCrumb />
      <MyBalanceBanner />

      <div className="mt-8">
        <MyBalanceRecords rechargeAddress={rechargeAddress as string} />
      </div>
    </main>
  );
}
