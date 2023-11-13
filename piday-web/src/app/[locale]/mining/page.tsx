import { Wrapper } from "@/src/components/Wrapper";

import { Button } from "@mui/joy";

import Image from "next/image";

export const metadata = {
  title: "Mining",
};

export default function MiningPage() {
  return (
    <section className="container">
      <Wrapper className="flex flex-wrap lg:h-96 gap-14 max-md:flex-col ">
        <Image
          alt="banner"
          className="flex-1"
          height={244}
          src={`/img/mining-banner.png`}
          width={770}
        />
        <aside className="min-w-[300px] aspect-square flex flex-col p-5 h-full bg-neutral-100 rounded-2xl">
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <h4 className="text-secondary text-6xl font-bold">200</h4>
            <p className="text-black/40">待领取积分</p>
          </div>
          <Button className="w-full">领取积分</Button>
        </aside>
      </Wrapper>
    </section>
  );
}
