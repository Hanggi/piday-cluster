import MigrateToEmailAccount from "./_components/MigrateToEmailAccount";

export const metadata = {
  title: "Profile",
};

export default function ResetPassword() {
  return (
    <main>
      <MigrateToEmailAccount />
    </main>
  );
}
