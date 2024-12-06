"use client";

import React, { useState, useEffect } from "react";
import { TestName } from "../TestName";
import { Divider, Input, InputNumber, Select, Radio } from "antd";
import { DropdownIcon, PenIcon } from "@/components/Icons";

const { TextArea } = Input;

const Settings = ({
  assessmentData,
  onUpdateAssessment,
  assessmentCategories,
}) => {
  const [testName, setTestName] = useState(assessmentData.testName ?? "");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mt-[98px]">
      <div className="flex">
        <div className="px-5 pt-5 border-r border-bg30 w-2/5">
          <TestName
            testName={assessmentData?.testName}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setTestName={setTestName}
          />
        </div>
        <div className="px-12 pt-4 font-bold text-base">Тестийн тойм</div>
      </div>
      <div className="flex">
        <div className="border-r w-1/5">
          <Divider className="clps" />
          <div className="flex flex-col pt-1 pb-1 px-5">
            <div className="pb-2 pl-1 font-semibold">Тестийн ангилал</div>
            <Select
              placeholder="Тестийн ангилал"
              options={assessmentCategories
                .filter((category) => category.parent == null)
                .map((category) => {
                  return {
                    label: category.name,
                    value: category.id,
                  };
                })}
              defaultValue={assessmentData.assessmentCategory}
              suffixIcon={<DropdownIcon width={15} height={15} />}
              className="mb-4"
            />
            <Select
              options={assessmentCategories
                .filter((category) => category.parent != null)
                .map((category) => {
                  return {
                    label: category.name,
                    value: category.id,
                  };
                })}
              placeholder="Дэд ангилал"
              suffixIcon={<DropdownIcon width={15} height={15} />}
            />
          </div>
          <Divider />
          <div className="gap-4 px-5 pl-6">
            <div className="font-semibold pb-2">Төрөл</div>
            <Radio.Group
              value={false}
              //onChange={(e) => setIsAssessment(e.target.value)}
            >
              <Radio value={false}>Үнэлгээ</Radio>
              <Radio value={true}>Зөв хариулттай тест</Radio>
            </Radio.Group>
          </div>
          <Divider />
          <div className="px-5 py-1">
            <div className="font-semibold pb-2 pl-1">Тестийн үнэ</div>

            <InputNumber placeholder="Тестийн үнэ" addonAfter="₮" />
          </div>
          <Divider />
          <div className="px-5 pb-1">
            <div className="pb-2 font-semibold">Тайлбар</div>
            <TextArea rows={8} />
          </div>
        </div>
        <div className="pb-[85px] border-r border-bg30 w-1/5">
          <Divider className="clps" />
          <div className="flex flex-col py-1 px-5">
            <div className="pb-2 pl-1 font-semibold">Түвшин</div>
            <Select
              placeholder="Түвшин"
              suffixIcon={<DropdownIcon width={15} height={15} />}
            />
          </div>
          <Divider />
          <div className="pb-2 pl-6 pr-5 font-semibold">Тест зохиогч</div>
          <div className="px-5 flex">
            <Input prefix={<PenIcon width={15} height={15} />} />
          </div>
          <Divider />
          <div className="px-5 pb-1">
            <div className="pb-2 font-semibold">Хэмжих зүйлс</div>
            <TextArea rows={4} />
          </div>
          <Divider />
          <div className="px-5 pb-1">
            <div className="pb-2 font-semibold">Хэрэглээ</div>
            <TextArea rows={6} />
          </div>
        </div>
        <div className="px-11">
          <div className="p-5 rounded-3xl w-[120px] h-[120px] flex flex-col items-center justify-center bg-neutral">
            <div className="">Блок</div>
            <div className="text-4xl font-black">2</div>
          </div>
          <div className="p-5 mt-5 rounded-3xl w-[120px] h-[120px] flex flex-col items-center justify-center bg-gradient-to-b from-main to-bg30">
            <div className="text-white leading-4 text-center">Нийт асуулт</div>
            <div className="text-4xl font-black text-white">47</div>
          </div>
          <div className="p-5 mt-5 rounded-3xl w-[120px] h-[120px] flex flex-col items-center justify-center bg-gradient-to-b from-main to-bg30">
            <div className="text-white leading-4 text-center">Авах асуулт</div>
            <div className="text-4xl font-black text-white">20</div>
          </div>
          <div className="p-5 mt-5 rounded-3xl w-[120px] h-[120px] flex flex-col items-center justify-center bg-gradient-to-b from-main to-bg30">
            <div className="text-white leading-4 text-center">Нийт хугацаа</div>
            <div className="text-4xl font-black text-white">15:00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
