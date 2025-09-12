"use client";

import React from "react";
import Menu from "@/components/Menu";
import Users from "@/components/Users";
import Admins from "@/components/Admins";

export default function UsersPage() {
  return (
    <>
      <div className="flex">
        <div className="fixed">
          <Menu />
        </div>
        <div className="flex-grow ml-[220px]">
          <Admins />
        </div>
      </div>
    </>
  );
}
