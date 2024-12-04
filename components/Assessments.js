"use client";

import React, { useState } from "react";
import { Input, Select, Button } from "antd";
import { SearchIcon, GlobeIcon, DropdownIcon, PlusIcon } from "./Icons";
import { useRouter } from "next/navigation";
import NewAssessment from "./NewAssessment";

const Assessments = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (formData) => {
    localStorage.removeItem("assessmentData");

    localStorage.setItem("assessmentData", JSON.stringify(formData));
    router.push("/test");
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
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default Assessments;
