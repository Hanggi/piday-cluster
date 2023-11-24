import { BreadCrumb } from "@/src/components/BreadCrumb";
import { WrapperCard } from "@/src/components/WrapperCard";

import { ProfileUpdateForm } from "./_components/ProfileUpdateForm";
import { UserProfileMini } from "./_components/UserProfileMini";

export const metadata = {
  title: "Settings",
};

export default function SettingPage() {
  return (
    <main className="container">
      <BreadCrumb />
      <WrapperCard className="p-0 md:p-0">
        <UserProfileMini />
        <ProfileUpdateForm />
      </WrapperCard>
      <br />
      <br />
    </main>
  );
}
