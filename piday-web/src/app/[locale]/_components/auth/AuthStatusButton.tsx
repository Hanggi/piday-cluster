"use client";

import { signOut, useSession } from "next-auth/react";

import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";

import { useTranslation } from "react-i18next";

import SignInButton from "./SignInButton";

async function keycloakSessionLogOut() {
  try {
    await fetch("/api/auth/logout", {
      method: "GET",
    });
  } catch (err) {
    console.error(err);
  }
}

export default function AuthStatusButton() {
  const { t } = useTranslation("common");

  const { data: session, status } = useSession();

  console.log(session, status);

  if (status == "loading") {
    return <Button className="my-3">Loading...</Button>;
  } else if (session) {
    return (
      <Dropdown>
        <MenuButton color="primary" variant="solid">
          {session.user?.name}
        </MenuButton>
        <Menu>
          <Divider />
          <MenuItem
            onClick={() => {
              keycloakSessionLogOut().then(() => {
                signOut({ callbackUrl: "/" });
              });
            }}
          >
            {t("common:header.logOut")}
          </MenuItem>
        </Menu>
      </Dropdown>
    );
  }

  return (
    <div>
      <SignInButton />
    </div>
  );
}
