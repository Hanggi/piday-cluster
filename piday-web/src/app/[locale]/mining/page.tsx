import { BreadCrumb } from "@/src/components/BreadCrumb";
import { WrapperCard } from "@/src/components/WrapperCard";

import Image from "next/image";

import { HeaderAside } from "./_components/HeaderAside";
import { Information } from "./_components/Information";
import { Table } from "./_components/Table";

export const metadata = {
  title: "Mining",
};

export default async function MiningPage() {
  return (
    <section className="container space-y-5">
      <BreadCrumb />
      <WrapperCard className="flex flex-wrap lg:h-96 gap-14 max-md:flex-col ">
        <Image
          alt="banner"
          className="flex-1"
          height={244}
          src={`/img/mining-banner.png`}
          width={770}
        />
        <HeaderAside />
      </WrapperCard>
      <Information />
      <Table />
      <br />
      <br />
    </section>
  );
}
