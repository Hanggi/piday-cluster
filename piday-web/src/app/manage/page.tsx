// import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
// import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Button from "@mui/joy/Button";
import CssBaseline from "@mui/joy/CssBaseline";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";

import * as React from "react";

import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function AdminPage() {
  return (
    <div className="flex min-h-dvh">
      <Header />
      <Sidebar />
      <Box
        className="MainContent"
        component="main"
        sx={{
          px: { xs: 2, md: 6 },
          pt: {
            xs: "calc(12px + var(--Header-height))",
            sm: "calc(12px + var(--Header-height))",
            md: 3,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100dvh",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Breadcrumbs
            aria-label="breadcrumbs"
            separator={<i className="ri-file-damage-line"></i>}
            size="sm"
            sx={{ pl: 0 }}
          >
            <Link
              aria-label="Home"
              color="neutral"
              href="#some-link"
              underline="none"
            >
              <i className="ri-file-damage-line"></i>
            </Link>
            <Link
              color="neutral"
              fontSize={12}
              fontWeight={500}
              href="#some-link"
              underline="hover"
            >
              Dashboard
            </Link>
            <Typography color="primary" fontSize={12} fontWeight={500}>
              Orders
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box
          sx={{
            display: "flex",
            mb: 1,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "start", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography component="h1" level="h2">
            Orders
          </Typography>
          <Button
            color="primary"
            size="sm"
            startDecorator={<i className="ri-file-damage-line"></i>}
          >
            Download PDF
          </Button>
        </Box>
      </Box>
    </div>
  );
}
