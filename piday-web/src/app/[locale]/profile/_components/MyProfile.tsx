"use client";

import { useSession } from "next-auth/react";

import Typography from "@mui/joy/Typography";

export default function MyProfile() {
  const { data: session } = useSession();

  return (
    <div>
      <div>
        <Typography level="title-md">My Profile</Typography>
        <Typography>{session?.user?.email}</Typography>
      </div>
      <Typography>{session?.user?.name}</Typography>
    </div>
  );
}
