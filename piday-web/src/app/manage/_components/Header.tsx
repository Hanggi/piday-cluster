"use client";

// import MenuIcon from "@mui/icons-material/Menu";
import { useSession } from "next-auth/react";

import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";

import * as React from "react";

import { toggleSidebar } from "../utils";

export default function Header() {
  // const { data: session } = useSession();
  // console.log(session);

  return (
    <Sheet
      sx={{
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        width: "100vw",
        height: "var(--Header-height)",
        zIndex: 9995,
        p: 2,
        gap: 1,
        borderBottom: "1px solid",
        borderColor: "background.level1",
        boxShadow: "sm",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Header-height": "52px",
            [theme.breakpoints.up("md")]: {
              "--Header-height": "0px",
            },
          },
        })}
      />
      <IconButton
        color="neutral"
        size="sm"
        variant="outlined"
        onClick={() => toggleSidebar()}
      >
        <i className="ri-menu-line"></i>
      </IconButton>
    </Sheet>
  );
}
