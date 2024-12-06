import React, { useState } from "react";
import { Button } from "antd";
import { TrashIcon } from "../../Icons";
import QuestionEditor from "./QuestionEditor";
import AnswerOptions from "./AnswerOptions";

const AddQuestion = ({
  question,
  selected,
  onSelect,
  onUpdate,
  onDelete,
  assessmentData,
}) => {
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

  const handleQuestionUpdate = (value) => {
    onUpdate({ value });
  };

  const handleAnswersUpdate = (updates) => {
    onUpdate(updates);
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
