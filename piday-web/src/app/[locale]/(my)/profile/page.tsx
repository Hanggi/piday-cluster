import MyProfile from "./_components/MyProfile";
import { MyPropertiesOverview } from "./leaderboard/_components/MyProperties";

export const metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <main>
      <MyPropertiesOverview />
      <MyProfile />
    </main>
  );
}
