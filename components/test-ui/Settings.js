"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Divider,
  InputNumber,
  Collapse,
  Switch,
} from "antd";
import { DropdownIcon, SettingsIcon } from "../Icons";
import { TestName } from "./TestName";

const { TextArea } = Input;

const Settings = ({ assessmentData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTestName, setLocalTestName] = useState(
    assessmentData?.name || ""
  );
  const [selected, setSelected] = useState("general");

  useEffect(() => {
    if (assessmentData?.name) {
      setLocalTestName(assessmentData.name);
    }
  }, [assessmentData?.name]);

  const onTestNameChange = (newName) => {
    setLocalTestName(newName);
  };

  return (
    <div className="mt-[98px]">
      <div className="border-r py-3 w-1/5 fixed h-screen">
        <div className="px-6 font-bold text-menu flex items-center gap-2 pb-3">
          <SettingsIcon width={16} />
          Тохиргоо
        </div>
        <div
          className={`px-6 py-3 hover:bg-gray-100 border-t cursor-pointer ${
            selected === "general" ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelected("general")}
        >
          <div className="font-bold">Ерөнхий мэдээлэл</div>
          <div className="text-[13px] pb-0.5">Тестийн нэр, тайлбар, төрөл</div>
        </div>
        <div
          className={`px-6 py-3 hover:bg-gray-100 border-t cursor-pointer ${
            selected === "more" ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelected("more")}
        >
          <div className="font-bold">Дэлгэрэнгүй мэдээлэл</div>
          <div className="text-[13px] pb-0.5">
            Хэмжих зүйлс, хэрэглээ, түвшин
          </div>
        </div>
        <div
          className={`px-6 py-3 hover:bg-gray-100 border-t cursor-pointer ${
            selected === "blocks" ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelected("blocks")}
        >
          <div className="font-bold">Блокууд</div>
          <div className="text-[13px] pb-0.5">
            Дараалал, хугацаа, асуултын тоо
          </div>
        </div>
        <div
          className={`px-6 py-3 hover:bg-gray-100 border-t cursor-pointer ${
            selected === "preview" ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelected("preview")}
        >
          <div className="font-bold">Тестийн тойм</div>
          <div className="text-[13px] pb-0.5">Харагдах байдал</div>
        </div>
      </div>
      <div className="ml-[20%] w-1/2">
        {selected === "general" && (
          <div className="p-4 px-6">
            <div className="pr-36">
              <div className="px-1 pb-1"> Тестийн нэр</div>
              <TestName
                testName={localTestName}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setTestName={onTestNameChange}
              />
            </div>
            <Divider />
            <div className="pr-36 pb-2">
              <div className="px-1 pb-2"> Тайлбар</div>
              <TextArea rows={4} />
            </div>
            <Divider />
            <div className="pr-36 pt-1">
              <div className="px-1 pb-2"> Тестийн ангилал</div>
              <div className="flex gap-4 pb-2">
                <Select
                  placeholder="Тестийн ангилал"
                  suffixIcon={<DropdownIcon width={15} height={15} />}
                />
                <Select
                  placeholder="Дэд ангилал"
                  suffixIcon={<DropdownIcon width={15} height={15} />}
                />
              </div>
            </div>
            <Divider />
            <div className="pr-36 pt-1">
              <div className="px-1 pb-2"> Тестийн үнэ</div>
              <InputNumber addonAfter={"₮"} className="price" />
            </div>
          </div>
        )}
        {selected === "more" && (
          <div className="p-4 px-6">
            <div className="pr-36">
              <div className="px-1 pb-2"> Түвшин</div>
              <div className="flex gap-4 pb-2">
                <Select
                  placeholder="Тестийн түвшин"
                  suffixIcon={<DropdownIcon width={15} height={15} />}
                />
              </div>
            </div>
            <Divider />
            <div className="pr-36 py-1">
              <div className="px-1 pb-2"> Тест зохиогч</div>
              <Input className="w-[200px]" />
            </div>
            <Divider />
            <div className="pr-36 pb-2">
              <div className="px-1 pb-2">Хэрэглээ</div>
              <TextArea rows={4} />
            </div>
            <Divider />
            <div className="pr-36 pb-2">
              <div className="px-1 pb-2">Хэмжих зүйлс</div>
              <TextArea rows={4} />
            </div>
          </div>
        )}
        {selected === "blocks" && (
          <>
            <div className="border-r py-[14px] w-1/5 fixed h-screen">
              <Collapse
                expandIcon={({ isActive }) => (
                  <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
                )}
                defaultActiveKey={["1"]}
                items={[
                  {
                    key: "1",
                    label: "Хугацаа",
                    children: (
                      <>
                        <div className="flex items-center gap-2">
                          <InputNumber />
                          <span>минут</span>
                        </div>
                        <Divider />
                        <div className="flex items-center gap-2">
                          <Switch size="small" />
                          <span className="text-sm">
                            Блок тус бүр хугацаатай
                          </span>
                        </div>
                      </>
                    ),
                  },
                ]}
              />
              <Divider className="clps" />
              <Collapse
                expandIcon={({ isActive }) => (
                  <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
                )}
                defaultActiveKey={["2"]}
                items={[
                  {
                    key: "1",
                    label: "Асуултын тоо",
                    children: (
                      <div className="flex items-center gap-2">
                        <Switch size="small" />
                        <span className="text-sm">Асуулт хэсэгчлэх</span>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
            <div className="ml-[40%] p-6">jjj</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
