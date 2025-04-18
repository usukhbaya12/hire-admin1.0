"use client";

import React from "react";
import Menu from "@/components/Menu";
import Feedback from "@/components/Feedback";

export default function UsersPage() {
  return (
    <>
      <div className="flex">
        <div className="fixed">
          <Menu />
        </div>
        <div className="flex-grow ml-[220px]">
          <Feedback />
        </div>
      </div>
    </>
  );
}
