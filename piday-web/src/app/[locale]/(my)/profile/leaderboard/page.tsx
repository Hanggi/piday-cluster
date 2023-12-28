import { MyPropertiesOverview } from "./_components/MyProperties";
import { Table } from "./_components/Table";

export const metadata = {
  title: "Leaderboard",
};

export default function LeaderboardPage() {
  return (
    <main>
      <MyPropertiesOverview />
      <Table />
    </main>
  );
}
