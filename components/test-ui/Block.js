import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import {
  DropdownIcon,
  TrashIcon,
  PlusIcon,
  ImageIcon,
  BoldIcon,
  UnderlineIcon,
  ItalicIcon,
} from "../Icons";
import { Question } from "./Question";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const FloatingMenu = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-lg border text-gray-400">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded hover:text-gray-600 ${
          editor.isActive("bold") ? "text-main" : ""
        }`}
      >
        <BoldIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded hover:text-gray-600 ${
          editor.isActive("italic") ? "text-main" : ""
        }`}
      >
        <ItalicIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 rounded hover:text-gray-600 ${
          editor.isActive("underline") ? "text-main" : ""
        }`}
      >
        <UnderlineIcon />
      </button>
    </div>
  );
};

export const Block = ({
  block,
  selection,
  onSelect,
  onUpdateBlock,
  onDeleteBlock,
  onAddBlock,
  onAddQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  assessmentData,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "h-[150px] object-cover rounded transition-all",
          "data-selected": "false",
        },
        selectable: true,
        draggable: false,
      }),
    ],
    content: block.text || "",
    onUpdate: ({ editor }) => {
      onUpdateBlock(block.id, { text: editor.getHTML() });
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

  const handleBlockImageUpload = (e) => {
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

  const handleDeleteBlockContent = () => {
    editor?.commands.setContent("");
    onUpdateBlock(block.id, { text: "" });
  };

  const isSelected = selection.blockId === block.id && !selection.questionId;

  return (
    <div
      className={`mb-4 border rounded-xl p-4 px-8 ${
        isSelected ? "border-main shadow-lg" : ""
      }`}
      onClick={() => onSelect(block.id, null)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateBlock(block.id, { isExpanded: !block.isExpanded });
            }}
            className="px-2 py-1 hover:bg-neutral rounded-md"
          >
            <DropdownIcon width={16} rotate={block.isExpanded ? 0 : -90} />
          </button>
          <div className="flex items-center">
            {isEditingName ? (
              <input
                value={block.name}
                onChange={(e) =>
                  onUpdateBlock(block.id, { name: e.target.value })
                }
                onBlur={() => setIsEditingName(false)}
                autoFocus
                className="font-bold outline-none underline"
                size={block.name?.length + 10}
              />
            ) : (
              <div
                className="cursor-pointer font-bold hover:bg-neutral rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
              >
                {block.name?.trim() || "Блок"}
              </div>
            )}
            {!block.isExpanded && (
              <span className="text-gray-500 ml-3">
                {block.questions.length} Асуулт
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddBlock();
            }}
            className="text-blue-500 hover:underline"
          >
            Блок нэмэх
          </button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBlock(block.id);
            }}
            className="text-red-500"
            type="text"
            icon={<TrashIcon width={18} />}
          />
        </div>
      </div>

      {block.isExpanded && (
        <div className="mt-4">
          {block.hasQuestion && (
            <div className="pl-[38px] pr-2">
              <div className="flex items-center gap-4">
                <div className="flex-1 border border-bg30 rounded-lg overflow-hidden relative">
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
                  <div className="border-b border-bg30 p-2 bg-bg20">
                    <div className="flex items-center gap-2 py-1">
                      <div className="pl-[10px] pr-1 font-semibold">
                        Блокийн асуулт
                      </div>
                      <button
                        onClick={handleBlockImageUpload}
                        className="px-1 hover:bg-bg30 rounded"
                      >
                        <ImageIcon width={16} />
                      </button>
                      <button
                        onClick={handleDeleteBlockContent}
                        className="px-1 hover:bg-bg30 rounded"
                      >
                        <TrashIcon width={16} />
                      </button>
                    </div>
                  </div>
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          )}

          <div className="pl-9 pr-2 mt-4">
            {block.questions.map((question) => (
              <Question
                key={question.id}
                question={question}
                blockId={block.id}
                isSelected={selection.questionId === question.id}
                onSelect={onSelect}
                onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
                onDelete={() => onDeleteQuestion(block.id, question.id)}
                assessmentData={assessmentData}
              />
            ))}

            <div className="flex justify-start pb-3 pt-5">
              <Button
                onClick={() => onAddQuestion(block.id)}
                className="bg-main border-none text-white rounded-xl px-4 login mb-0 font-bold"
                icon={<PlusIcon width={18} />}
              >
                Асуулт нэмэх
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
