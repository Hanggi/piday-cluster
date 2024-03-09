import * as React from "react";

import GeneralLedger from "./_components/dashboard/GeneralLedger";
import LedgerRecords from "./_components/dashboard/LedgerRecords";

export default function AdminPage() {
  return (
    <div className="p-8 py-16">
      <div>
        <GeneralLedger />
      </div>

      <div className="mt-8">
        <LedgerRecords />
      </div>
    </div>
  );
}
