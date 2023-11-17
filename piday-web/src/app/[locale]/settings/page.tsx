import { BreadCrumb } from "@/src/components/BreadCrumb";
import { WrapperCard } from "@/src/components/WrapperCard";

import { Form } from "./_components/Form";
import { User } from "./_components/User";

export const metadata = {
  title: "Settings",
};

export default function SettingPage() {
  return (
    <main className="container">
      <BreadCrumb />
      <WrapperCard className="p-0 md:p-0">
        <User />
        <Form />
      </WrapperCard>
      <br />
      <br />
    </main>
  );
}
