"use client";

import React, { useState, useEffect } from "react";
import { Block } from "./Block";
import { Tools } from "./Tools";
import { TestName } from "./TestName";

const Questions = ({
  assessmentData,
  onUpdateAssessment,
  blocks,
  setBlocks,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTestName, setLocalTestName] = useState(
    assessmentData?.data.name || ""
  );

  const [selection, setSelection] = useState({
    blockId: blocks[0].id,
    questionId: null,
  });

  const handleSelect = React.useCallback((blockId, questionId) => {
    setSelection({ blockId, questionId });
  }, []);

  const updateBlock = React.useCallback((blockId, updates) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  }, []);

  const updateQuestion = React.useCallback((questionId, updates) => {
    setBlocks((prev) =>
      prev.map((block) => ({
        ...block,
        questions: block.questions.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      }))
    );
  }, []);

  const addBlock = React.useCallback(() => {
    const newBlock = {
      id: `block-${Date.now()}`,
      name: `Блок #${blocks.length + 1}`,
      order: blocks.length + 1,
      value: "",
      image: null,
      hasQuestion: false,
      isExpanded: true,
      questions: [],
      settings: {
        shuffleQuestions: true,
        shuffleAnswers: true,
        hasDuration: false,
        splitQuestions: false,
      },
    };
    setBlocks((prev) => [...prev, newBlock]);
    handleSelect(newBlock.id, null);
  }, [blocks.length, handleSelect]);

  const deleteBlock = React.useCallback(
    (blockId) => {
      setBlocks((prev) => {
        const updatedBlocks = prev.filter((block) => block.id !== blockId);
        const reorderedBlocks = updatedBlocks.map((block, index) => ({
          ...block,
          order: index + 1,
        }));
        if (selection.blockId === blockId) {
          handleSelect(reorderedBlocks[0]?.id || null, null);
        }
        return reorderedBlocks;
      });
    },
    [selection.blockId, handleSelect]
  );

  const addQuestion = React.useCallback(
    (blockId) => {
      const block = blocks.find((b) => b.id === blockId);
      const questionCount = block?.questions.length || 0;

      const newQuestion = {
        id: `question-${Date.now()}`,
        order: questionCount + 1,
        value: "Энд дарж асуултын текстийг өөрчилнө үү.",
        type: "single",
        required: true,
        optionCount: 4,
        totalPoints: 10,
        minValue: 0,
        maxValue: 10,
        answers: Array.from({ length: 4 }, (_, i) => ({
          value: `Сонголт ${i + 1}`,
          image: null,
          score: 0,
          isCorrect: false,
          category: null,
        })),
      };

      setBlocks((prev) => {
        const newBlocks = prev.map((block) =>
          block.id === blockId
            ? { ...block, questions: [...block.questions, newQuestion] }
            : block
        );

        setSelection({ blockId, questionId: newQuestion.id });
        return newBlocks;
      });
    },
    [blocks]
  );

  const deleteQuestion = React.useCallback(
    (blockId, questionId) => {
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === blockId
            ? {
                ...block,
                questions: block.questions
                  .filter((q) => q.id !== questionId)
                  .map((q, index) => ({ ...q, order: index + 1 })),
              }
            : block
        )
      );
      if (selection.questionId === questionId) {
        handleSelect(blockId, null);
      }
    },
    [selection.questionId, handleSelect]
  );

  useEffect(() => {
    if (assessmentData?.data.name) {
      setLocalTestName(assessmentData.data.name);
    }
  }, [assessmentData?.data.name]);

  const onTestNameChange = (newName) => {
    setLocalTestName(newName);
  };

  const [copiedItem, setCopiedItem] = useState(null);

  useEffect(() => {
    const handleKeyboard = (e) => {
      const isInEditor = e.target.closest(".ProseMirror") !== null;

      if (isInEditor) return;

      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      const isCopy = (e.ctrlKey || e.metaKey) && e.key === "c";
      const isPaste = (e.ctrlKey || e.metaKey) && e.key === "v";

      if (isCopy && selection.blockId) {
        e.preventDefault();
        const item = selection.questionId
          ? blocks
              .find((b) => b.id === selection.blockId)
              ?.questions.find((q) => q.id === selection.questionId)
          : blocks.find((b) => b.id === selection.blockId);

        if (item) {
          setCopiedItem({
            type: selection.questionId ? "question" : "block",
            data: JSON.parse(JSON.stringify(item)),
          });
        }
      }

      if (isPaste && copiedItem) {
        e.preventDefault();
        if (copiedItem.type === "question" && selection.blockId) {
          const newQuestion = {
            ...copiedItem.data,
            id: `question-${Date.now()}`,
            order:
              blocks.find((b) => b.id === selection.blockId)?.questions.length +
                1 || 1,
          };

          setBlocks((prev) =>
            prev.map((block) =>
              block.id === selection.blockId
                ? { ...block, questions: [...block.questions, newQuestion] }
                : block
            )
          );
          handleSelect(selection.blockId, newQuestion.id);
        } else if (copiedItem.type === "block") {
          const newBlock = {
            ...copiedItem.data,
            id: `block-${Date.now()}`,
            order: blocks.length + 1,
            name: `${copiedItem.data.name} (Хуулбар)`,
            questions: copiedItem.data.questions.map((q) => ({
              ...q,
              id: `question-${Date.now()}-${q.order}`,
            })),
          };

          setBlocks((prev) => [...prev, newBlock]);
          handleSelect(newBlock.id, null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [blocks, selection, copiedItem, handleSelect]);

  console.log(blocks);

  return (
    <div className="flex mt-[98px]">
      <Tools
        selection={selection}
        blocks={blocks}
        onUpdateBlock={updateBlock}
        onUpdateQuestion={updateQuestion}
        assessmentData={assessmentData}
        onUpdateAssessment={onUpdateAssessment}
      />

      <div className="ml-[20%] w-4/5 p-6 px-11">
        <div className="pb-4">
          <TestName
            testName={localTestName}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setTestName={onTestNameChange}
          />
        </div>
        {blocks.map((block) => (
          <Block
            key={block.id}
            blocksLength={blocks.length}
            block={block}
            selection={selection}
            onSelect={handleSelect}
            onUpdateBlock={updateBlock}
            onDeleteBlock={deleteBlock}
            onAddBlock={addBlock}
            onAddQuestion={addQuestion}
            onDeleteQuestion={deleteQuestion}
            onUpdateQuestion={updateQuestion}
            assessmentData={assessmentData}
          />
        ))}
      </div>
    </div>
  );
};

export default Questions;
