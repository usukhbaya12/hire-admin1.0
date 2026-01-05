"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Dropdown, Tag } from "antd";
import {
  KeyBoldDuotone,
  LetterBoldDuotone,
  Login3BoldDuotone,
} from "solar-icons";
import { DropdownIcon } from "./Icons";
import PasswordModal from "./modals/Password";

const Header = () => {
  const { data: session } = useSession();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  const items = [
    {
      key: "userInfo",
      label: (
        <div className="p-1 rounded-lg">
          <div className="text-gray-800 flex items-center gap-1.5 mb-1 font-semibold">
            <LetterBoldDuotone width={16} height={16} />
            {session?.user?.email}
          </div>
          <Tag
            color="blue"
            className="rounded-full! shadow shadow-slate-200 font-semibold px-3 py-0.5"
          >
            {session?.user?.role === 10
              ? "Супер админ"
              : session?.user?.role === 40
              ? "Админ"
              : "Тестийн админ"}
          </Tag>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "changePassword",
      label: (
        <div
          onClick={() => setIsPasswordModalVisible(true)}
          className="cursor-pointer font-medium flex items-center gap-2 hover:text-main transition-colors"
        >
          <KeyBoldDuotone width={18} height={18} />
          Нууц үг солих
        </div>
      ),
    },
    {
      key: "signout",
      label: (
        <div
          onClick={() => {
            signOut({ callbackUrl: "/auth/signin" });
          }}
          className="text-red-500 cursor-pointer font-medium flex items-center gap-2 hover:text-red-600 transition-colors"
        >
          <Login3BoldDuotone width={18} height={18} />
          Гарах
        </div>
      ),
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white border-b border-neutral transition-shadow duration-300`}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -translate-y-1/2 rotate-[-30deg] opacity-50 text-gray-400 whitespace-nowrap text-lg font-semibold tracking-widest">
            {Array.from({ length: 200 }).map((_, i) => (
              <div key={i} className="mb-12">
                ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ
                ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ
                ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ
                ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ
                ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ
                ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ
                ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ
                ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ&nbsp;&nbsp;&nbsp;ТЕСТ
              </div>
            ))}
          </div>
        </div>
        <div className="px-9 mx-auto py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={"/"} className="flex items-center gap-2">
              <Image src="/hire-2.png" width={80} height={24} alt="Hire Logo" />
              <p className="font-black text-xl bg-main text-white px-1.5">
                ТЕСТ
              </p>
            </Link>

            {/* <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === "/"
                    ? "text-main bg-main/5"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <HomeBoldDuotone width={18} height={18} />
                  <span>Хянах самбар</span>
                </div>
              </Link>
            </nav> */}
          </div>

          <div className="flex items-center gap-4">
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              placement="bottomRight"
              arrow
              dropdownRender={(menu) => <div>{menu}</div>}
            >
              <div className="flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded-full hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-main/30 flex items-center justify-center">
                  <span className="text-main font-extrabold text-lg">
                    {session?.user?.name?.[0]}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-gray-800">
                    {session?.user?.name}
                  </div>
                </div>
                <DropdownIcon width={15} height={15} color={"#94a3b8"} />
              </div>
            </Dropdown>
          </div>
        </div>
      </header>
      <PasswordModal
        isOpen={isPasswordModalVisible}
        onClose={() => {
          setIsPasswordModalVisible(false);
        }}
      />
    </>
  );
};

export default Header;
