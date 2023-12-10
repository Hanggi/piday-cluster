import { ForSale } from "./_components/home-ve-map/ForSale";
import { SearchResult } from "./_components/home-ve-map/SearchResult";
import VirtualEstateMapClientWrapper from "./_components/home-ve-map/VirtualEstateMapClientWrapper";

export const metadata = {
  title: "Home",
};

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

interface Props {
  params: { hexID: string };
}

export default function HomePage({ params }: Props) {
  return (
    <section className="container mx-auto  py-4 mb-8">
      <div>Home page</div>

      <div className="w-full h-[800px] relative pb-8">
        <VirtualEstateMapClientWrapper token={MAPBOX_ACCESS_TOKEN as string} />
      </div>
      <SearchResult />
      <ForSale />
    </section>
  );
}
