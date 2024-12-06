import React, { useEffect } from "react";
import { Button } from "antd";
import { ImageIcon } from "../../Icons";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import FloatingMenu from "./FloatingMenu";

const QuestionEditor = ({ initialContent, onUpdate, orderNumber }) => {
  const editor = useEditor({
    extensions: [
      Underline,
      StarterKit.configure({
        table: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "h-[150px] object-cover rounded transition-all",
          "data-selected": "false",
        },
        selectable: true,
        draggable: false,
      }),
    ],
    content: initialContent || "Энд дарж асуултын текстийг өөрчилнө үү.",
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[100px] p-4",
      },
      handleClick: (view, pos, event) => {
        const images = document.querySelectorAll(".ProseMirror img");
        images.forEach((img) => img.setAttribute("data-selected", "false"));

        if (event.target.tagName === "IMG") {
          event.target.setAttribute("data-selected", "true");
        }
      },
    },
  });

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ProseMirror img[data-selected="true"] {
        outline: 2px solid #2563eb;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        editor?.chain().focus().setImage({ src: imageUrl }).run();
      }
    };

    input.click();
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col items-center">
        <div className="text-gray-500">A{orderNumber}</div>
        <button
          onClick={handleImageUpload}
          className="px-1 hover:bg-gray-100 rounded mt-2"
        >
          <ImageIcon width={16} />
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden relative ml-8 w-full">
        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            shouldShow={({ editor, state }) => {
              const { selection } = state;
              const isTextSelected = !selection.empty;
              const hasImage = editor.isActive("image");
              return isTextSelected && !hasImage;
            }}
            className="bg-white"
          >
            <FloatingMenu editor={editor} />
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default QuestionEditor;
