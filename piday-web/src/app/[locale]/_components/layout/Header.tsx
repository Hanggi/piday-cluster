import AuthStatusButton from "../auth/AuthStatusButton";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <Navbar navType="header">
      <AuthStatusButton />
    </Navbar>
  );
}
