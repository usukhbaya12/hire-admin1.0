import React from "react";
import { MenuIcon, DropdownIcon, TagIcon } from "../Icons";
import {
  Select,
  Divider,
  Collapse,
  Switch,
  InputNumber,
  Input,
  Form,
  Modal,
} from "antd";

export const Tools = ({
  selection,
  blocks,
  onUpdateBlock,
  onUpdateQuestion,
  assessmentData,
  onUpdateAssessment,
}) => {
  const selectedBlock = blocks.find((b) => b.id === selection.blockId);
  const selectedQuestion = selectedBlock?.questions.find(
    (q) => q.id === selection.questionId
  );

  return (
    <div className="border-r py-3 w-1/5 fixed h-screen">
      <div className="px-6 font-bold text-menu flex items-center gap-2">
        <MenuIcon width={14} />
        {selection.questionId ? "Асуулт засах" : "Блокийн тохиргоо"}
      </div>
      <Divider />

      {selection.questionId && selectedQuestion ? (
        <QuestionSettings
          question={selectedQuestion}
          onUpdate={onUpdateQuestion}
        />
      ) : selectedBlock ? (
        <BlockSettings
          block={selectedBlock}
          onUpdate={onUpdateBlock}
          assessmentData={assessmentData}
          onUpdateAssessment={onUpdateAssessment}
        />
      ) : null}
    </div>
  );
};

const QuestionSettings = ({ question, onUpdate }) => {
  const isMatrix = question.type === "matrix";

  const updateMatrixScores = (options, scalePoints) => {
    const currentScores = question.matrix?.scores || [];
    return options.map((_, rowIndex) => {
      const row = currentScores[rowIndex] || [];
      return scalePoints.map((_, colIndex) => row[colIndex] || 0);
    });
  };

  const handleMatrixSettingsChange = (key, value) => {
    if (key === "scalePoints") {
      const currentScalePoints = question.matrix?.scalePoints || [];

      let newScalePoints;
      if (value > currentScalePoints.length) {
        // Adding new scale points
        newScalePoints = [
          ...currentScalePoints,
          ...Array.from(
            { length: value - currentScalePoints.length },
            (_, i) => ({
              text: `Цэг ${currentScalePoints.length + i + 1}`,
              category: null,
            })
          ),
        ];
      } else {
        // Reducing scale points
        newScalePoints = currentScalePoints.slice(0, value);
      }

      // Update scores to match new dimensions
      const newScores = updateMatrixScores(
        question.options || [],
        newScalePoints
      );

      onUpdate(question.id, {
        matrix: {
          ...question.matrix,
          scalePoints: newScalePoints,
          scores: newScores,
        },
      });
    } else {
      onUpdate(question.id, {
        matrix: {
          ...question.matrix,
          [key]: value,
        },
      });
    }
  };

  const handleOptionCountChange = (value) => {
    const currentOptions = question.options || [];
    const currentScalePoints = question.matrix?.scalePoints || [];

    let newOptions;
    if (value > currentOptions.length) {
      newOptions = [
        ...currentOptions,
        ...Array.from({ length: value - currentOptions.length }, (_, i) => ({
          text: `Сонголт ${currentOptions.length + i + 1}`,
          image: null,
        })),
      ];
    } else {
      newOptions = currentOptions.slice(0, value);
    }

    const newScores = updateMatrixScores(newOptions, currentScalePoints);

    onUpdate(question.id, {
      optionCount: value,
      options: newOptions,
      matrix: {
        ...question.matrix,
        scores: newScores,
      },
    });
  };

  const resetAnswersForType = (type) => {
    switch (type) {
      case "single":
      case "multiple":
        return Array.from({ length: 4 }, (_, i) => ({
          text: `Сонголт ${i + 1}`,
          image: null,
          score: 0,
          isCorrect: false,
        }));
      case "trueFalse":
        return [
          {
            text: "Үнэн",
            score: 1,
            isCorrect: false,
          },
          {
            text: "Худал",
            score: 0,
            isCorrect: false,
          },
        ];
    }
  };

  return (
    <>
      <div className="px-6 pb-1.5">
        <div className="font-bold pl-1 pb-2">Асуултын төрөл</div>
        <Select
          suffixIcon={<DropdownIcon width={15} height={15} />}
          value={question.type}
          onChange={(type) => {
            const updates = {
              type,
              answers: resetAnswersForType(type),
              optionCount: type === "trueFalse" ? 2 : 4,
            };

            if (type === "matrix") {
              updates.matrix = {
                scalePoints: Array.from({ length: 3 }, (_, i) => ({
                  text: `Цэг ${i + 1}`,
                })),
                allowMultiple: false,
              };
            }

            onUpdate(question.id, updates);
          }}
          options={[
            { value: "single", label: "Нэг хариулттай" },
            { value: "multiple", label: "Олон хариулттай" },
            { value: "trueFalse", label: "Үнэн, худал" },
            { value: "text", label: "Текст оруулах" },
            { value: "matrix", label: "Матриц" },
            { value: "constantSum", label: "Оноо байршуулах" },
          ]}
          className="w-full"
        />
      </div>
      <Divider />
      <div className="px-6">
        <div className="gap-2 flex items-center">
          <Switch
            size="small"
            checked={question.required}
            onChange={(checked) => onUpdate(question.id, { required: checked })}
          />
          <span>Заавал асуух</span>
        </div>
      </div>
      <Divider />

      {isMatrix && (
        <>
          <div>
            <div className="font-bold px-6">Матрицын тохиргоо</div>
            <Divider />
            <div className="flex px-[26px] items-center gap-2">
              <InputNumber
                min={2}
                max={10}
                value={question.matrix?.scalePoints?.length || 3}
                onChange={(value) =>
                  handleMatrixSettingsChange("scalePoints", value)
                }
                className="w-full"
              />
              <div className="text-sm text-gray-600">цэгтэй</div>
            </div>
            <Divider />
            <div className="flex px-[26px] items-center gap-2">
              <InputNumber
                min={2}
                max={10}
                value={question.optionCount}
                onChange={handleOptionCountChange}
                className="w-full"
              />
              <div className="text-sm text-gray-600">сонголттой</div>
            </div>
            <Divider />

            <div className="flex items-center gap-2 px-6">
              <Switch
                size="small"
                checked={question.matrix?.allowMultiple}
                onChange={(checked) =>
                  handleMatrixSettingsChange("allowMultiple", checked)
                }
              />
              <span className="text-sm">Олон сонголт зөвшөөрөх</span>
            </div>
          </div>
          <Divider />
        </>
      )}

      {question.type === "constantSum" && (
        <>
          <div>
            <Collapse
              expandIcon={({ isActive }) => (
                <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
              )}
              defaultActiveKey={["1"]}
              items={[
                {
                  key: "1",
                  label: "Сонголтын тоо",
                  children: (
                    <div className="flex items-center gap-2">
                      <InputNumber
                        min={2}
                        max={10}
                        value={question.optionCount}
                        onChange={(value) => {
                          onUpdate(question.id, {
                            optionCount: value,
                            options: Array.from(
                              { length: value },
                              (_, i) =>
                                question.options[i] || {
                                  text: `Сонголт ${i + 1}`,
                                  image: null,
                                }
                            ),
                          });
                        }}
                      />
                      <span>сонголттой</span>
                    </div>
                  ),
                },
              ]}
            />
            <Divider className="clps" />
            <div className="font-bold px-6">Байршуулах оноо</div>

            <Divider />
            <div className="px-6 flex items-center gap-2">
              <InputNumber
                min={1}
                max={1000}
                value={question.totalPoints}
                onChange={(value) =>
                  onUpdate(question.id, {
                    totalPoints: value,
                  })
                }
                className="w-full"
              />
              <div>оноо</div>
            </div>
          </div>
          <Divider />
          <Collapse
            expandIcon={({ isActive }) => (
              <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
            )}
            defaultActiveKey={["1"]}
            items={[
              {
                key: "1",
                label: "Онооны хязгаар",
                children: (
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span>Доод:</span>
                      <InputNumber
                        min={0}
                        max={question.totalPoints - 1}
                        value={question.minValue}
                        onChange={(value) =>
                          onUpdate(question.id, {
                            minValue: value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Дээд:</span>
                      <InputNumber
                        min={question.minValue || 0}
                        max={question.totalPoints}
                        value={question.maxValue}
                        onChange={(value) =>
                          onUpdate(question.id, {
                            maxValue: value,
                          })
                        }
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </>
      )}

      {["single", "multiple"].includes(question.type) && (
        <>
          <div>
            <Collapse
              expandIcon={({ isActive }) => (
                <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
              )}
              defaultActiveKey={["1"]}
              items={[
                {
                  key: "1",
                  label: "Хариултын тоо",
                  children: (
                    <div className="flex items-center gap-2">
                      <InputNumber
                        min={2}
                        max={10}
                        value={question.optionCount}
                        onChange={(value) => {
                          onUpdate(question.id, {
                            optionCount: value,
                            options: Array.from(
                              { length: value },
                              (_, i) =>
                                question.options[i] || {
                                  text: `Сонголт ${i + 1}`,
                                  image: null,
                                }
                            ),
                          });
                        }}
                      />
                      <span>хариулттай</span>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <Divider className="clps" />
        </>
      )}
    </>
  );
};

import { useState, useEffect } from "react";
import InfoModal from "../modals/Info";

const BlockSettings = ({
  block,
  onUpdate,
  assessmentData,
  onUpdateAssessment,
}) => {
  const [categoryInput, setCategoryInput] = useState(
    assessmentData?.categories?.join(", ") || ""
  );
  const [categories, setCategories] = useState(
    assessmentData?.categories || []
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (assessmentData?.categories) {
      setCategoryInput(assessmentData.categories.join(", "));
      setCategories(assessmentData.categories);
    }
  }, [assessmentData?.categories]);

  const handleBlockQuestionToggle = (checked) => {
    if (!checked) {
      onUpdate(block.id, {
        hasQuestion: false,
      });
    } else {
      onUpdate(block.id, {
        hasQuestion: true,
      });
    }
  };

  const handleCategorySwitchChange = (checked) => {
    if (!checked) {
      setIsModalVisible(true);
    } else {
      onUpdateAssessment({
        hasAnswerCategory: true,
      });
    }
  };

  const handleConfirmClear = () => {
    setCategoryInput("");
    setCategories([]);
    onUpdateAssessment({
      hasAnswerCategory: false,
      categories: [],
    });
    setIsModalVisible(false);
  };

  const processCategories = (value) => {
    const categoryArray = value
      .split(",")
      .map((category) => category.trim())
      .filter((category) => category !== "");

    setCategories(categoryArray);
    onUpdateAssessment({
      categories: categoryArray,
    });
  };

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setCategoryInput(value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      processCategories(categoryInput);
    }
  };

  const handleInputBlur = () => {
    processCategories(categoryInput);
  };

  return (
    <div>
      <InfoModal
        open={isModalVisible}
        onOk={handleConfirmClear}
        onCancel={() => {
          setIsModalVisible(false);
          onUpdateAssessment({
            hasAnswerCategory: true,
          });
        }}
        text={"Хариултын ангиллууд устгах гэж байна. Итгэлтэй байна уу?"}
      />
      <div className="gap-2 flex items-center px-6">
        <Switch
          size="small"
          checked={block.hasQuestion}
          onChange={handleBlockQuestionToggle}
        />
        <span>Блокийн асуулт</span>
      </div>
      <Divider />
      <Collapse
        expandIcon={({ isActive }) => (
          <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
        )}
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: "Хариултын ангилал",
            children: (
              <>
                <div className="flex items-center gap-2">
                  <Switch
                    size="small"
                    checked={assessmentData?.hasAnswerCategory}
                    onChange={handleCategorySwitchChange}
                  />
                  <span>Хариултууд ангилалтай юу?</span>
                </div>
                {assessmentData?.hasAnswerCategory && (
                  <div className="pt-3">
                    <div>
                      <div className="font-bold pb-1 pl-1">Ангиллууд</div>
                      <Form.Item>
                        <Input
                          value={categoryInput}
                          onChange={handleCategoryInputChange}
                          onKeyDown={handleInputKeyDown}
                          onBlur={handleInputBlur}
                          placeholder="Таслалаар хязгаарлан оруулна уу. Жишээ нь: D,I,S,C"
                          className="category"
                        />
                        {categories.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {categories.map((category, index) => (
                              <div
                                key={index}
                                className="bg-blue-100 px-2 py-0.5 gap-2 rounded-md text-sm flex items-center"
                              >
                                <TagIcon width={14} />
                                {category}
                              </div>
                            ))}
                          </div>
                        )}
                      </Form.Item>
                    </div>
                  </div>
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};
