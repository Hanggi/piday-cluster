import VirtualEstateMap from "@/src/components/virtual-estate-map/VirtualEstateMap";

export const metadata = {
  title: "Home",
};

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

export default function HomePage() {
  return (
    <section className="container mx-auto  py-4 mb-8">
      <div>Home page</div>

      <div className="h-[800px] w-full relative pb-8">
        start:
        <VirtualEstateMap token={MAPBOX_ACCESS_TOKEN as string} />
        :end
      </div>
    </section>
  );
}
