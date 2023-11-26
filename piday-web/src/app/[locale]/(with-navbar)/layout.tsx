import Footer from "./_components/layout/Footer";
import Header from "./_components/layout/Header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mt-40 relative z-10">{children}</main>
      <Footer />
    </>
  );
}
