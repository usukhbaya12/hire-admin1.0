import React from "react";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "../../Icons";

const FloatingMenu = ({ editor }) => {
  if (!editor) return null;

  const MenuButton = ({ onClick, isActive, Icon }) => (
    <button
      onClick={onClick}
      className={`p-1 rounded hover:text-gray-600 ${
        isActive ? "text-main" : ""
      }`}
    >
      <Icon />
    </button>
  );

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-lg border text-gray-400">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        Icon={BoldIcon}
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        Icon={ItalicIcon}
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        Icon={UnderlineIcon}
      />
    </div>
  );
};

export default FloatingMenu;
