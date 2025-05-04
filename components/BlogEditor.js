"use client";

import React, { useState, useEffect, useCallback, Fragment } from "react";
import {
  Button,
  Spin,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  Upload,
  Divider,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import { QuoteIcon, DropdownIcon } from "@/components/Icons";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Focus from "@tiptap/extension-focus";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import {
  getBlogById,
  createBlog,
  updateBlogById,
  imageUploader,
} from "@/app/api/constant";

import { api } from "@/utils/routes";
import {
  CloseCircleBoldDuotone,
  CodeCircleBoldDuotone,
  GalleryCircleBoldDuotone,
  LinkCircleBoldDuotone,
  List1Bold,
  SettingsBoldDuotone,
  TextBoldCircleBoldDuotone,
  TextItalicCircleBoldDuotone,
  TextUnderlineCircleBoldDuotone,
  UndoLeftRoundBold,
  UndoRightRoundBold,
} from "solar-icons";
import { TestName } from "./test-ui/TestName";

const BLOG_CATEGORIES = [
  { label: "Блог", value: 1 },
  { label: "Зөвлөмжүүд", value: 2 },
];

const IconBold = () => <TextBoldCircleBoldDuotone />;
const IconItalic = () => <TextItalicCircleBoldDuotone />;
const IconUnderline = () => <TextUnderlineCircleBoldDuotone />;
const IconH1 = () => <strong>H1</strong>;
const IconH2 = () => <strong>H2</strong>;
const IconH3 = () => <strong>H3</strong>;
const IconBulletList = () => (
  <div className="flex gap-1 items-center">
    • <List1Bold width={20} />
  </div>
);
const IconOrderedList = () => (
  <div className="flex gap-1 items-center text-xs">
    1. <List1Bold width={20} />
  </div>
);
const IconBlockquote = () => <QuoteIcon />;
const IconCodeBlock = () => <CodeCircleBoldDuotone />;
const IconLink = () => <LinkCircleBoldDuotone />;
const IconUnlink = () => (
  <div className="flex gap-1 items-center text-xs font-semibold">
    <CloseCircleBoldDuotone width={20} color="red" /> Линк устгах
  </div>
);
const IconImage = () => <GalleryCircleBoldDuotone width={20} />;
const IconHorizontalRule = () => (
  <span className="text-xs font-semibold">Зай авах</span>
);
const IconUndo = () => <UndoLeftRoundBold width={20} />;
const IconRedo = () => <UndoRightRoundBold width={20} />;

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) {
        console.log("No file selected.");
        return;
      }
      try {
        const formData = new FormData();

        formData.append("files", file);

        const uploadResult = await imageUploader(formData);

        if (
          uploadResult &&
          Array.isArray(uploadResult) &&
          uploadResult.length > 0
        ) {
          const imageId = uploadResult[0];
          const imageUrl = `${api}file/${imageId}`;

          editor
            .chain()
            .focus()
            .setImage({ src: imageUrl, alt: file.name })
            .run();
        } else {
          console.error("Зураг оруулахад алдаа гарлаа.", uploadResult);
        }
      } catch (error) {
        console.error(
          "Error in addImage callback (outside imageUploader):",
          error
        );
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Холбох URL оруулах", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-neutral bg-gray-50 mt-2 px-5">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1 rounded ${
          editor.isActive("bold") ? "text-main" : "hover:text-gray-600"
        }`}
      >
        <IconBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${
          editor.isActive("italic") ? "text-main" : "hover:text-gray-600"
        }`}
      >
        <IconItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-1 rounded ${
          editor.isActive("underline") ? "text-main" : "hover:text-gray-600"
        }`}
      >
        <IconUnderline />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-0.5 px-1.5 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-main/80 text-white rounded-full"
            : "hover:bg-gray-200 rounded-full"
        }`}
      >
        <IconH1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-0.5 px-1 rounded ${
          editor.isActive("heading", { level: 2 })
            ? "bg-main/80 text-white rounded-full"
            : "hover:bg-gray-200 rounded-full"
        }`}
      >
        <IconH2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-0.5 px-1 rounded ${
          editor.isActive("heading", { level: 3 })
            ? "bg-main/80 text-white rounded-full"
            : "hover:bg-gray-200 rounded-full"
        }`}
      >
        <IconH3 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-0.5 px-1.5 rounded-full ${
          editor.isActive("bulletList")
            ? "bg-main/80 text-white"
            : "hover:bg-gray-200"
        }`}
      >
        <IconBulletList />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-0.5 px-1.5 rounded-full ${
          editor.isActive("orderedList")
            ? "bg-main/80 text-white"
            : "hover:bg-gray-200"
        }`}
      >
        <IconOrderedList />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 rounded ${
          editor.isActive("blockquote") ? "text-main" : "hover:text-gray-600"
        }`}
      >
        <IconBlockquote />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1 rounded ${
          editor.isActive("codeBlock") ? "text-main" : "hover:text-gray-600"
        }`}
      >
        <IconCodeBlock />
      </button>
      <button
        onClick={setLink}
        className={`p-1 rounded ${
          editor.isActive("link") ? "text-main" : "hover:text-gray-600"
        }`}
      >
        <IconLink />
      </button>
      <button onClick={addImage} className="p-1 rounded hover:text-main">
        <IconImage />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-0.5 px-1.5 rounded-full hover:bg-gray-200"
      >
        <IconHorizontalRule />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-0.5 px-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
      >
        <IconUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-0.5 px-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
      >
        <IconRedo />
      </button>
    </div>
  );
};

const EditorBubbleMenu = ({ editor }) => {
  if (!editor) return null;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  }, [editor]);

  const currentLink = editor.getAttributes("link").href;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, zIndex: 30 }}
      shouldShow={({ editor, view, state, oldState, from, to }) => {
        const { selection } = state;
        return !selection.empty;
      }}
      className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-lg border text-gray-400"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded ${
          editor.isActive("bold") ? "text-main" : "hover:text-gray-600"
        }`}
      >
        <IconBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${
          editor.isActive("italic") ? "text-main" : "hover:text-gray-600"
        }`}
      >
        <IconItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 rounded ${
          editor.isActive("underline") ? "text-main" : "hover:text-gray-600"
        }`}
      >
        <IconUnderline />
      </button>
      <div className="w-px h-4 bg-gray-500 mx-1"></div>
      {editor.isActive("link") ? (
        <Fragment>
          <button
            onClick={setLink}
            className="p-1 rounded hover:text-gray-700 text-xs font-semibold"
          >
            Линк засах
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1 rounded hover:text-gray-700"
          >
            <IconUnlink />
          </button>
        </Fragment>
      ) : (
        <button onClick={setLink} className="p-1 rounded hover:text-gray-600">
          <IconLink />
        </button>
      )}
    </BubbleMenu>
  );
};

const BlogEditor = () => {
  const router = useRouter();
  const params = useParams();
  const isEditMode = !!params?.id;
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    image: null,
    minutes: 2,
    category: 1,
    pinned: false,
  });
  const [fileList, setFileList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeKey, setActiveKey] = useState("1");
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditorReady, setIsEditorReady] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },

        codeBlock: {
          HTMLAttributes: {
            class:
              "bg-gray-100 p-2 rounded border text-sm my-1! overflow-x-auto",
          },
        },
        gapcursor: true,
        paragraph: {
          HTMLAttributes: {
            class: "my-1",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer nofollow",
          class: "text-blue-600 hover:text-blue-800 underline cursor-pointer",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "max-w-full h-auto my-1 rounded-lg border block",
        },
      }),
      Placeholder.configure({
        placeholder: "Нийтлэл бичих...",
      }),
      Focus.configure({
        className: "has-focus",
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-6 border-gray-300",
        },
      }),
    ],
    content: "",
    onBlur: ({ editor }) => {
      const currentContent = editor.getHTML();
      if (currentContent !== blog.content) {
        setBlog((prev) => ({ ...prev, content: currentContent }));
      }
    },
    onCreate: () => {
      setIsEditorReady(true);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none p-4 editor-styling",
      },
    },
  });

  useEffect(() => {
    if (isEditMode && params.id) {
      fetchBlog(params.id);
    }
  }, [isEditMode, params?.id]);

  useEffect(() => {
    if (
      editor &&
      isEditorReady &&
      blog.content &&
      editor.getHTML() !== blog.content
    ) {
      editor.commands.setContent(blog.content, false);
    }
  }, [editor, isEditorReady, blog.content]);

  const fetchBlog = async (id) => {
    try {
      setLoading(true);
      const response = await getBlogById(id);

      if (response.success && response.data) {
        const blogData = response.data;
        setBlog({
          title: blogData.title || "",
          content: blogData.content || "",
          image: blogData.image || null,
          minutes: blogData.minutes || 2,
          category: blogData.category || 1,
          pinned: blogData.pinned || false,
        });

        if (blogData.image) {
          const url = `${api}file/${blogData.image}`;
          setPreviewUrl(url);
          setFileList([
            {
              uid: "-1",
              name: "featured-image.jpg",
              status: "done",
              url: url,
            },
          ]);
        } else {
          setPreviewUrl("");
          setFileList([]);
        }
      } else {
        messageApi.error(
          response.message || "Blog not found or failed to load"
        );
        router.push("/");
      }
    } catch (error) {
      console.error("Fetch blog error:", error);
      messageApi.error("Failed to fetch blog data: " + error.message);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const handleTitleChange = (e) => {
    setBlog((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleTitleChange2 = (value) => {
    setBlog((prev) => ({ ...prev, title: value }));
  };

  const handleCategoryChange = (value) => {
    setBlog((prev) => ({ ...prev, category: value }));
  };

  const handleMinutesChange = (value) => {
    setBlog((prev) => ({ ...prev, minutes: value || 1 }));
  };

  const handlePinnedChange = (checked) => {
    setBlog((prev) => ({ ...prev, pinned: checked }));
  };

  const handleFeaturedImageUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    messageApi.loading({
      content: "Зураг оруулж байна...",
      key: "fup",
      duration: 0,
    });

    try {
      const formData = new FormData();

      formData.append("files", file);

      const uploadResult = await imageUploader(formData);

      if (
        uploadResult &&
        Array.isArray(uploadResult) &&
        uploadResult.length > 0
      ) {
        const imageId = uploadResult[0];
        const imageUrl = `${api}file/${imageId}`;

        setBlog((prev) => ({ ...prev, image: imageId }));
        setPreviewUrl(imageUrl);

        const newFileList = [
          {
            uid: file.uid || "-1",
            name: file.name,
            status: "done",
            url: imageUrl,
          },
        ];
        setFileList(newFileList);

        messageApi.success({
          content: "Зураг амжилттай орууллаа.",
          key: "fup",
        });

        onSuccess({ message: "Амжилттай.", id: imageId, url: imageUrl }, file);
      } else {
        setBlog((prev) => ({ ...prev, image: null }));
        setPreviewUrl("");
        setFileList([]);

        messageApi.error({
          content: "Зураг оруулахад алдаа гарлаа.",
          key: "fup",
        });

        const err = new Error("Upload failed via imageUploader");

        onError(err);
      }
    } catch (error) {
      setBlog((prev) => ({ ...prev, image: null }));
      setPreviewUrl("");
      setFileList([]);

      messageApi.error({
        content: `Сервертэй холбогдоход алдаа гарлаа. ${error.message}`,
        key: "fup",
      });

      onError(error);
    }
  };

  const handleRemoveFeaturedImage = () => {
    setFileList([]);
    setBlog((prev) => ({ ...prev, image: null }));
    setPreviewUrl("");

    return true;
  };

  const handleSave = async () => {
    if (!blog.title.trim()) {
      messageApi.error("Please enter a title.");
      setActiveKey("2");
      return;
    }

    const editorContent = editor?.getHTML() || "";

    const isEmpty = !editor?.getText().trim();

    if (isEmpty) {
      messageApi.error("Please enter content for the blog.");
      setActiveKey("1");
      return;
    }

    messageApi.loading({
      content: "Хадгалж байна...",
      key: "save",
      duration: 0,
    });

    const finalBlogData = { ...blog, content: editorContent };

    try {
      let response;
      if (isEditMode) {
        response = await updateBlogById(params.id, finalBlogData);
      } else {
        response = await createBlog(finalBlogData);
      }

      if (response.success) {
        messageApi.success({
          content: `Блог амжилттай ${
            isEditMode ? "шинэчлэгдлээ." : "нийтлэгдлээ."
          }`,
          key: "save",
        });
      } else {
        messageApi.error({
          content:
            response.message ||
            `Блог ${isEditMode ? "шинэчлэхэд" : "нийтлэхэд"} алдаа гарлаа.`,
          key: "save",
        });
      }
    } catch (error) {
      console.error("Save blog error:", error);
      messageApi.error({
        content: `Сервертэй холбогдоход алдаа гарлаа. ${error.message}`,
        key: "save",
      });
    }
  };

  return (
    <div className="flex flex-col">
      {contextHolder}
      <div className="fixed w-full top-0 z-40 bg-white">
        <Header />
        <div className="flex border-b border-neutral pl-8 pr-11 justify-between items-end fixed w-full bg-white z-10">
          <div className="flex gap-6">
            <div
              className={`cursor-pointer p-2 ${
                activeKey === "1"
                  ? "font-bold text-main border-b-2 border-main"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => handleTabChange("1")}
            >
              Агуулга
            </div>
            <div
              className={`cursor-pointer p-2 ${
                activeKey === "2"
                  ? "font-bold text-main border-b-2 border-main"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => handleTabChange("2")}
            >
              Тохиргоо
            </div>
          </div>

          <div className="flex gap-2 py-2 items-center">
            <Button
              onClick={handleSave}
              disabled={loading || !editor}
              className="the-btn"
            >
              {isEditMode ? "Шинэчлэх" : "Хадгалах"}
            </Button>
          </div>
        </div>
      </div>
      {activeKey === "1" && (
        <div className="mt-[60px] px-4 sm:px-6 lg:px-8 pb-12 pt-6">
          <div className="max-w-3xl mx-auto bg-white border rounded-3xl border-neutral overflow-hidden">
            <Input.TextArea
              placeholder="Блогийн гарчиг..."
              value={blog.title}
              onChange={handleTitleChange}
              className="text-2xl! md:text-3xl! font-black border-none! focus:shadow-none! px-4! py-3! mt-2! mb-1! mx-2! w-full! placeholder-gray-400! resize-none!" // Added resize-none
              autoSize={{ minRows: 2, maxRows: 4 }}
              size="large"
            />

            <MenuBar editor={editor} />

            {editor && <EditorBubbleMenu editor={editor} />}

            <EditorContent
              editor={editor}
              className="min-h-[500px] editor-content-area p-2 text-justify text-base!"
            />
            <style jsx global>{`
              .editor-content-area .ProseMirror {
                font-size: 14px !important;
              }
            `}</style>
          </div>
        </div>
      )}
      {activeKey === "2" && (
        <div className="mt-[47px]">
          {contextHolder}
          <div className="border-r border-neutral py-3 w-1/5 fixed h-screen">
            <div className="px-8 font-extrabold text-menu flex items-center gap-2 mt-1 text-[#6a6d70] pb-3 border-b border-neutral">
              <SettingsBoldDuotone width={16} />
              Тохиргоо
            </div>
            <div className={`px-8 py-3 bg-gray-100 cursor-pointer`}>
              <div className="font-bold">Ерөнхий мэдээлэл</div>
              <div className="text-[13px] pb-0.5">
                Блогийн гарчиг, зураг, төрөл
              </div>
            </div>
          </div>
          <div className="ml-[20%]">
            <div className="p-6 w-1/2">
              <div className="pr-36">
                <div className="px-1 pb-1">Блогийн гарчиг</div>
                <TestName
                  testName={blog.title || ""}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  setTestName={(value) => handleTitleChange2(value)}
                />
                <Divider />
                <div className="pr-36 pt-1">
                  <div className="px-1 pb-2">Ангилал</div>
                  <div className="flex gap-4 pb-2">
                    <Select
                      className="w-full"
                      options={BLOG_CATEGORIES}
                      value={blog.category}
                      onChange={handleCategoryChange}
                      suffixIcon={<DropdownIcon width={15} height={15} />}
                    />
                  </div>
                </div>
                <Divider />
                <div className="pr-36 pt-1">
                  <div className="px-1 pb-2">Унших хугацаа (тойм.)</div>
                  <div className="flex gap-4 pb-2">
                    <InputNumber
                      className="w-full"
                      min={1}
                      max={99}
                      value={blog.minutes}
                      onChange={handleMinutesChange}
                    />
                  </div>
                </div>
                <Divider />
                <div className="flex items-center gap-2 pb-1">
                  <Switch
                    checked={blog.pinned}
                    onChange={handlePinnedChange}
                    size="small"
                  />
                  <span>Онцлох нийтлэл болгох</span>
                </div>
                <Divider />
              </div>

              <div>
                <div className="px-1 pb-2">Нүүр зураг</div>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  customRequest={handleFeaturedImageUpload}
                  onRemove={handleRemoveFeaturedImage}
                  maxCount={1}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  className="featured-image-uploader"
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Зураг оруулах</div>
                    </div>
                  )}
                </Upload>
                <style jsx global>{`
                  .featured-image-uploader .ant-upload-select {
                    width: 128px !important;
                    height: 128px !important;
                  }
                  .featured-image-uploader .ant-upload-list-item-container {
                    width: 128px !important;
                    height: 128px !important;
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
