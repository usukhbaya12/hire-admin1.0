"use client";

import React, { useState, useEffect } from "react";
import {
  message,
  Form,
  Switch,
  Select,
  Button,
  InputNumber,
  Card,
  Divider,
  Input,
} from "antd";
import { PlusIcon, DropdownIcon, MenuIcon } from "./Icons";
import { updateAssessmentById } from "@/app/api/assessment";
import { createNewFormula, getFormula } from "@/app/api/constant";
import FormulaExample from "./Formula";
import {
  CalculatorBoldDuotone,
  DatabaseBoldDuotone,
  FilterBoldDuotone,
  SettingsBoldDuotone,
  TagLineDuotone,
  TrashBin2BoldDuotone,
} from "solar-icons";

const Report = ({ assessmentData, onUpdateAssessment }) => {
  const [selected, setSelected] = useState("formula");
  const [form] = Form.useForm();
  const [aggregations, setAggregations] = useState([
    { field: "point", operation: "sum" },
  ]);
  const [filters, setFilters] = useState([{ field: "correct", value: true }]);
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [limitValue, setLimitValue] = useState(2);
  const [groupByEnabled, setGroupByEnabled] = useState(false);
  const [orderEnabled, setOrderEnabled] = useState(false);
  const [orderValue, setOrderValue] = useState("point");
  const [sortEnabled, setSortEnabled] = useState(false);
  const [sortValue, setSortValue] = useState("true");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState(
    assessmentData?.data?.report || null
  );
  const [hasFormula, setHasFormula] = useState(!!assessmentData?.data?.formule);

  useEffect(() => {
    const fetchFormulaData = async () => {
      if (assessmentData?.data?.formule) {
        setHasFormula(true);
        setLoading(true);
        try {
          const response = await getFormula(assessmentData.data.formule);

          if (response.success && response.data) {
            // Set aggregations
            if (
              response.data.aggregations &&
              response.data.aggregations.length > 0
            ) {
              setAggregations(
                response.data.aggregations.map((agg) => ({
                  field: agg.field,
                  operation: agg.operation.toLowerCase(),
                }))
              );
            } else {
              setAggregations([{ field: "point", operation: "sum" }]);
            }

            // Set filters
            const filterEntries = Object.entries(response.data.filters);
            if (filterEntries.length > 0) {
              setFilters(
                filterEntries.map(([field, value]) => ({
                  field,
                  value,
                }))
              );
            } else {
              setFilters([]);
            }

            setLimitEnabled(!!response.data.limit);
            if (response.data.limit) setLimitValue(response.data.limit);

            setGroupByEnabled(
              response.data.groupBy.includes("answerCategoryId")
            );

            setOrderEnabled(!!response.data.order);
            if (response.data.order) setOrderValue(response.data.order);

            setSortEnabled(response.data.sort === true);
            setSortValue(response.data.sort === true ? "true" : "false");
          }
        } catch (error) {
          messageApi.error("Томьёоны мэдээлэл ачааллахад алдаа гарлаа");
        } finally {
          setLoading(false);
        }
      } else {
        setHasFormula(false);
      }
    };

    fetchFormulaData();
  }, [assessmentData?.data?.formule]);

  useEffect(() => {
    setReportType(assessmentData?.data?.report || null);
  }, [assessmentData?.data?.report]);

  const fieldOptions = [{ value: "point", label: "Оноо" }];
  const filterFieldOptions = [{ value: "correct", label: "Зөв хариулт" }];
  const filterValueOptions = [
    { value: true, label: "Тийм" },
    { value: false, label: "Үгүй" },
  ];
  const sortOptions = [
    { value: "true", label: "Өсөхөөр" },
    { value: "false", label: "Буурахаар" },
  ];
  const operationOptions = [
    { value: "sum", label: "Нийлбэр (sum)" },
    { value: "avg", label: "Дундаж (avg)" },
    { value: "count", label: "Тоолох (count)" },
  ];

  const addAggregation = () => {
    if (aggregations.length === 0) {
      setAggregations([{ field: "point", operation: "sum" }]);
    }
  };

  const removeAggregation = () => {
    setAggregations([]);
  };

  const handleFieldChange = (value, index) => {
    const newAggregations = [...aggregations];
    newAggregations[index].field = value;
    setAggregations(newAggregations);
  };

  const handleOperationChange = (value, index) => {
    const newAggregations = [...aggregations];
    newAggregations[index].operation = value;
    setAggregations(newAggregations);
  };

  const addFilter = () => {
    if (filters.length === 0) {
      setFilters([{ field: "correct", value: true }]);
    }
  };

  const removeFilter = () => {
    setFilters([]);
  };

  const handleFilterFieldChange = (value, index) => {
    const newFilters = [...filters];
    newFilters[index].field = value;
    setFilters(newFilters);
  };

  const handleFilterValueChange = (value, index) => {
    const newFilters = [...filters];
    newFilters[index].value = value;
    setFilters(newFilters);
  };

  const reportMapping = [
    { label: "Зөв хариулттай", value: 10 },
    { label: "DiSC", value: 20 },
    { label: "Белбин", value: 40 },
    { label: "MBTI", value: 30 },
    { label: "Genos", value: 50 },
    { label: "Нарциссистик", value: 60 },
    { label: "Сэтгэл гутрал", value: 70 },
  ];

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  const saveFormula = async () => {
    if (!reportType) {
      messageApi.error("Тайлангийн төрөл сонгоно уу.");
      return;
    }

    const formulaData = {
      name: assessmentData?.data?.name,
      formula: "string",
      variables: [],
      groupBy: groupByEnabled ? ["answerCategoryId"] : [],
      aggregations: aggregations.map((agg) => ({
        field: agg.field,
        operation: agg.operation?.toUpperCase(),
      })),
      filters: filters.reduce((acc, filter) => {
        if (filter.field && filter.value !== undefined) {
          acc[filter.field] = filter.value;
        }
        return acc;
      }, {}),
      limit: limitEnabled ? limitValue : null,
      sort: sortEnabled ? sortValue === "true" : false,
      ...(orderEnabled && { order: orderValue }),
    };

    setLoading(true);
    try {
      const response = await createNewFormula(JSON.stringify(formulaData));

      if (response.success) {
        setHasFormula(true);

        if (assessmentData?.data?.id) {
          try {
            const updateResponse = await updateAssessmentById(
              assessmentData.data.id,
              {
                formule: response.data,
                report: reportType,
              }
            );

            if (updateResponse?.success) {
              messageApi.success("Томьёо амжилттай хадгалагдлаа.");

              onUpdateAssessment({
                ...assessmentData,
                data: {
                  ...assessmentData.data,
                  formule: response.data,
                  report: reportType,
                },
              });
            } else {
              messageApi.warning(
                "Томьёо үүссэн боловч хадгалахад алдаа гарлаа."
              );
            }
          } catch (error) {
            console.error("Error saving to assessment:", error);
            messageApi.warning("Томьёо үүссэн боловч хадгалахад алдаа гарлаа.");
          }
        } else {
          messageApi.success("Томьёо амжилттай хадгалагдлаа.");

          onUpdateAssessment({
            ...assessmentData,
            data: {
              ...assessmentData.data,
              formule: response.data,
              report: reportType,
            },
          });
        }
      } else {
        messageApi.error(response.message || "Томьёо хадгалахад алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Error in saveFormula:", error);
      messageApi.error("Томьёо хадгалахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[47px]">
      {contextHolder}
      <div className="border-r border-neutral py-3 w-1/5 fixed h-screen">
        <div className="px-8 font-extrabold text-menu flex items-center gap-2 mt-1 text-[#6a6d70] pb-3 border-b border-neutral">
          <SettingsBoldDuotone width={16} />
          Тооцоолол
        </div>
        <div
          className={`px-8 py-3 hover:bg-gray-100 cursor-pointer ${
            selected === "formula" ? "bg-gray-100" : ""
          }`}
        >
          <div className="font-bold">Тестийн үр дүн бодох</div>
          <div className="text-[13px] pb-0.5">
            Үр дүн тооцоолох аргачлал тохируулах
          </div>
        </div>
      </div>

      <div className="ml-[20%]">
        <div className="p-6 px-7">
          <Form form={form}>
            <div className={selected === "formula" ? "" : "hidden"}>
              <div className="mb-4">
                <div className="font-bold text-xl rounded-md">
                  {assessmentData?.data?.name}
                </div>
                <div
                  className={`${
                    hasFormula ? "text-green-600" : "text-orange-500"
                  } font-bold`}
                >
                  {hasFormula
                    ? "Томьёо хадгалсан байна."
                    : "Томьёо хадгалаагүй байна."}
                </div>
                {assessmentData?.data?.answerCategories?.length > 0 && (
                  <div className="mt-4 pb-2! flex flex-wrap gap-2">
                    {assessmentData?.data?.answerCategories.map(
                      (category, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 px-2.5 py-0.5 gap-2 rounded-full text-sm font-semibold flex items-center text-blue-800"
                        >
                          <TagLineDuotone width={14} />
                          {category.name}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-5!">
                  {assessmentData?.data?.answerCategories?.length > 0 && (
                    <Card
                      title={
                        <div className="flex items-center gap-2">
                          <MenuIcon width={15} />
                          <span>Бүлэглэлт</span>
                        </div>
                      }
                    >
                      <div className="flex items-center gap-2">
                        <Switch
                          size="small"
                          checked={groupByEnabled}
                          onChange={setGroupByEnabled}
                        />
                        <span>Хариултын ангиллаар нь бүлэглэх</span>
                      </div>
                    </Card>
                  )}
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <CalculatorBoldDuotone width={17} />
                        <span>Тооцоолол</span>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      {aggregations.length > 0 ? (
                        aggregations.map((agg, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <Select
                              suffixIcon={
                                <DropdownIcon width={15} height={15} />
                              }
                              placeholder="Оноо"
                              value={agg.field}
                              onChange={(value) =>
                                handleFieldChange(value, index)
                              }
                              className="w-full"
                              options={fieldOptions}
                            />
                            <Select
                              suffixIcon={
                                <DropdownIcon width={15} height={15} />
                              }
                              placeholder="Үйлдэл"
                              value={agg.operation}
                              onChange={(value) =>
                                handleOperationChange(value, index)
                              }
                              className="w-full"
                              options={operationOptions}
                            />
                            <Button
                              type="text"
                              onClick={removeAggregation}
                              icon={<TrashBin2BoldDuotone width={18} />}
                              className="text-red-500! rounded-full! px-2! mt-1!"
                            />
                          </div>
                        ))
                      ) : (
                        <Button
                          onClick={addAggregation}
                          icon={<PlusIcon width={16} color="#000" />}
                          className="back-btn w-full"
                        >
                          Тооцоолол нэмэх
                        </Button>
                      )}
                    </div>
                  </Card>

                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <FilterBoldDuotone width={17} />
                        <span>Филтер</span>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      {filters.length > 0 ? (
                        filters.map((filter, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <Select
                              suffixIcon={
                                <DropdownIcon width={15} height={15} />
                              }
                              placeholder="Филтер"
                              value={filter.field}
                              onChange={(value) =>
                                handleFilterFieldChange(value, index)
                              }
                              className="w-full"
                              options={filterFieldOptions}
                            />
                            <Select
                              suffixIcon={
                                <DropdownIcon width={15} height={15} />
                              }
                              placeholder="Утга"
                              value={filter.value}
                              onChange={(value) =>
                                handleFilterValueChange(value, index)
                              }
                              className="w-full"
                              options={filterValueOptions}
                            />
                            <Button
                              type="text"
                              onClick={removeFilter}
                              icon={<TrashBin2BoldDuotone width={18} />}
                              className="text-red-500! rounded-full! px-2! mt-1!"
                            />
                          </div>
                        ))
                      ) : (
                        <Button
                          onClick={addFilter}
                          icon={<PlusIcon width={16} color="#000" />}
                          className="back-btn w-full"
                        >
                          Филтер нэмэх
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="space-y-5!">
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <DatabaseBoldDuotone width={17} />
                        <span>Дараалал</span>
                      </div>
                    }
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Switch
                          size="small"
                          checked={limitEnabled}
                          onChange={setLimitEnabled}
                        />
                        <span className="font-medium">
                          {`Эхний {n} үр дүнг авах`}
                        </span>
                      </div>
                      {limitEnabled && (
                        <div>
                          <InputNumber
                            min={1}
                            value={limitValue}
                            onChange={setLimitValue}
                            className="w-32"
                            placeholder="Хэдэн ширхэг"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Switch
                          size="small"
                          checked={orderEnabled}
                          onChange={setOrderEnabled}
                        />
                        <span className="font-medium">Дугаарлах</span>
                      </div>
                      {orderEnabled && (
                        <div>
                          <Select
                            suffixIcon={<DropdownIcon width={15} height={15} />}
                            value={orderValue}
                            onChange={setOrderValue}
                            className="w-48"
                            options={fieldOptions}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Switch
                          size="small"
                          checked={sortEnabled}
                          onChange={setSortEnabled}
                        />
                        <span className="font-medium">Эрэмбэлэх</span>
                      </div>
                      {sortEnabled && (
                        <div>
                          <Select
                            suffixIcon={<DropdownIcon width={15} height={15} />}
                            value={sortValue}
                            onChange={setSortValue}
                            className="w-48"
                            options={sortOptions}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <MenuIcon width={20} />
                        <span>Тайлангийн төрөл</span>
                      </div>
                    }
                  >
                    <div>
                      <Form.Item style={{ marginBottom: 0 }}>
                        <Select
                          className="w-full"
                          placeholder="Төрөл сонгох"
                          options={reportMapping}
                          value={reportType}
                          onChange={handleReportTypeChange}
                          suffixIcon={<DropdownIcon width={15} height={15} />}
                          status={!reportType ? "error" : ""}
                        />
                      </Form.Item>
                    </div>
                  </Card>
                  <Button
                    onClick={saveFormula}
                    className="the-btn w-full"
                    loading={loading}
                  >
                    Томьёо хадгалах
                  </Button>
                </div>
                <div className="space-y-6">
                  <FormulaExample
                    assessmentData={assessmentData}
                    groupByEnabled={groupByEnabled}
                    aggregations={aggregations}
                    filters={filters}
                    limitEnabled={limitEnabled}
                    limitValue={limitValue}
                    sortEnabled={sortEnabled}
                    sortValue={sortValue}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Report;
