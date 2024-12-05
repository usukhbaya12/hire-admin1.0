import React from "react";

export const TestName = ({
  testName: initialTestName,
  isEditing,
  setIsEditing,
  setTestName,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setTestName(e.target.value);
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="pb-4 px-1">
      {isEditing ? (
        <input
          value={initialTestName}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="font-bold text-xl outline-none underline w-full"
        />
      ) : (
        <div className="inline-block">
          <span
            className="cursor-pointer font-bold text-xl rounded-md hover:bg-neutral"
            onClick={handleClick}
          >
            {initialTestName?.trim() || "Тестийн нэр"}
          </span>
        </div>
      )}
    </div>
  );
};
