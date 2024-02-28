import TransactionList from "./_components/TransactionList";

export default function TransactionAdminPage() {
  return (
    <div className="p-8 pt-16 md:pt-8">
      <h1>Transaction Admin Page</h1>

      <TransactionList />
    </div>
  );
}
