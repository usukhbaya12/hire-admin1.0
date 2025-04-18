import React from "react";
import AddQuestion from "./AddQuestion";

export const Question = ({
  question,
  blockId,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  assessmentData,
  onCopy,
}) => {
  return (
    <div className="relative">
      <AddQuestion
        question={question}
        selected={isSelected}
        onSelect={() => onSelect(blockId, question.id)}
        onUpdate={onUpdate}
        onDelete={onDelete}
        assessmentData={assessmentData}
        onCopy={onCopy}
      />
    </div>
  );
};
