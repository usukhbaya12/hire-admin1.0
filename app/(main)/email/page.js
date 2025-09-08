"use client";

import React from "react";
import Menu from "@/components/Menu";
import Email from "@/components/Email";

export default function EmailPage() {
  return (
    <>
      <div className="flex">
        <div className="fixed">
          <Menu />
        </div>
        <div className="flex-grow ml-[220px]">
          <Email />
        </div>
      </div>
    </>
  );
}
