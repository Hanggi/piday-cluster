import AuthStatusButton from "../auth/AuthStatusButton";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <Navbar Component="header">
      <AuthStatusButton />
    </Navbar>
  );
}
