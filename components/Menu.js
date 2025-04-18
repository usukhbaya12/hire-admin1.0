"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "./Icons";
import { Divider } from "antd";

const Menu = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Тестийн сан", key: "tests", href: "/" },
    { name: "Хэрэглэгчид", key: "users", href: "/users" },
    { name: "Үр дүн", key: "results", href: "/results" },
    { name: "Санал, хүсэлт", key: "feedbacks", href: "/feedbacks" },
    { name: "Төлбөр", key: "payments", href: "/payments" },
    { name: "Блог", key: "blogs", href: "/blogs" },
  ];

  return (
    <div className="border-r border-neutral py-3 w-[220px] h-screen">
      <div className="px-9 font-extrabold text-menu flex items-center gap-2 text-[#6a6d70]">
        <MenuIcon width={14} />
        Цэс
      </div>
      <Divider />
      <div className="flex-col flex gap-1 pl-5 pr-12">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              href={item.href}
              key={item.key}
              className={`block cursor-pointer rounded-xl hover:bg-bg10 hover:rounded-full hover:text-main hover:font-semibold
                          ${isActive ? "relative group" : ""}`}
            >
              {isActive ? (
                <>
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-gradient-to-br py-1.5 px-5 from-main/20 to-secondary/20 rounded-full flex items-center border border-main/10">
                    <div className="font-extrabold text-main">{item.name}</div>
                  </div>
                </>
              ) : (
                <div className="px-5 py-1.5">{item.name}</div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
