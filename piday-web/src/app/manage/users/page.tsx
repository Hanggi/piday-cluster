import UserList from "./_components/UserList";

export default function UserAdminPage() {
  return (
    <div className="p-8 pt-16 md:pt-8">
      <h1>User Admin Page</h1>
      <div>
        <UserList />
      </div>
    </div>
  );
}
