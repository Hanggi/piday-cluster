"use client";

import { keycloakSessionLogOut } from "@/src/features/auth/keycloak/keycloakSessionLogout";
import { signOut, useSession } from "next-auth/react";

import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";

import Link from "next/link";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import SignInButton from "./SignInButton";

export default function AuthStatusButton() {
  const { t } = useTranslation("common");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error == "RefreshAccessTokenError") {
      keycloakSessionLogOut().then(() => {
        signOut({ callbackUrl: "/" });
      });
    }
  }, [session?.error]);

  if (status == "loading") {
    return <Button className="my-3">Loading...</Button>;
  } else if (session) {
    return (
      <Dropdown>
        <MenuButton color="primary" variant="solid">
          {session.user?.name}
        </MenuButton>
        <Menu>
          <MenuItem>
            <Link href={"/profile"}>Profile</Link>
          </MenuItem>
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
