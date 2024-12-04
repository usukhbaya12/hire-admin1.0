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
      <div>
        <Header />
      </div>
      <div className="flex">
        <div>
          <Menu selected={selected} setSelected={setSelected} />
        </div>
        <div className="flex-grow p-6">{display()}</div>
      </div>
    </>
  );
}
