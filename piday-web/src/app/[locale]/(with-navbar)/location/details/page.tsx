import { BreadCrumb } from "@/src/components/BreadCrumb";
import { WrapperCard } from "@/src/components/WrapperCard";

import { MapDetails } from "./_components/MapDetails";

const LandsPage = () => {
  return (
    <main className="container">
      <BreadCrumb />
      <WrapperCard className="container mx-auto pt-10">
        <MapDetails />
      </WrapperCard>
    </main>
  );
};

export default LandsPage;
