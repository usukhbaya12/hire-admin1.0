import React, { useState } from "react";
import {
  Radio,
  Checkbox,
  Input,
  Button,
  Dropdown,
  InputNumber,
  Tooltip,
} from "antd";
import {
  TrashIcon,
  ImageIcon,
  MoreIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  TagIcon,
  DropdownIcon,
  PenIcon,
} from "../Icons";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

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

const MatrixGrid = ({ question, onUpdate, assessmentData }) => {
  const [editingCell, setEditingCell] = useState(null);

  const handleCategorySelect = (category, index) => {
    const newScalePoints = [...question.matrix.scalePoints];
    newScalePoints[index] = {
      ...newScalePoints[index],
      category,
    };
    onUpdate({
      matrix: {
        ...question.matrix,
        scalePoints: newScalePoints,
      },
    });
  };

  const handleRemoveCategory = (index) => {
    const newScalePoints = [...question.matrix.scalePoints];
    newScalePoints[index] = {
      ...newScalePoints[index],
      category: null,
    };
    onUpdate({
      matrix: {
        ...question.matrix,
        scalePoints: newScalePoints,
      },
    });
  };

  const getCategorySubmenu = (index) => ({
    items:
      assessmentData?.categories?.map((category) => ({
        key: category,
        label: (
          <div>
            <div className="flex items-center gap-2">
              <TagIcon width={16} className="text-gray-400" />
              <span className="text-gray-600 font-medium">
                {category.toLowerCase()}
              </span>
            </div>
          </div>
        ),
        onClick: () => handleCategorySelect(category, index),
      })) || [],
  });

  const handleScalePointEdit = (index, newText) => {
    const newScalePoints = [...question.matrix.scalePoints];
    newScalePoints[index] = { ...newScalePoints[index], text: newText };
    onUpdate({
      matrix: {
        ...question.matrix,
        scalePoints: newScalePoints,
      },
    });
  };

  const handleOptionEdit = (index, newText) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], text: newText };
    onUpdate({ options: newOptions });
  };

  const handleScoreChange = (rowIndex, colIndex, value) => {
    const newScores =
      question.matrix.scores ||
      Array(question.options.length)
        .fill()
        .map(() => Array(question.matrix.scalePoints.length).fill(0));

    newScores[rowIndex][colIndex] = value;

    onUpdate({
      matrix: {
        ...question.matrix,
        scores: newScores,
      },
    });
  };

  return (
    <div className="w-full pr-12">
      <div className="flex">
        <div className="w-1/4 border-b border-r"></div>
        <div
          className="flex-1 grid border-b"
          style={{
            gridTemplateColumns: `repeat(${question.matrix.scalePoints.length}, 1fr)`,
          }}
        >
          {question.matrix.scalePoints.map((point, index) => (
            <div key={index} className="text-center mb-1">
              <div className="flex flex-col items-center">
                {editingCell?.type === "scale" &&
                editingCell?.index === index ? (
                  <input
                    value={point.text}
                    onChange={(e) =>
                      handleScalePointEdit(index, e.target.value)
                    }
                    onBlur={() => {
                      if (!point.text.trim()) {
                        handleScalePointEdit(index, `Цэг ${index + 1}`);
                      }
                      setEditingCell(null);
                    }}
                    autoFocus
                    className="w-full text-center outline-none underline"
                  />
                ) : (
                  <div
                    className="cursor-pointer hover:bg-neutral rounded text-gray-600 px-2"
                    onClick={() => setEditingCell({ type: "scale", index })}
                  >
                    {point.text}
                  </div>
                )}
                {point.category ? (
                  <Tooltip title="Ангилал устгах">
                    <div
                      className="flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-md text-sm cursor-pointer hover:bg-blue-200 mt-1"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <TagIcon width={14} />
                      {point.category}
                    </div>
                  </Tooltip>
                ) : (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "category",
                          label: (
                            <div className="pl-2 pr-3 pt-[1px]">
                              Ангилал тохируулах
                            </div>
                          ),
                          icon: <PenIcon width={16} />,
                          disabled:
                            !assessmentData?.hasAnswerCategory ||
                            !assessmentData?.categories?.length,
                          children: getCategorySubmenu(index).items,
                          expandIcon: <DropdownIcon width={15} rotate={-90} />,
                        },
                      ],
                    }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Button
                      type="text"
                      className="mt-1 opacity-0 hover:opacity-100"
                      icon={<MoreIcon width={16} />}
                    />
                  </Dropdown>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4"></div>
      {question.options.map((option, rowIndex) => (
        <div key={rowIndex} className="flex items-center">
          <div className="w-1/4 border-r py-1 pb-2">
            {editingCell?.type === "option" &&
            editingCell?.index === rowIndex ? (
              <input
                value={option.text}
                onChange={(e) => handleOptionEdit(rowIndex, e.target.value)}
                onBlur={() => {
                  if (!option.text.trim()) {
                    handleOptionEdit(rowIndex, `Мөр ${rowIndex + 1}`);
                  }
                  setEditingCell(null);
                }}
                autoFocus
                className="w-full outline-none underline"
              />
            ) : (
              <div
                className="cursor-pointer hover:bg-neutral rounded"
                onClick={() =>
                  setEditingCell({ type: "option", index: rowIndex })
                }
              >
                {option.text}
              </div>
            )}
          </div>
          <div
            className="flex-1 grid"
            style={{
              gridTemplateColumns: `repeat(${question.matrix.scalePoints.length}, 1fr)`,
            }}
          >
            {question.matrix.scalePoints.map((_, colIndex) => (
              <div key={colIndex} className="flex justify-center p-1">
                <InputNumber
                  min={-1}
                  value={question.matrix.scores?.[rowIndex]?.[colIndex] || 0}
                  onChange={(value) =>
                    handleScoreChange(rowIndex, colIndex, value)
                  }
                  className="w-20"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const AddQuestion = ({
  question,
  selected,
  onSelect,
  onUpdate,
  onDelete,
  assessmentData,
}) => {
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

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
    content: question.text || "Асуулт",
    onUpdate: ({ editor }) => {
      onUpdate({ text: editor.getHTML() });
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

  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ProseMirror img[data-selected="true"] {
        outline: 2px solid #2563eb;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleQuestionImageUpload = (e) => {
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

  const handleOptionImageUpload = async (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        const newOptions = [...question.options];
        newOptions[index] = { ...newOptions[index], image: { url: imageUrl } };
        onUpdate({ options: newOptions });
      }
    };

    input.click();
  };

  const removeOptionImage = (index) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], image: null };
    onUpdate({ options: newOptions });
  };

  const handleOptionChange = (index, changes) => {
    const newOptions = [...question.options];
    newOptions[index] = {
      ...newOptions[index],
      ...changes,
    };
    onUpdate({ options: newOptions });
  };

  const handleOptionBlur = (index) => {
    if (!question.options[index].text) {
      handleOptionChange(index, { text: `Сонголт ${index + 1}` });
    }
    setEditingOptionIndex(null);
  };

  const handleCategorySelect = (category, index) => {
    const newOptions = [...question.options];
    newOptions[index] = {
      ...newOptions[index],
      category,
    };
    onUpdate({ options: newOptions });
  };

  const handleRemoveCategory = (index) => {
    const newOptions = [...question.options];
    newOptions[index] = {
      ...newOptions[index],
      category: null,
    };
    onUpdate({ options: newOptions });
  };

  const getCategorySubmenu = (index) => ({
    items:
      assessmentData?.categories?.map((category) => ({
        key: category,
        label: (
          <div className="flex items-center gap-2">
            <TagIcon width={16} />
            <span className="font-medium">{category}</span>
          </div>
        ),
        onClick: () => handleCategorySelect(category, index),
      })) || [],
  });

  const getOptionMenu = (index) => ({
    items: [
      {
        key: "image",
        label: <div className="pl-2">Зураг оруулах</div>,
        icon: <ImageIcon width={16} />,
        onClick: () => handleOptionImageUpload(index),
      },
      {
        key: "category",
        label: <div className="pl-2 pt-[1px] pr-3">Ангилал тохируулах</div>,
        icon: <PenIcon width={16} />,
        disabled:
          !assessmentData?.hasAnswerCategory ||
          !assessmentData?.categories?.length,
        children: getCategorySubmenu(index).items,
        expandIcon: <DropdownIcon width={15} rotate={-90} />,
      },
      {
        key: "remove",
        label: <div className="pl-2">Устгах</div>,
        icon: <TrashIcon width={16} />,
        onClick: () => {
          const newOptions = [...question.options];
          newOptions.splice(index, 1);
          onUpdate({
            options: newOptions,
            optionCount: newOptions.length,
          });
        },
        danger: true,
        disabled: question.options.length <= 2,
      },
    ],
  });

  const handleCorrectAnswerChange = (index, checked) => {
    const newOptions = [...question.options];

    if (question.type === "single") {
      newOptions.forEach((opt, i) => {
        newOptions[i] = { ...opt, isCorrect: i === index ? checked : false };
      });
    } else {
      newOptions[index] = { ...newOptions[index], isCorrect: checked };
    }

    onUpdate({ options: newOptions });
  };

  return (
    <div
      className={`p-6 border rounded-xl mt-3 mb-1 pb-7 pl-8 pr-8 relative ${
        selected ? "border-main shadow-lg" : "hover:border-bg30"
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex w-full">
          <div className="flex flex-col items-center">
            <div className="text-gray-500">A{question.order}</div>
            <button
              onClick={handleQuestionImageUpload}
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

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-500 flex-shrink-0"
          type="text"
          icon={<TrashIcon width={18} />}
        />
      </div>

      <div className="pt-4 pl-[60px]">
        {question.type === "matrix" && (
          <MatrixGrid
            question={question}
            onUpdate={onUpdate}
            assessmentData={assessmentData}
          />
        )}

        {(question.type === "single" || question.type === "multiple") && (
          <div className="w-full">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 group">
                {question.type === "single" ? (
                  <Tooltip
                    title={
                      assessmentData?.hasCorrectAnswers
                        ? "Зөв хариугаар тэмдэглэх"
                        : ""
                    }
                  >
                    <Radio
                      disabled={!assessmentData?.hasCorrectAnswers}
                      checked={option.isCorrect || false}
                      onChange={(e) =>
                        handleCorrectAnswerChange(index, e.target.checked)
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={
                      assessmentData?.hasCorrectAnswers
                        ? "Зөв хариугаар тэмдэглэх"
                        : ""
                    }
                  >
                    <Checkbox
                      disabled={!assessmentData?.hasCorrectAnswers}
                      checked={option.isCorrect || false}
                      onChange={(e) =>
                        handleCorrectAnswerChange(index, e.target.checked)
                      }
                      className="pr-2"
                    />
                  </Tooltip>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div>
                      {option.image && (
                        <div className="mt-2 relative group/image">
                          <img
                            src={option.image.url}
                            alt={option.text}
                            className="h-[100px] object-cover rounded"
                          />
                          <button
                            onClick={() => removeOptionImage(index)}
                            className="absolute top-2 left-2 px-1 bg-white rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
                          >
                            <TrashIcon width={16} className="text-red-500" />
                          </button>
                        </div>
                      )}
                      {!option.image && (
                        <div className="flex items-center w-full">
                          {editingOptionIndex === index ? (
                            <input
                              value={option.text}
                              onChange={(e) =>
                                handleOptionChange(index, {
                                  text: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const nextIndex =
                                    index < question.options.length - 1
                                      ? index + 1
                                      : 0;
                                  setEditingOptionIndex(nextIndex);
                                }
                              }}
                              onBlur={() => handleOptionBlur(index)}
                              autoFocus
                              className="outline-none underline w-full"
                              size={option.text?.length + 10}
                            />
                          ) : (
                            <div
                              className={`cursor-pointer rounded-md w-full ${
                                editingOptionIndex === null
                                  ? "hover:bg-neutral"
                                  : ""
                              }`}
                              onClick={() => setEditingOptionIndex(index)}
                            >
                              {option.text?.trim() || `Сонголт ${index + 1}`}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <InputNumber
                      min={0}
                      value={option.score || 0}
                      onChange={(value) =>
                        handleOptionChange(index, { score: value })
                      }
                      className="w-24 h-[30px] ml-8"
                    />
                    {option.category && (
                      <Tooltip title="Ангилал устгах">
                        <div
                          className="flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-md text-sm cursor-pointer hover:bg-blue-200"
                          onClick={() => handleRemoveCategory(index)}
                        >
                          <TagIcon width={14} />
                          {option.category}
                        </div>
                      </Tooltip>
                    )}
                    <Dropdown
                      menu={getOptionMenu(index)}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <Button
                        type="text"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        icon={<MoreIcon width={16} />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Dropdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {question.type === "text" && (
          <div className="w-2/5 flex gap-2 items-center">
            <div className="w-[80%]">
              <Input disabled placeholder="Хариулт бичих хэсэг" />
            </div>
            <InputNumber
              min={0}
              value={question.falseScore || 0}
              onChange={(value) => onUpdate({ score: value })}
              className="w-full h-[30px]"
            />
          </div>
        )}

        {question.type === "constantSum" && (
          <div>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      {editingOptionIndex === index ? (
                        <input
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(index, {
                              text: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const nextIndex =
                                index < question.options.length - 1
                                  ? index + 1
                                  : 0;
                              setEditingOptionIndex(nextIndex);
                            }
                          }}
                          onBlur={() => handleOptionBlur(index)}
                          autoFocus
                          className="outline-none underline w-full"
                          size={option.text?.length + 10}
                        />
                      ) : (
                        <div
                          className={`cursor-pointer rounded-md w-full ${
                            editingOptionIndex === null
                              ? "hover:bg-neutral"
                              : ""
                          }`}
                          onClick={() => setEditingOptionIndex(index)}
                        >
                          {option.text?.trim() || `Сонголт ${index + 1}`}
                        </div>
                      )}
                    </div>
                    {option.category && (
                      <Tooltip title="Ангилал устгах">
                        <div
                          className="flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-md text-sm cursor-pointer hover:bg-blue-200"
                          onClick={() => handleRemoveCategory(index)}
                        >
                          <TagIcon width={14} />
                          {option.category}
                        </div>
                      </Tooltip>
                    )}
                    <InputNumber
                      disabled
                      value={0}
                      className="w-24 mr-2 h-[30px]"
                    />

                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "remove",
                            label: <div className="pl-2">Устгах</div>,
                            icon: <TrashIcon width={16} />,
                            onClick: () => {
                              const newOptions = [...question.options];
                              newOptions.splice(index, 1);
                              onUpdate({
                                options: newOptions,
                                optionCount: newOptions.length,
                              });
                            },
                            danger: true,
                            disabled: question.options.length <= 2,
                          },
                          {
                            key: "category",
                            label: (
                              <div className="pl-2 pt-[1px] pr-3">
                                Ангилал тохируулах
                              </div>
                            ),
                            icon: <PenIcon width={16} />,
                            disabled:
                              !assessmentData?.hasAnswerCategory ||
                              !assessmentData?.categories?.length,
                            children: getCategorySubmenu(index).items,
                            expandIcon: (
                              <DropdownIcon width={15} rotate={-90} />
                            ),
                          },
                        ],
                      }}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <Button
                        type="text"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        icon={<MoreIcon width={16} />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Dropdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {question.type === "trueFalse" && (
          <div className="w-full">
            <div className="flex items-center gap-2 mb-0.5">
              <Radio disabled />
              <div className="flex items-center gap-2 flex-1">
                <div className="w-16">Үнэн</div>
                <InputNumber
                  min={0}
                  value={question.trueScore || 1}
                  onChange={(value) => onUpdate({ trueScore: value })}
                  className="w-24"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Radio disabled />
              <div className="flex items-center gap-2 flex-1">
                <div className="w-16">Худал</div>
                <InputNumber
                  min={0}
                  value={question.falseScore || 0}
                  onChange={(value) => onUpdate({ falseScore: value })}
                  className="w-24 h-[30px]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddQuestion;
