"use client";

import React, { useEffect, useState } from "react";
import { Input, Select, Button } from "antd";
import { SearchIcon, GlobeIcon, DropdownIcon, PlusIcon } from "./Icons";
import { useRouter } from "next/navigation";
import NewAssessment from "./NewAssessment";
import {
  createAssessment,
  getAssessmentCategory,
} from "@/app/(api)/assessment";
import { AssessmentType } from "@/utils/values";

const Assessments = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const getConstant = async () => {
    await getAssessmentCategory().then((d) => {
      if (d.success) setCategory(d.data);
    });
  };
  useEffect(() => {
    getConstant();
  }, []);
  const handleOk = async (formData) => {
    localStorage.removeItem("assessmentData");

    localStorage.setItem("assessmentData", JSON.stringify(formData));
    console.log(formData);
    await createAssessment({
      category: formData.assessmentCategory,
      name: formData.testName,
      description: "",
      usage: "",
      measure: "",
      questionCount: 0,
      price: 0,
      duration: 0,
      type: AssessmentType.UNELGEE,
    }).then((d) => {
      if (d.success) {
        router.push(`/test?id=${d.data}`);
      }
    });
    // router.push("/test");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    localStorage.removeItem("assessmentData");
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div>
            <Select
              prefix={<GlobeIcon width={19} height={19} />}
              placeholder="Төрлөөр хайх"
              options={category.map((c) => ({ label: c.name, value: c.id }))}
              suffixIcon={<DropdownIcon width={15} height={15} />}
            />
          </div>
          <div>
            <Input
              className="home"
              prefix={<SearchIcon />}
              placeholder="Хайх"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            onClick={showModal}
            className="bg-main border-none text-white rounded-xl px-4 login mb-0 font-bold"
          >
            <PlusIcon width={18} />
            Тест үүсгэх
          </Button>
        </div>
      </div>

      <NewAssessment
        assessmentCategories={category}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default Assessments;
