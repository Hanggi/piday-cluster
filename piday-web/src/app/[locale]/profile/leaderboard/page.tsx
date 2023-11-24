import { Statistics } from "./_components/Statistics";
import { Table } from "./_components/Table";

export const metadata = {
  title: "Leaderboard",
};

export default function LeaderboardPage() {
  return (
    <main>
      <Statistics />
      <Table />
    </main>
  );
}
