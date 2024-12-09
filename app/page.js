"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Assessments from "@/components/Assessments";

export default function Home() {
  const [selected, setSelected] = useState("tests");

  const display = () => {
    switch (selected) {
      case "tests":
        return <Assessments />;
      case "users":
        return null;
      case "payments":
        return null;
      case "reports":
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed w-full top-0 z-10 bg-white">
        <Header />
      </div>
      <div className="flex mt-[48px]">
        <div className="fixed">
          <Menu selected={selected} setSelected={setSelected} />
        </div>
        <div className="flex-grow p-6 ml-[12.4%]">{display()}</div>
      </div>
    </>
  );
}
