import { QUESTION_TYPES } from "@/utils/values";

const generateQuestionDemoValue = (question) => {
  const type = question.type;
  const answers = question.answers || [];

  switch (type) {
    case QUESTION_TYPES.SINGLE: {
      return Math.floor(Math.random() * answers.length);
    }

    case QUESTION_TYPES.MULTIPLE: {
      const count = Math.floor(Math.random() * answers.length) + 1;
      const indices = [];
      while (indices.length < count) {
        const idx = Math.floor(Math.random() * answers.length);
        if (!indices.includes(idx)) indices.push(idx);
      }
      return indices;
    }

    case QUESTION_TYPES.TRUE_FALSE: {
      return Math.floor(Math.random() * 2);
    }

    case QUESTION_TYPES.SLIDERSINGLE: {
      const min = parseInt(question.minValue) || 1;
      const max = parseInt(question.maxValue) || 5;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    case QUESTION_TYPES.SLIDER: {
      const min = parseInt(question.minValue) || 1;
      const max = parseInt(question.maxValue) || 5;
      const values = {};
      answers.forEach((_, index) => {
        values[index] = Math.floor(Math.random() * (max - min + 1)) + min;
      });
      return values;
    }

    case QUESTION_TYPES.MATRIX: {
      const values = {};
      answers.forEach((answer) => {
        values[answer.value] = Math.floor(
          Math.random() * (answer.matrix?.length || 4)
        );
      });
      return values;
    }

    case QUESTION_TYPES.CONSTANT_SUM: {
      // For constant sum, distribute the total points across answers
      // Each answer can be between minValue and maxValue
      // The sum of all answers must equal the question's point value
      const min = parseInt(question.minValue) || 0;
      const max = parseInt(question.maxValue) || 10;
      const totalPoints = parseInt(question.point) || 100;
      const answerCount = answers.length;

      const values = {};
      let remaining = totalPoints;

      // Generate random distribution that respects constraints
      answers.forEach((answer, index) => {
        if (index === answerCount - 1) {
          // Last answer gets whatever is remaining (clamped to min/max)
          values[index] = Math.max(min, Math.min(max, remaining));
        } else {
          // For other answers, pick a random value that:
          // 1. Is between min and max
          // 2. Leaves enough for remaining answers
          const remainingAnswers = answerCount - index - 1;
          const maxPossible = Math.min(
            max,
            remaining - remainingAnswers * min // Leave at least min for each remaining answer
          );
          const minPossible = Math.max(
            min,
            remaining - remainingAnswers * max // Don't leave more than max for remaining answers
          );

          if (maxPossible >= minPossible) {
            const value =
              Math.floor(Math.random() * (maxPossible - minPossible + 1)) +
              minPossible;
            values[index] = value;
            remaining -= value;
          } else {
            // If no valid range, assign min and adjust
            values[index] = min;
            remaining -= min;
          }
        }
      });

      return values;
    }

    case QUESTION_TYPES.TEXT: {
      return "Жишээ хариулт";
    }

    default:
      return null;
  }
};

const calculateQuestionPoints = (question, answerValue) => {
  const type = question.type;
  const answers = question.answers || [];
  const min = parseInt(question.minValue) || 0;
  const max = parseInt(question.maxValue) || 10;

  // Helper function to reverse a value
  const reverseValue = (value, shouldReverse) => {
    if (!shouldReverse) return value;
    return min + max - value;
  };

  switch (type) {
    case QUESTION_TYPES.SINGLE: {
      const selectedAnswer = answers[answerValue];
      return parseFloat(selectedAnswer?.point) || 0;
    }

    case QUESTION_TYPES.MULTIPLE: {
      let total = 0;
      answerValue.forEach((idx) => {
        total += parseFloat(answers[idx]?.point) || 0;
      });
      return total;
    }

    case QUESTION_TYPES.TRUE_FALSE: {
      const selectedAnswer = answers[answerValue];
      return parseFloat(selectedAnswer?.point) || 0;
    }

    case QUESTION_TYPES.SLIDERSINGLE: {
      // Check if the first answer has reverse flag
      const shouldReverse = answers[0]?.reverse || false;
      return reverseValue(answerValue, shouldReverse);
    }

    case QUESTION_TYPES.SLIDER: {
      let total = 0;
      Object.entries(answerValue).forEach(([index, value]) => {
        const answer = answers[parseInt(index)];
        const shouldReverse = answer?.reverse || false;
        const actualValue = reverseValue(value, shouldReverse);
        total += actualValue;
      });
      return total;
    }

    case QUESTION_TYPES.MATRIX: {
      let total = 0;
      answers.forEach((answer) => {
        const colIndex = answerValue[answer.value];
        if (colIndex !== undefined && answer.matrix?.[colIndex]) {
          total += parseFloat(answer.matrix[colIndex].point) || 0;
        }
      });
      return total;
    }

    case QUESTION_TYPES.CONSTANT_SUM: {
      let total = 0;
      Object.values(answerValue).forEach((val) => {
        total += val;
      });
      return total;
    }

    case QUESTION_TYPES.TEXT: {
      return 0;
    }

    default:
      return 0;
  }
};

export const generateDemoData = (
  assessmentQuestions,
  answerCategories = []
) => {
  if (!assessmentQuestions || !Array.isArray(assessmentQuestions)) return null;

  const demoData = {
    byBlock: {},
    byQuestion: [],
    byAnswerCategory: {},
    allAnswers: {},
  };

  // Initialize answer category groups if they exist
  if (answerCategories && answerCategories.length > 0) {
    answerCategories.forEach((cat) => {
      demoData.byAnswerCategory[cat.name] = {
        points: [],
        count: 0,
        questions: [],
      };
    });
  }

  assessmentQuestions.forEach((blockData) => {
    const blockName =
      blockData.category?.name ||
      `Блок ${blockData.category?.orderNumber || 1}`;
    const questions = blockData.questions || [];

    demoData.byBlock[blockName] = {
      answers: [],
      totalPoints: 0,
      categories: {},
    };

    questions.forEach((question) => {
      const answerValue = generateQuestionDemoValue(question);
      const points = calculateQuestionPoints(question, answerValue);

      // Store answer
      demoData.allAnswers[question.id] = answerValue;

      const questionResult = {
        questionId: question.id,
        questionText: question.name || "Асуулт",
        questionType: question.type,
        answerValue,
        points,
        blockName,
        blockId: blockData.category?.id,
      };

      // Add to block data
      demoData.byBlock[blockName].answers.push(questionResult);
      demoData.byBlock[blockName].totalPoints += points;

      // For SLIDER and CONSTANT_SUM types, distribute points to answer categories
      const type = question.type;
      const answers = question.answers || [];
      const min = parseInt(question.minValue) || 0;
      const max = parseInt(question.maxValue) || 10;

      // Helper function to reverse a value
      const reverseValue = (value, shouldReverse) => {
        if (!shouldReverse) return value;
        return min + max - value;
      };

      if (type === QUESTION_TYPES.SLIDER) {
        // answerValue is like { 0: 3, 1: 4, 2: 2, ... }
        // Each index corresponds to an answer with a category
        Object.entries(answerValue).forEach(([index, value]) => {
          const answer = answers[parseInt(index)];
          const categoryName = answer?.category?.name;
          const shouldReverse = answer?.reverse || false;
          const actualValue = reverseValue(value, shouldReverse);

          if (categoryName && demoData.byAnswerCategory[categoryName]) {
            demoData.byAnswerCategory[categoryName].points.push(actualValue);
            demoData.byAnswerCategory[categoryName].count++;
          }
        });
      } else if (type === QUESTION_TYPES.CONSTANT_SUM) {
        // answerValue is like { 0: 3, 1: 2, 2: 1, ... }
        // Each index corresponds to an answer with a category
        Object.entries(answerValue).forEach(([index, value]) => {
          const answer = answers[parseInt(index)];
          const categoryName = answer?.category?.name;

          if (categoryName && demoData.byAnswerCategory[categoryName]) {
            demoData.byAnswerCategory[categoryName].points.push(value);
            demoData.byAnswerCategory[categoryName].count++;
          }
        });
      } else if (
        type === QUESTION_TYPES.SINGLE ||
        type === QUESTION_TYPES.TRUE_FALSE
      ) {
        // answerValue is an index like 2
        const answer = answers[answerValue];
        const categoryName = answer?.category?.name;

        if (categoryName && demoData.byAnswerCategory[categoryName]) {
          demoData.byAnswerCategory[categoryName].points.push(points);
          demoData.byAnswerCategory[categoryName].count++;
        }
      } else if (type === QUESTION_TYPES.MULTIPLE) {
        // answerValue is an array of indices like [0, 2, 3]
        answerValue.forEach((index) => {
          const answer = answers[index];
          const categoryName = answer?.category?.name;
          const answerPoints = parseFloat(answer?.point) || 0;

          if (categoryName && demoData.byAnswerCategory[categoryName]) {
            demoData.byAnswerCategory[categoryName].points.push(answerPoints);
            demoData.byAnswerCategory[categoryName].count++;
          }
        });
      } else if (type === QUESTION_TYPES.SLIDERSINGLE) {
        // answerValue is a single value
        const answer = answers[0];
        const categoryName = answer?.category?.name;
        const shouldReverse = answer?.reverse || false;
        const actualValue = reverseValue(answerValue, shouldReverse);

        if (categoryName && demoData.byAnswerCategory[categoryName]) {
          demoData.byAnswerCategory[categoryName].points.push(actualValue);
          demoData.byAnswerCategory[categoryName].count++;
        }
      }

      demoData.byQuestion.push(questionResult);
    });
  });

  return demoData;
};

export const formatDemoResults = (
  demoData,
  groupByEnabled,
  aggregations = [],
  sortEnabled = false,
  sortValue = "false",
  limitEnabled = false,
  limitValue = null,
  assessmentQuestions = []
) => {
  if (!demoData) return null;

  const results = {
    raw: [],
    grouped: {},
    aggregated: {},
  };

  // Determine grouping type
  const groupingType = groupByEnabled?.[0] || "none";

  // Group data based on type
  if (groupingType === "questionCategoryId") {
    // Group by block/question category
    // For avg calculation, we need ALL individual answer values, not just question totals
    Object.entries(demoData.byBlock).forEach(([blockName, blockData]) => {
      const allAnswerValues = [];

      // Extract all individual answer values from all questions in this block
      blockData.answers.forEach((questionResult) => {
        const answerValue = questionResult.answerValue;
        const question = assessmentQuestions
          ?.flatMap((b) => b.questions)
          ?.find((q) => q.id === questionResult.questionId);
        const answers = question?.answers || [];
        const min = parseInt(question?.minValue) || 0;
        const max = parseInt(question?.maxValue) || 10;

        // Helper to reverse value
        const reverseValue = (value, shouldReverse) => {
          if (!shouldReverse) return value;
          return min + max - value;
        };

        // Extract individual values based on question type
        if (typeof answerValue === "object" && !Array.isArray(answerValue)) {
          // SLIDER or CONSTANT_SUM: each value is separate
          Object.entries(answerValue).forEach(([idx, value]) => {
            const answer = answers[parseInt(idx)];
            const shouldReverse = answer?.reverse || false;
            const actualValue = reverseValue(value, shouldReverse);
            allAnswerValues.push(actualValue);
          });
        } else if (Array.isArray(answerValue)) {
          // MULTIPLE: count selected answers
          answerValue.forEach((idx) => {
            const answerPoints = parseFloat(answers[idx]?.point) || 0;
            allAnswerValues.push(answerPoints);
          });
        } else {
          // SINGLE, SLIDERSINGLE, TRUE_FALSE: single value
          allAnswerValues.push(questionResult.points);
        }
      });

      results.grouped[blockName] = {
        points: allAnswerValues,
        count: allAnswerValues.length, // Number of individual answers
        questionCount: blockData.answers.length, // Number of questions
        questions: blockData.answers,
      };
    });
  } else if (groupingType === "answerCategoryId") {
    // Group by answer category
    Object.entries(demoData.byAnswerCategory).forEach(
      ([categoryName, categoryData]) => {
        if (categoryData.count > 0) {
          results.grouped[categoryName] = {
            points: categoryData.points,
            count: categoryData.count,
            questions: categoryData.questions,
          };
        }
      }
    );
  } else {
    // No grouping - aggregate all questions together
    const allPoints = demoData.byQuestion.map((q) => q.points);
    results.grouped["Нийт"] = {
      points: allPoints,
      count: allPoints.length,
      questions: demoData.byQuestion,
    };
  }

  // Apply aggregations
  aggregations.forEach((agg) => {
    const operation = agg.operation?.toLowerCase();

    if (!results.aggregated[operation]) {
      results.aggregated[operation] = {};
    }

    Object.entries(results.grouped).forEach(([groupName, groupData]) => {
      switch (operation) {
        case "sum":
          results.aggregated[operation][groupName] = groupData.points.reduce(
            (a, b) => a + b,
            0
          );
          break;
        case "avg":
          const sum = groupData.points.reduce((a, b) => a + b, 0);
          results.aggregated[operation][groupName] = parseFloat(
            (sum / groupData.points.length).toFixed(2)
          );
          break;
        case "count":
          results.aggregated[operation][groupName] = groupData.count;
          break;
        default:
          break;
      }
    });
  });

  // Apply sorting and limiting to aggregated results
  if (sortEnabled || (limitEnabled && limitValue)) {
    aggregations.forEach((agg) => {
      const operation = agg.operation?.toLowerCase();

      if (results.aggregated[operation]) {
        // Convert to array for sorting
        let entries = Object.entries(results.aggregated[operation]);

        // Sort if enabled
        if (sortEnabled) {
          entries.sort((a, b) => {
            const valueA = parseFloat(a[1]);
            const valueB = parseFloat(b[1]);

            if (sortValue === "true") {
              // Ascending order (өсөхөөр)
              return valueA - valueB;
            } else {
              // Descending order (буурахаар)
              return valueB - valueA;
            }
          });
        }

        // Apply limit if enabled
        if (limitEnabled && limitValue) {
          entries = entries.slice(0, parseInt(limitValue));
        }

        // Convert back to object
        results.aggregated[operation] = Object.fromEntries(entries);
      }
    });
  }

  return results;
};

export default {
  generateDemoData,
  formatDemoResults,
  generateQuestionDemoValue,
  calculateQuestionPoints,
  QUESTION_TYPES,
};
