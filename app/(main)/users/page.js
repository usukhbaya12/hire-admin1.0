"use client";

import React from "react";
import Menu from "@/components/Menu";
import Users from "@/components/Users";

export default function UsersPage() {
  return (
    <>
      <div className="flex">
        <div className="fixed">
          <Menu />
        </div>
        <div className="flex-grow ml-[220px]">
          <Users />
        </div>
      </div>
    </>
  );
}
