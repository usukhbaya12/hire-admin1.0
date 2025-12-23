"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Modal,
  Select,
  Input,
  Switch,
  Button,
  Form,
  Radio,
  Divider,
  message,
} from "antd";
import { DropdownIcon, PlusIcon } from "../Icons";
import { createNewCategory } from "@/app/api/assessment";
import { PenBoldDuotone, TagLineDuotone } from "solar-icons";

const NewAssessment = ({
  isModalOpen,
  assessmentCategories = [],
  handleOk,
  handleCancel,
  onCategoryCreate,
}) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [answerCategoriesInput, setAnswerCategoriesInput] = useState("");
  const [isCategorySwitchOn, setCategorySwitchOn] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [selectedMainCategoryId, setSelectedMainCategoryId] =
    useState(undefined);
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false);
  const [subDropdownOpen, setSubDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const testName = Form.useWatch("testName", form);
  const assessmentType = Form.useWatch("assessmentType", form);

  useEffect(() => {
    if (isModalOpen) {
      setIsEditing(false);
      setAnswerCategoriesInput("");
      setCategorySwitchOn(false);
      setNewCategoryName("");
      setCreatingCategory(false);
      setSelectedMainCategoryId(undefined);
      setMainDropdownOpen(false);
      setSubDropdownOpen(false);
      setIsSubmitting(false);
    }
  }, [isModalOpen, form]);

  useEffect(() => {
    if (assessmentType === 10) {
      setCategorySwitchOn(false);
      setAnswerCategoriesInput("");
      form.setFieldValue("answerCategoriesInput", undefined);
    }
  }, [assessmentType, form]);

  const handleEditClick = useCallback(() => setIsEditing(true), []);
  const handleBlur = useCallback(() => setIsEditing(false), []);

  const handleTestNameInputChange = useCallback(
    (e) => {
      form.setFieldValue("testName", e.target.value);
    },
    [form]
  );

  const handleCategorySwitchChange = useCallback(
    (checked) => {
      setCategorySwitchOn(checked);
      if (!checked) {
        setAnswerCategoriesInput("");
        form.setFieldValue("answerCategoriesInput", undefined);
      }
    },
    [form]
  );

  const answerCategoriesArray = useMemo(() => {
    if (!isCategorySwitchOn || !answerCategoriesInput.trim()) {
      return [];
    }
    return answerCategoriesInput
      .split(";")
      .map((category) => category.trim())
      .filter((category) => category !== "");
  }, [isCategorySwitchOn, answerCategoriesInput]);

  const handleCreateCategory = useCallback(
    async (parentId = null) => {
      if (!newCategoryName.trim()) {
        messageApi.error("Ангиллын нэр оруулна уу.");
        return;
      }
      setCreatingCategory(true);
      try {
        const response = await createNewCategory({
          name: newCategoryName.trim(),
          parent: parentId,
        });
        if (response.success) {
          const newCategoryId = response.data;
          messageApi.success("Ангилал үүссэн.");
          setNewCategoryName("");

          if (onCategoryCreate) {
            await onCategoryCreate();
          }

          form.setFieldValue("category", newCategoryId);
          if (parentId) {
            setSelectedMainCategoryId(parentId);
            setSubDropdownOpen(false);
          } else {
            setSelectedMainCategoryId(newCategoryId);
            setMainDropdownOpen(false);
          }
        } else {
          messageApi.error(response.message || "Алдаа гарлаа.");
        }
      } catch (error) {
        console.error("Create category error:", error);
        messageApi.error("Серверт холбогдоход алдаа гарла.");
      } finally {
        setCreatingCategory(false);
      }
    },
    [newCategoryName, onCategoryCreate, form]
  );

  const onSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const values = await form.validateFields();
      const formData = {
        testName: values.testName,
        hasAnswerCategory: isCategorySwitchOn,
        categories: answerCategoriesArray,
        type: values.assessmentType,
        assessmentCategory: values.category,
      };
      await handleOk(formData);
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, handleOk, isCategorySwitchOn, answerCategoriesArray]);

  const mainCategoryOptions = useMemo(() => {
    return assessmentCategories
      .filter((cate) => cate.parent == null)
      .map((cate) => ({
        label: cate.name,
        value: cate.id,
      }));
  }, [assessmentCategories]);

  const subCategoryOptions = useMemo(() => {
    if (!selectedMainCategoryId) return [];
    return assessmentCategories
      .filter((cate) => cate.parent?.id === selectedMainCategoryId)
      .map((cate) => ({
        label: cate.name,
        value: cate.id,
      }));
  }, [assessmentCategories, selectedMainCategoryId]);

  const onCancelModal = handleCancel;

  return (
    <Modal
      open={isModalOpen}
      onCancel={onCancelModal}
      title="Шинээр тест үүсгэх"
      footer={null}
      destroyOnClose={true}
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        <Divider className="modal-div mt-0" />
        <Form.Item
          label={<span className="font-bold">Тестийн нэр</span>}
          name="testName"
          rules={[{ required: true, message: "Тестийн нэр оруулна уу." }]}
          className="mb-4!"
        >
          {isEditing ? (
            <input
              className="outline-none w-full px-3 py-1"
              value={testName || ""}
              onChange={handleTestNameInputChange}
              onBlur={handleBlur}
              autoFocus
              style={{ fontWeight: "bold", fontSize: "18px" }}
            />
          ) : (
            <div
              className="cursor-pointer font-bold text-[18px] hover:bg-neutral rounded-full flex items-center gap-1.5 leading-6 py-1 border px-3 border-neutral w-fit"
              onClick={handleEditClick}
            >
              {testName || "Тестийн нэр"}
              <PenBoldDuotone width={14} className="text-main" />
            </div>
          )}
        </Form.Item>
        <Divider />
        <div className="font-bold pb-1">Тестийн ангилал сонгох</div>
        <div className="flex gap-4 w-full mb-2 pt-2">
          <Form.Item
            name="category"
            rules={[{ required: true, message: "Тестийн ангилал сонгоно уу." }]}
            className="fnp w-1/2 mb-0"
          >
            <Select
              className="w-full"
              open={mainDropdownOpen}
              onDropdownVisibleChange={setMainDropdownOpen}
              placeholder="Үндсэн ангилал"
              options={mainCategoryOptions}
              onChange={(value) => {
                setSelectedMainCategoryId(value);
                if (value !== undefined) {
                  form.setFieldValue("category", value);
                }
              }}
              suffixIcon={<DropdownIcon width={15} height={15} />}
              dropdownRender={(menu) => (
                <div className="bg-white rounded-xl">
                  {menu}
                  <Divider className="my-1!" />
                  <div className="px-2 pt-2 pb-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="Шинээр нэмэх"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      <Button
                        className="the-btn"
                        loading={creatingCategory}
                        onClick={() => handleCreateCategory(null)}
                      >
                        <PlusIcon width={16} height={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              allowClear
              onClear={() => {
                setSelectedMainCategoryId(undefined);
              }}
            />
          </Form.Item>

          <div className="w-1/2">
            <Select
              className="w-full"
              open={subDropdownOpen}
              onDropdownVisibleChange={setSubDropdownOpen}
              placeholder="Дэд ангилал"
              value={
                subCategoryOptions.some(
                  (opt) => opt.value === form.getFieldValue("category")
                )
                  ? form.getFieldValue("category")
                  : undefined
              }
              disabled={!selectedMainCategoryId}
              options={subCategoryOptions}
              onChange={(value) => {
                form.setFieldValue("category", value);
              }}
              suffixIcon={<DropdownIcon width={15} height={15} />}
              dropdownRender={(menu) => (
                <div className="bg-white rounded-xl">
                  {menu}
                  <Divider className="my-1" />
                  <div className="px-2 pb-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="Шинээр нэмэх"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        disabled={!selectedMainCategoryId}
                      />
                      <Button
                        className="the-btn"
                        loading={creatingCategory}
                        onClick={() =>
                          handleCreateCategory(selectedMainCategoryId)
                        }
                        disabled={!selectedMainCategoryId}
                      >
                        <PlusIcon width={16} height={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              allowClear
              onClear={() => {
                form.setFieldValue("category", selectedMainCategoryId);
              }}
            />
          </div>
        </div>

        <Divider />

        <Form.Item
          label={<span className="font-bold">Тестийн төрөл сонгох</span>}
          name="assessmentType"
          rules={[{ required: true, message: "Тестийн төрөл сонгоно уу." }]}
          initialValue={20}
          className="mb-2!"
        >
          <Radio.Group>
            <Radio value={20}>Үнэлгээ</Radio>
            <Radio value={10}>Зөв хариулттай тест</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider />

        <div className="pt-1 gap-2 flex items-center">
          <Switch
            size="small"
            checked={isCategorySwitchOn}
            onChange={handleCategorySwitchChange}
            disabled={assessmentType === 10}
          />
          <div>Хариулт нь ангилалтай байх уу?</div>
        </div>

        {isCategorySwitchOn && (
          <div className="pt-3">
            <Form.Item
              label={<span className="font-bold">Хариултын ангиллууд</span>}
              name="answerCategoriesInput"
              rules={[
                {
                  required: isCategorySwitchOn,
                  message: "Хариултын ангиллуудыг оруулна уу.",
                },
              ]}
              className="fnp mb-2"
            >
              <Input
                value={answerCategoriesInput}
                onChange={(e) => setAnswerCategoriesInput(e.target.value)}
                placeholder="Цэгтэй таслалаар хязгаарлан оруулна уу. Жишээ нь: D;I;S;C"
                className="category"
              />
            </Form.Item>
            {answerCategoriesArray.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {answerCategoriesArray.map((category, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 px-2.5 py-0.5 gap-2 rounded-full text-sm font-semibold flex items-center text-blue-800"
                  >
                    <TagLineDuotone width={14} className="text-blue-800" />
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-end mt-6">
          <Button className="back-btn" onClick={onCancelModal}>
            Буцах
          </Button>
          <Button className="the-btn" onClick={onSubmit} loading={isSubmitting}>
            Үүсгэх
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NewAssessment;
