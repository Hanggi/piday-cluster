import Button from "@mui/joy/Button";

import Banner from "./_components/Banner";

export default function Home() {
  return (
    <div className="container mx-auto">
      <Banner />
      Homepage
      <Button>Hello</Button>
      <Button color="neutral">Hello</Button>
      <Button color="success">Hello</Button>
      <Button color="danger">Hello</Button>
    </div>
  );
}
