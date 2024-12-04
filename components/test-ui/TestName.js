export const TestName = ({
  testName,
  isEditing,
  setIsEditing,
  setTestName,
}) => {
  return (
    <div className="px-1 pb-4">
      {isEditing ? (
        <input
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
          className="font-bold text-xl outline-none underline w-auto"
          size={testName.length + 10}
        />
      ) : (
        <div className="inline-block">
          <span
            className="cursor-pointer font-bold text-xl rounded-md hover:bg-neutral"
            onClick={() => setIsEditing(true)}
          >
            {testName?.trim() || "Тестийн нэр"}
          </span>
        </div>
      )}
    </div>
  );
};
