"use client";

import { signOut } from "@/lib/auth";
import { CiLogout } from "react-icons/ci";

import { Button } from "./ui/button";

export const LogOutButton = () => {
  return (
    <Button
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/login`,
        })
      }
      variant={"ghost"}
    >
      <CiLogout size={30} />
    </Button>
  );
};
