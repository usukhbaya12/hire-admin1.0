"use client";

import React from "react";
import Menu from "@/components/Menu";
import Payment from "@/components/Payment";

export default function UsersPage() {
  return (
    <>
      <div className="flex">
        <div className="fixed">
          <Menu />
        </div>
        <div className="flex-grow ml-[220px]">
          <Payment />
        </div>
      </div>
    </>
  );
}
