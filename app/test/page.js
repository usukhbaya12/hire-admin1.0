"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button, Spin, message } from "antd";
import { EyeIcon } from "@/components/Icons";
import Questions from "@/components/test-ui/Questions";
import {
  getAssessmentById,
  getAssessmentCategory,
  updateAssessmentById,
} from "../(api)/assessment";
import { useSearchParams, useRouter } from "next/navigation";
import Settings from "@/components/test-ui/Settings";
import { createQuestion, createQuestionCategory } from "../(api)/question";
import { QuestionType } from "@/utils/values";

export default function Home() {
  const [assessmentData, setAssessmentData] = useState(null);
  const [assessmentCategories, setAssessmentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState({});
  const params = useSearchParams();
  const [blocks, setBlocks] = useState([
    {
      id: "block-1",
      name: "Блок #1",
      order: 1,
      value: "",
      image: null,
      hasQuestion: false,
      isExpanded: true,
      questions: [],
      settings: {
        shuffleQuestions: true,
        shuffleAnswers: true,
        splitQuestions: false,
        hasDuration: false,
      },
    },
  ]);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    try {
      const id = params.get("id");
      if (id) {
        await getAssessmentById(id).then((d) => {
          if (d.success) setAssessmentData(d.data);
        });
        await getAssessmentCategory().then((d) => {
          if (d.success) setAssessmentCategories(d.data);
        });
      }
    } catch (error) {
      message.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateAssessment = (updates) => {
    setAssessmentData(updates);

    setChanges((prev) => ({
      ...prev,
      ...updates.data,
    }));
  };

  console.log("test", assessmentData);

  const items = [
    {
      key: "1",
      label: "Асуултууд",
      content: (
        <Questions
          blocks={blocks}
          setBlocks={setBlocks}
          assessmentData={assessmentData}
          onUpdateAssessment={handleUpdateAssessment}
        />
      ),
    },
    {
      key: "2",
      label: "Тохиргоо",
      content: (
        <Settings
          assessmentData={assessmentData}
          assessmentCategories={assessmentCategories}
          onUpdateAssessment={handleUpdateAssessment}
        />
      ),
    },
    {
      key: "3",
      label: "Үр дүн",
      content: "",
    },

    {
      key: "4",
      label: "Тайлан",
      content: "",
    },
  ];

  const [activeKey, setActiveKey] = useState("1");

  const handleTabClick = (key) => {
    setActiveKey(key);
  };

  const publish = async () => {
    try {
      setLoading(true);
      const id = params.get("id");
      
      if (id) {
        await updateAssessmentById(id, changes).then((d) => {
          if (d.success) {
            messageApi.success("Амжилттай хадгаллаа.", [3]);
            fetchData();
            setChanges({});
          } else {
            messageApi.error(d.message || "Хадгалахад алдаа гарлаа.");
          }
        });
        blocks.map(async (block) => {
          await createQuestionCategory().then((d) => {
            block.questions.map(async (question) => {
              await createQuestion({
                category: d.data,
                type: QuestionType.SINGLE,
                question: {
                  name: question.value,
                  minValue: question.minValue,
                  maxValue: question.maxValue,
                  orderNumber: question.order,
                }
              })
            })
          })
        })
      }
    } catch (error) {
      message.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {contextHolder}
      <Spin tip="Уншиж байна..." fullscreen spinning={loading} />
      <div className="fixed w-full top-0 z-10 bg-white">
        <Header />
        <div className="flex border-b pr-6 pl-4 justify-between items-end">
          <div className="flex gap-6">
            <div className="flex gap-6">
              {items.map((item) => (
                <div
                  key={item.key}
                  className={`cursor-pointer p-2 ${
                    item.key === activeKey
                      ? "font-bold text-main border-b-2 border-main"
                      : ""
                  }`}
                  onClick={() => handleTabClick(item.key)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 py-2 items-center">
            <div className="mr-2 flex gap-1 items-center bg-bg20 px-2 py-0.5 rounded-lg text-main">
              <div>Сүүлд шинэчилсэн:</div>
              <div>
                {assessmentData?.data.updatedAt &&
                  (() => {
                    const date = new Date(assessmentData.data.updatedAt);
                    date.setHours(date.getHours() + 8);
                    return `${
                      date
                        .toISOString()
                        .slice(5, 16)
                        .replace("T", " ")
                        .replace("-", "-")
                        .split(" ")[0]
                    }-нд ${date.toISOString().slice(11, 16)}`;
                  })()}
              </div>
            </div>
            <Button className="border-main text-main rounded-xl px-4 login mb-0 font-semibold button-2">
              <EyeIcon />
            </Button>
            <Button
              className="bg-main border-none text-white rounded-xl px-4 login mb-0 font-bold"
              onClick={publish}
            >
              Хадгалах
            </Button>
          </div>
        </div>
      </div>

      <div>
        {items
          .filter((item) => item.key === activeKey)
          .map((item) => (
            <div className="w-full" key={item.key}>
              {item.content}
            </div>
          ))}
      </div>
    </div>
  );
}
