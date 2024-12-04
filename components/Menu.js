import React from "react";
import { MenuIcon } from "./Icons";

const Menu = ({ selected, setSelected }) => {
  const menuItems = [
    { name: "Тестүүд", key: "tests" },
    { name: "Хэрэглэгчид", key: "users" },
    { name: "Төлбөр", key: "payments" },
    { name: "Тайлан", key: "reports" },
  ];

  return (
    <div className="border-r p-6 py-3 w-fit h-screen">
      <div className="font-bold text-menu mb-2 flex items-center gap-2">
        <MenuIcon width={14} />
        Цэс
      </div>
      <div className="flex-col flex gap-1">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`cursor-pointer py-1.5 px-6 rounded-xl ${
              selected === item.key
                ? "bg-bg20 text-main font-bold"
                : "hover:bg-bg10"
            }`}
            onClick={() => setSelected(item.key)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
