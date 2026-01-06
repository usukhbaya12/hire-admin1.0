import React, { useMemo } from "react";
import { Card, Divider } from "antd";
import { generateDemoData, formatDemoResults } from "./Demo";

const FormulaExample = ({
  assessmentData,
  groupByEnabled,
  aggregations,
  filters,
  limitEnabled,
  limitValue,
  sortEnabled,
  sortValue,
  assessmentQuestions,
  orderEnabled,
  orderValue,
}) => {
  const demoData = useMemo(() => {
    const answerCategories = assessmentData?.data?.answerCategories || [];
    return generateDemoData(assessmentQuestions, answerCategories);
  }, [assessmentQuestions, assessmentData?.data?.answerCategories]);

  const formattedResults = useMemo(() => {
    if (!demoData) return null;
    return formatDemoResults(
      demoData,
      groupByEnabled,
      aggregations,
      sortEnabled,
      sortValue,
      limitEnabled,
      limitValue,
      assessmentQuestions
    );
  }, [
    demoData,
    groupByEnabled,
    aggregations,
    sortEnabled,
    sortValue,
    limitEnabled,
    limitValue,
    assessmentQuestions,
  ]);

  const calculateExample = () => {
    if (!demoData || !formattedResults) {
      return <div>Жишээ үүсгэх боломжгүй байна.</div>;
    }

    const groupingType = groupByEnabled?.[0] || "none";

    return (
      <div>
        <div>
          {Object.entries(demoData.byBlock).map(
            ([blockName, blockData], index) => {
              const question = assessmentQuestions.find(
                (b) => b.category?.name === blockName
              )?.questions?.[0];
              const answers = question?.answers || [];
              const hasAnswerCategories =
                assessmentData?.data?.answerCategories?.length > 0;

              return (
                <div key={index} className="mb-3">
                  <div className="mb-1 font-medium">{blockName}:</div>
                  <div className="flex flex-wrap gap-2 ml-4">
                    {blockData.answers.map((ans, qIndex) => {
                      const answerValue = ans.answerValue;

                      if (
                        typeof answerValue === "object" &&
                        !Array.isArray(answerValue)
                      ) {
                        return Object.entries(answerValue).map(
                          ([idx, value]) => {
                            const answer = answers[parseInt(idx)];
                            const hasReverse = answer?.reverse || false;
                            const categoryName = answer?.category?.name;
                            const categoryInitials = categoryName
                              ? categoryName.substring(0, 2)
                              : null;

                            return (
                              <div
                                key={`${qIndex}-${idx}`}
                                className="inline-flex items-center gap-1"
                              >
                                {hasAnswerCategories && categoryInitials && (
                                  <>
                                    <span className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-semibold text-blue-800">
                                      <span className="font-bold text-main">
                                        {value}
                                      </span>
                                      {categoryInitials}
                                    </span>
                                  </>
                                )}

                                {hasReverse && (
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-orange-600"
                                  >
                                    <path
                                      d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </div>
                            );
                          }
                        );
                      } else if (Array.isArray(answerValue)) {
                        return (
                          <span key={qIndex} className="font-bold text-main">
                            {answerValue.map((v) => v + 1).join(", ")}
                          </span>
                        );
                      } else {
                        const answer = answers[0];
                        const hasReverse = answer?.reverse || false;
                        const categoryName = answer?.category?.name;
                        const categoryInitials = categoryName
                          ? categoryName.substring(0, 2).toUpperCase()
                          : null;

                        return (
                          <div
                            key={qIndex}
                            className="inline-flex items-center gap-1"
                          >
                            {hasAnswerCategories && categoryInitials && (
                              <span className="bg-blue-100 px-1.5 py-0.5 rounded text-xs font-semibold text-blue-800">
                                {categoryInitials}
                              </span>
                            )}
                            <span className="font-bold text-main">
                              {ans.points}
                            </span>
                            {hasReverse && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-orange-600"
                              >
                                <path
                                  d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>

        <Divider className="my-4" />

        {/* Results Section - Simplified based on grouping */}
        <div>
          <div className="font-semibold mb-3">
            📁 Үр дүн
            {(sortEnabled || (limitEnabled && limitValue)) && (
              <span className="text-xs font-normal text-gray-500 ml-2">
                {limitEnabled && limitValue && `(Эхний ${limitValue})`}
                {limitEnabled && limitValue && sortEnabled && " • "}
                {sortEnabled &&
                  (sortValue === "true" ? "Өсөхөөр" : "Буурахаар")}
              </span>
            )}
          </div>

          {aggregations.length > 0 ? (
            <div className="ml-4">
              {aggregations.map((agg, aggIndex) => {
                const operation = agg.operation?.toLowerCase();
                let operationLabel = "";

                switch (operation) {
                  case "sum":
                    operationLabel = "Нийлбэр";
                    break;
                  case "avg":
                    operationLabel = "Дундаж";
                    break;
                  case "count":
                    operationLabel = "Тоо";
                    break;
                  default:
                    operationLabel = operation;
                }

                return (
                  <div key={aggIndex} className="mb-4">
                    <div className="font-medium mb-2 text-gray-700">
                      {operationLabel}:
                    </div>
                    <div className="ml-4 space-y-1">
                      {formattedResults.aggregated[operation] &&
                        Object.entries(
                          formattedResults.aggregated[operation]
                        ).map(([groupName, value], index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-gray-600">{groupName}:</span>
                            <span className="font-bold text-main">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ml-4 text-gray-500 text-sm">
              Тооцоолол сонгоогүй байна
            </div>
          )}
        </div>

        {/* Additional sections only if enabled */}
        {filters.length > 0 && filters[0]?.field && (
          <>
            <Divider className="my-4" />
            <div>
              <div className="font-semibold mb-2">🔍 ШҮҮЛТҮҮР:</div>
              <div className="ml-4 text-sm space-y-1">
                {filters.map((filter, index) => (
                  <div key={index}>
                    <span className="text-gray-600">Талбар:</span>{" "}
                    {filter.field}
                    {" | "}
                    <span className="text-gray-600">Утга:</span>{" "}
                    {filter.value?.toString()}
                  </div>
                ))}
              </div>
              <div className="text-gray-500 text-xs mt-2 ml-4">
                (Шүүлтүүр нь зөвхөн зөв хариулттай төрлийн тестэд хамаарна)
              </div>
            </div>
          </>
        )}

        {orderEnabled && orderValue && (
          <>
            <Divider className="my-4" />
            <div>
              <div className="font-semibold mb-1">🔢 ДАРААЛАЛ:</div>
              <div className="ml-4 text-sm">{orderValue}</div>
            </div>
          </>
        )}
      </div>
    );
  };

  const calculateTestExample = () => {
    if (!demoData) return <div>Жишээ үүсгэх боломжгүй байна.</div>;

    return (
      <div className="space-y-4">
        <div>
          <div className="font-semibold mb-2">📝 ТЕСТИЙН ЖИШЭЭ ӨГӨГДӨЛ:</div>
          <div className="ml-4 text-sm space-y-1">
            {demoData.byQuestion.map((q, index) => {
              const correctness = q.answerValue !== undefined ? "зөв" : "буруу";
              return (
                <div key={index}>
                  Асуулт {index + 1}: {q.points} оноо ({correctness})
                </div>
              );
            })}
          </div>
        </div>

        <Divider className="my-4" />

        <div>
          <div className="font-semibold mb-3">
            📁 Үр дүн
            {(sortEnabled || (limitEnabled && limitValue)) && (
              <span className="text-xs font-normal text-gray-500 ml-2">
                {limitEnabled && limitValue && `(Эхний ${limitValue})`}
                {limitEnabled && limitValue && sortEnabled && " • "}
                {sortEnabled &&
                  (sortValue === "true" ? "Өсөхөөр" : "Буурахаар")}
              </span>
            )}
          </div>

          {aggregations.length > 0 && formattedResults?.aggregated ? (
            <div className="ml-4">
              {aggregations.map((agg, aggIndex) => {
                const operation = agg.operation?.toLowerCase();
                const label =
                  operation === "sum"
                    ? "Нийлбэр"
                    : operation === "avg"
                    ? "Дундаж"
                    : operation === "count"
                    ? "Тоо"
                    : operation;

                return (
                  <div key={aggIndex} className="mb-4">
                    <div className="font-medium mb-2 text-gray-700">
                      {label}:
                    </div>
                    <div className="ml-4 space-y-1">
                      {formattedResults.aggregated[operation] &&
                        Object.entries(
                          formattedResults.aggregated[operation]
                        ).map(([group, value], index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-gray-600">{group}:</span>
                            <span className="font-bold text-main">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ml-4 text-gray-500 text-sm">
              Тооцоолол сонгоогүй байна
            </div>
          )}
        </div>
      </div>
    );
  };

  const exampleContent =
    assessmentData?.data?.type === 10
      ? calculateTestExample()
      : calculateExample();

  return (
    <Card
      title={
        <div className="justify-between items-center flex">
          <div>Демо өгөгдөл</div>
          <div className="text-sm font-normal text-gray-500">
            {demoData?.byQuestion?.length || 0} асуулт
          </div>
        </div>
      }
      className="text-sm"
    >
      {exampleContent}
    </Card>
  );
};

export default FormulaExample;
