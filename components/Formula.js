import React from "react";
import { Card } from "antd";

const FormulaExample = ({
  assessmentData,
  groupByEnabled,
  aggregations,
  filters,
  limitEnabled,
  limitValue,
  sortEnabled,
  sortValue,
}) => {
  const surveyData = {
    A: [1, 0, 6, 4],
    B: [2, 0, 0, 0],
    C: [7, 10, 4, 6],
  };

  const testData = [
    { question: 1, point: 0, category: "A", correct: false },
    { question: 2, point: 1, category: "B", correct: false },
    { question: 3, point: 4, category: "A", correct: true },
  ];

  const calculateExample = () => {
    if (!assessmentData?.data?.type) return null;

    if (assessmentData.data.type === 20) {
      // Handle survey type
      let result = "";

      // Show raw data first
      result = "Өгөгдөл:\n";
      Object.entries(surveyData).forEach(([category, points]) => {
        result += `${category} - ${points.join(", ")}\n`;
      });

      // Group by handling
      if (groupByEnabled) {
        result += "\nБүлэглэсэн:\n";
        Object.entries(surveyData).forEach(([category, points]) => {
          result += `${category} - ${points.join(", ")}\n`;
        });
      }

      // Handle aggregations
      if (aggregations.length > 0) {
        result += "\nТооцоолол:\n";
        aggregations.forEach((agg) => {
          if (agg.operation === "sum") {
            const sums = Object.entries(surveyData).map(
              ([category, points]) => ({
                category,
                value: points.reduce((a, b) => a + b, 0),
              })
            );
            result += `Нийлбэр: ${sums
              .map((s) => `${s.category}=${s.value}`)
              .join(", ")}\n`;
          } else if (agg.operation === "avg") {
            const avgs = Object.entries(surveyData).map(
              ([category, points]) => ({
                category,
                value: (
                  points.reduce((a, b) => a + b, 0) / points.length
                ).toFixed(1),
              })
            );
            result += `Дундаж: ${avgs
              .map((a) => `${a.category}=${a.value}`)
              .join(", ")}\n`;
          } else if (agg.operation === "count") {
            const counts = Object.entries(surveyData).map(
              ([category, points]) => ({
                category,
                value: points.length,
              })
            );
            result += `Тоо: ${counts
              .map((c) => `${c.category}=${c.value}`)
              .join(", ")}\n`;
          }
        });
      }

      if (limitEnabled && limitValue) {
        const sums = Object.entries(surveyData)
          .map(([category, points]) => ({
            category,
            value: points.reduce((a, b) => a + b, 0),
          }))
          .slice(0, limitValue);
        result += `\nЭхний ${limitValue}:\n${sums
          .map((s) => `${s.category}=${s.value}`)
          .join(", ")}\n`;
      }

      if (sortEnabled) {
        const sums = Object.entries(surveyData)
          .map(([category, points]) => ({
            category,
            value: points.reduce((a, b) => a + b, 0),
          }))
          .sort((a, b) =>
            sortValue === "true" ? a.value - b.value : b.value - a.value
          );
        result += `\nЭрэмбэлсэн:\n${sums
          .map((s) => `${s.category}=${s.value}`)
          .join(", ")}\n`;
      }

      return result;
    } else if (assessmentData.data.type === 10) {
      let result = "";

      result = "Өгөгдөл:\n";
      testData.forEach((item) => {
        result += `${item.question}-${item.point}-${item.category}(${
          item.correct ? "зөв" : "буруу"
        })\n`;
      });

      if (
        assessmentData?.data?.answerCategories?.length > 0 &&
        groupByEnabled
      ) {
        result += "\nБүлэглэсэн:\n";
        const grouped = testData.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item.point);
          return acc;
        }, {});
        Object.entries(grouped).forEach(([category, points]) => {
          result += `${category}-${points.join(",")}\n`;
        });
      }

      if (aggregations.length > 0) {
        result += "\nТооцоолол:\n";
        let filteredData = testData;
        if (filters.length > 0 && filters[0]?.field === "correct") {
          filteredData = testData.filter(
            (item) => item.correct === filters[0].value
          );
        }

        aggregations.forEach((agg) => {
          if (agg.operation === "sum") {
            const sums = Object.entries(
              filteredData.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = 0;
                acc[item.category] += item.point;
                return acc;
              }, {})
            );
            result += `Нийлбэр: ${sums
              .map(([cat, sum]) => `${cat}-${sum}`)
              .join(", ")}\n`;
          } else if (agg.operation === "avg") {
            const avgs = Object.entries(
              filteredData.reduce((acc, item) => {
                if (!acc[item.category])
                  acc[item.category] = { sum: 0, count: 0 };
                acc[item.category].sum += item.point;
                acc[item.category].count++;
                return acc;
              }, {})
            ).map(([cat, { sum, count }]) => [cat, (sum / count).toFixed(1)]);
            result += `Дундаж: ${avgs
              .map(([cat, avg]) => `${cat}-${avg}`)
              .join(", ")}\n`;
          } else if (agg.operation === "count") {
            const counts = Object.entries(
              filteredData.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = 0;
                acc[item.category]++;
                return acc;
              }, {})
            );
            result += `Тоо: ${counts
              .map(([cat, count]) => `${cat}-${count}`)
              .join(", ")}\n`;
          }
        });
      }

      return result;
    }

    return "Жишээ";
  };

  return (
    <Card title="Жишээ" className="whitespace-pre-wrap">
      {calculateExample()}
    </Card>
  );
};

export default FormulaExample;
