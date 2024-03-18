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
import Script from "next/script";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import SignInButton from "./SignInButton";

interface Props {
  size?: "sm" | "md" | "lg";
}

export default function AuthStatusButton({ size = "md" }: Props) {
  const { t } = useTranslation(["common", "profile"]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error == "RefreshAccessTokenError") {
      keycloakSessionLogOut().then(() => {
        signOut({ callbackUrl: "/" });
      });
    }
  }, [session?.error]);

  if (status == "loading") {
    return (
      <Button className="my-3" size={size}>
        Loading...
      </Button>
    );
  } else if (session) {
    return (
      <Dropdown>
        <MenuButton
          className="max-w-[120px]"
          color="primary"
          size={size}
          variant="solid"
        >
          <div className="w-full truncate">{session.user?.name}</div>
        </MenuButton>
        <Menu>
          <MenuItem>
            <Link href={"/profile"}> {t("profile:profile.myProfile")}</Link>
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
      <Script
        src="https://sdk.minepi.com/pi-sdk.js"
        onLoad={() => {
          // @ts-ignore
          (Pi as any).init({ version: "2.0" });
        }}
      />
    </div>
  );
}
