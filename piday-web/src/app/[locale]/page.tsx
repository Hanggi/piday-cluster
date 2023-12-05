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

      <div className="h-[800px] w-full relative pb-8">
        start:
        <VirtualEstateMapClientWrapper token={MAPBOX_ACCESS_TOKEN as string} />
        :end
      </div>
    </section>
  );
}
