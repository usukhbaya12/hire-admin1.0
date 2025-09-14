"use client";

import React from "react";
import Menu from "@/components/Menu";
import Contact from "@/components/Contact";

export default function ContactPage() {
  return (
    <>
      <div className="flex">
        <div className="fixed">
          <Menu />
        </div>
        <div className="flex-grow ml-[220px]">
          <Contact type="30" />
        </div>
      </div>
    </>
  );
}
