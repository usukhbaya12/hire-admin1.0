"use client";

import React, { useState, useEffect } from "react";
import { MenuIcon, DropdownIcon, TagIcon } from "../Icons";
import {
  Select,
  Divider,
  Collapse,
  Switch,
  InputNumber,
  Input,
  Form,
} from "antd";
import InfoModal from "../modals/Info";

const questionTypes = [
  { value: "single", label: "Нэг хариулттай" },
  { value: "multiple", label: "Олон хариулттай" },
  { value: "trueFalse", label: "Үнэн, худал" },
  { value: "text", label: "Текст оруулах" },
  { value: "matrix", label: "Матриц" },
  { value: "constantSum", label: "Оноо байршуулах" },
];

const getDefaultAnswers = (type, count = 4) => {
  const templates = {
    single: (i) => ({
      value: `Сонголт ${i + 1}`,
      image: null,
      score: 0,
      isCorrect: false,
    }),
    multiple: (i) => ({
      value: `Сонголт ${i + 1}`,
      image: null,
      score: 0,
      isCorrect: false,
    }),
    trueFalse: (i) => ({
      value: i === 0 ? "Үнэн" : "Худал",
      score: i === 0 ? 1 : 0,
      isCorrect: false,
    }),
    text: () => [],
    constantSum: (i) => ({
      value: `Сонголт ${i + 1}`,
      score: 0,
      category: null,
    }),
    matrix: (i) => ({ value: `Сонголт ${i + 1}`, score: 0, category: null }),
  };

  const template = templates[type] || (() => ({}));
  return type === "text"
    ? []
    : Array.from({ length: count }, (_, i) => template(i));
};

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
      ) : (
        selectedBlock && (
          <BlockSettings
            block={selectedBlock}
            onUpdate={onUpdateBlock}
            assessmentData={assessmentData}
            onUpdateAssessment={onUpdateAssessment}
          />
        )
      )}
    </div>
  );
};

const QuestionSettings = ({ question, onUpdate }) => {
  const updateOptions = (type, count) => {
    let answers;
    let updates = { type, optionCount: count };

    if (question.type === "constantSum") {
      updates.constantSumSettings = {
        totalPoints: question.totalPoints,
        minValue: question.minValue,
        maxValue: question.maxValue,
      };
    }

    if (type === "matrix") {
      answers = {
        answer: Array.from({ length: count }, (_, i) => ({
          value: {
            value: `Сонголт ${i + 1}`,
            point: 0,
            orderNumber: i,
          },
          matrix: Array.from({ length: count }, (_, j) => ({
            value: `Цэг ${j + 1}`,
            category: null,
            orderNumber: j,
          })),
        })),
      };
    } else {
      const currentAnswers = question.answers || [];
      const preserveAnswers =
        ["single", "multiple", "constantSum"].includes(type) &&
        ["single", "multiple", "constantSum"].includes(question.type);

      if (preserveAnswers) {
        answers = Array.from({ length: count }, (_, i) => ({
          value: currentAnswers[i]?.value || `Сонголт ${i + 1}`,
          image: currentAnswers[i]?.image || null,
          score: currentAnswers[i]?.score || 0,
          isCorrect: currentAnswers[i]?.isCorrect || false,
          category: currentAnswers[i]?.category || null,
        }));
      } else {
        answers = getDefaultAnswers(type, count);
      }
    }

    updates.answers = answers;

    if (type === "constantSum") {
      if (question.constantSumSettings) {
        updates = {
          ...updates,
          totalPoints: question.constantSumSettings.totalPoints,
          minValue: question.constantSumSettings.minValue,
          maxValue: question.constantSumSettings.maxValue,
        };
      } else {
        updates = {
          ...updates,
          totalPoints: 100,
          minValue: 0,
          maxValue: 100,
        };
      }
    }

    onUpdate(question.id, updates);
  };

  const handleOptionCountChange = (value) => {
    const currentAnswers = question.answers || [];
    const newAnswers =
      value > currentAnswers.length
        ? [
            ...currentAnswers,
            ...getDefaultAnswers(question.type, value - currentAnswers.length),
          ]
        : currentAnswers.slice(0, value);

    onUpdate(question.id, {
      optionCount: value,
      answers: newAnswers,
    });
  };

  const renderOptionCountSetting = () => (
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
                onChange={handleOptionCountChange}
              />
              <span>хариулттай</span>
            </div>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <div className="px-6 pb-1.5">
        <div className="font-bold pl-1 pb-2">Асуултын төрөл</div>
        <Select
          suffixIcon={<DropdownIcon width={15} height={15} />}
          value={question.type}
          onChange={(type) => updateOptions(type, type === "trueFalse" ? 2 : 4)}
          options={questionTypes}
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

      {question.type === "matrix" && (
        <MatrixSettings question={question} onUpdate={onUpdate} />
      )}

      {question.type === "constantSum" && (
        <ConstantSumSettings question={question} onUpdate={onUpdate} />
      )}

      {["single", "multiple"].includes(question.type) && (
        <>
          {renderOptionCountSetting()}
          <Divider className="clps" />
        </>
      )}
    </>
  );
};

const MatrixSettings = ({ question, onUpdate }) => (
  <>
    <div>
      <div className="font-bold px-6">Матрицын тохиргоо</div>
      <Divider />
      <div className="flex px-[26px] items-center gap-2">
        <InputNumber
          min={2}
          max={10}
          value={question.answers?.answer?.[0]?.matrix?.length || 3}
          onChange={(value) => {
            const currentAnswers = question.answers?.answer || [];
            const currentMatrixLength = currentAnswers[0]?.matrix?.length || 0;

            const newAnswers = currentAnswers.map((answer) => {
              const matrix = [...(answer.matrix || [])];

              if (value > currentMatrixLength) {
                for (let i = currentMatrixLength; i < value; i++) {
                  matrix.push({
                    value: `Цэг ${i + 1}`,
                    category: null,
                    point: 0,
                    orderNumber: i,
                  });
                }
              } else {
                matrix.length = value;
              }

              return {
                ...answer,
                matrix,
              };
            });

            onUpdate(question.id, {
              answers: { answer: newAnswers },
            });
          }}
          className="w-full"
        />
        <div className="text-sm text-gray-600">цэгтэй</div>
      </div>
      <Divider />
      <div className="flex px-[26px] items-center gap-2">
        <InputNumber
          min={2}
          max={10}
          value={question.answers?.answer?.length || 2}
          onChange={(value) => {
            const currentAnswers = question.answers?.answer || [];

            const newAnswers = Array(value)
              .fill()
              .map((_, i) => {
                if (i < currentAnswers.length) {
                  return currentAnswers[i];
                }
                return {
                  value: {
                    value: `Сонголт ${i + 1}`,
                    point: 0,
                    orderNumber: i,
                  },
                  matrix: scalePoints.map((_, j) => ({
                    value: scalePoints[j]?.value || `Цэг ${j + 1}`,
                    category: scalePoints[j]?.category || null,
                    point: 0,
                    orderNumber: j,
                  })),
                };
              });

            onUpdate(question.id, {
              optionCount: value,
              answers: { answer: newAnswers },
            });
          }}
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
            onUpdate(question.id, {
              matrix: { ...question.matrix, allowMultiple: checked },
            })
          }
        />
        <span className="text-sm">Олон сонголт зөвшөөрөх</span>
      </div>
    </div>
    <Divider />
  </>
);

const ConstantSumSettings = ({ question, onUpdate }) => (
  <>
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
                  const newAnswers = Array.from(
                    { length: value },
                    (_, i) =>
                      question.answers[i] || {
                        value: `Сонголт ${i + 1}`,
                        score: 0,
                        category: null,
                      }
                  );
                  onUpdate(question.id, {
                    optionCount: value,
                    answers: newAnswers,
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
        onChange={(value) => onUpdate(question.id, { totalPoints: value })}
        className="w-full"
      />
      <div>оноо</div>
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
                    onUpdate(question.id, { minValue: value })
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
                    onUpdate(question.id, { maxValue: value })
                  }
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  </>
);

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

  const processCategories = (value) => {
    const categoryArray = value
      .split(",")
      .map((category) => category.trim())
      .filter(Boolean);

    setCategories(categoryArray);
    onUpdateAssessment({ categories: categoryArray });
  };

  return (
    <div>
      <InfoModal
        open={isModalVisible}
        onOk={() => {
          setCategoryInput("");
          setCategories([]);
          onUpdateAssessment({
            hasAnswerCategory: false,
            categories: [],
          });
          setIsModalVisible(false);
        }}
        onCancel={() => {
          setIsModalVisible(false);
          onUpdateAssessment({ hasAnswerCategory: true });
        }}
        text="Хариултын ангиллууд устгах гэж байна. Итгэлтэй байна уу?"
      />

      <div className="gap-2 flex items-center px-6">
        <Switch
          size="small"
          checked={block.hasQuestion}
          onChange={(checked) => onUpdate(block.id, { hasQuestion: checked })}
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
                    onChange={(checked) =>
                      checked
                        ? onUpdateAssessment({ hasAnswerCategory: true })
                        : setIsModalVisible(true)
                    }
                  />
                  <span>Хариултууд ангилалтай юу?</span>
                </div>
                {assessmentData?.hasAnswerCategory && (
                  <div className="pt-3">
                    <div className="font-bold pb-1 pl-1">Ангиллууд</div>
                    <Form.Item>
                      <Input
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && processCategories(categoryInput)
                        }
                        onBlur={() => processCategories(categoryInput)}
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
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Tools;
