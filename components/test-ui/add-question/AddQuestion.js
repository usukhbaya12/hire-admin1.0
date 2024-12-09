"use client";

import React, { useState } from "react";
import { Button } from "antd";
import { TrashIcon } from "../../Icons";
import QuestionEditor from "./QuestionEditor";
import AnswerOptions from "./AnswerOptions";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const AddQuestion = ({
  question,
  selected,
  onSelect,
  onUpdate,
  onDelete,
  assessmentData,
}) => {
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleQuestionUpdate = (value) => {
    onUpdate({ value });
  };

  const handleAnswersUpdate = (updates) => {
    onUpdate(updates);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-6 border rounded-xl mt-3 mb-1 pb-7 pl-8 pr-8 relative ${
        selected ? "border-main shadow-lg" : "hover:border-bg30"
      } ${isDragging ? "z-50" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="flex justify-between items-start gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ⣿
        </div>

        <QuestionEditor
          initialContent={question.value}
          onUpdate={handleQuestionUpdate}
          orderNumber={question.order}
        />

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
        <AnswerOptions
          question={question}
          onUpdate={handleAnswersUpdate}
          assessmentData={assessmentData}
          editingOptionIndex={editingOptionIndex}
          setEditingOptionIndex={setEditingOptionIndex}
        />
      </div>
    </div>
  );
};

export default AddQuestion;
