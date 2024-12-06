"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "antd";
import { EyeIcon } from "@/components/Icons";
import Questions from "@/components/test-ui/Questions";
import Settings from "@/components/test-ui/settings/Settings";
import {
  getAssessmentCategory,
  getAssessmentCategoryById,
} from "../(api)/assessment";

export default function Home() {
  const [assessmentData, setAssessmentData] = useState(null);
  const [assessmentCategories, setAssessmentCategories] = useState([]);

  const [assessment, setAssessment] = useState({
    name: "",
    description: null,
    measure: null,
    usage: null,
    duration: 0,
    price: 0,
    function: null,
    advice: null,
    author: null,
    type: null,
    questionShuffle: false,
    answerShuffle: false,
    questionCount: 0,
    level: null,
    category: null,
    icons: null,
    categories: [],
  });
  const [questions, setQuestions] = useState([
    {
      category: null,
      type: null,
      question: {
        name: null,
        minValue: null,
        maxValue: null,
        orderNumber: null,
      },
      answers: [
        {
          answer: [
            {
              value: {
                value: null,
                point: null,
                orderNumber: null,
              },
              matrix: [
                {
                  valie: null,
                  category: null,
                  orderNumber: null,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  const getCategories = async () => {
    await getAssessmentCategory().then((d) => {
      if (d.success) setAssessmentCategories(d.data);
    });
  };
  useEffect(() => {
    const data = localStorage.getItem("assessmentData");
    if (data) {
      setAssessmentData(JSON.parse(data));
      setAssessment((prev) => ({
        ...prev,
        name: data.testName,
        category: data.assessmentCategory,
        categories: data.categories.map((category) => {
          return { name: category, description: "" };
        }),
      }));
    }
    getCategories();
  }, []);

  const handleUpdateAssessment = (updates) => {
    setAssessmentData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  console.log("hihi", assessmentData);

  const items = [
    {
      key: "1",
      label: "Асуултууд",
      content: (
        <Questions
          questions={questions}
          assessment={assessment}
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
          assessment={assessment}
          quesitons={questions}
          assessmentData={assessmentData}
          assessmentCategories={assessmentCategories}
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
    console.log(first);
    console.log("asdf");
    console.log(assessment);
  };

  return (
    <div className="flex flex-col h-screen">
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

          <div className="flex gap-2 py-2">
            <Button className="border-main text-main rounded-xl px-4 login mb-0 font-semibold button-2">
              <EyeIcon />
            </Button>
            <Button
              className="bg-main border-none text-white rounded-xl px-4 login mb-0 font-bold"
              onClick={publish}
            >
              Нийтлэх
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
