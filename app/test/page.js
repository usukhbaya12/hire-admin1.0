"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button, Spin } from "antd";
import { EyeIcon } from "@/components/Icons";
import Questions from "@/components/test-ui/Questions";
import { getAssessmentById, getAssessmentCategory } from "../(api)/assessment";
import { useSearchParams, useRouter } from "next/navigation";
import Settings from "@/components/test-ui/Settings";

export default function Home() {
  const [assessmentData, setAssessmentData] = useState(null);
  const [assessmentCategories, setAssessmentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  const router = useRouter();

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
    setAssessmentData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  console.log("test", assessmentData);

  const items = [
    {
      key: "1",
      label: "Асуултууд",
      content: (
        <Questions
          assessmentData={assessmentData}
          onUpdateAssessment={handleUpdateAssessment}
        />
      ),
    },
    {
      key: "2",
      label: "Тохиргоо",
      content: <Settings assessmentData={assessmentData} />,
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
    console.log("asdf");
    ъ;
  };

  return (
    <div className="flex flex-col h-screen">
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
                {assessmentData?.updatedAt &&
                  `${
                    new Date(assessmentData.updatedAt)
                      .toISOString()
                      .slice(5, 16)
                      .replace("T", " ")
                      .replace("-", "-")
                      .split(" ")[0]
                  }-нд ${new Date(assessmentData.updatedAt)
                    .toISOString()
                    .slice(11, 16)}`}
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
