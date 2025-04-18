"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  Table,
  Spin,
  Card,
  Badge,
  message,
  Collapse,
  Empty,
  Row,
  Col,
  ConfigProvider,
} from "antd";
import { getFeedback } from "@/app/api/constant";
import mnMN from "antd/lib/locale/mn_MN";
import {
  ExpressionlessCircle,
  SadCircle,
  SmileCircle,
  UsersGroupRoundedBoldDuotone,
} from "solar-icons";
import { customLocale } from "@/utils/values";
import Image from "next/image";
import { api } from "@/utils/routes";
import { DropdownIcon } from "./Icons";
import { LoadingOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const Feedback = () => {
  const [loading, setLoading] = useState(true);
  const [feedbackType, setFeedbackType] = useState(20); // Default to Санал, хүсэлт
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [testFeedback, setTestFeedback] = useState([]);
  const [generalFeedback, setGeneralFeedback] = useState([]);
  const [groupedFeedback, setGroupedFeedback] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [activeKey, setActiveKey] = useState("20");
  const [testTotalCount, setTestTotalCount] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});

  const fetchFeedback = async (type) => {
    setLoading(true);
    try {
      // For test feedback (10), use pagination
      if (type === 10) {
        const response = await getFeedback(type, currentPage, pageSize);
        if (response.success) {
          setTestFeedback(response.data.data || []);
          setTestTotalCount(response.data.total || 0);
        } else {
          messageApi.error(response.message || "Алдаа гарлаа");
        }
      }
      // For general feedback (20), get more data at once (10000 limit)
      else {
        const response = await getFeedback(type, 1, 10000);
        if (response.success) {
          setGeneralFeedback(response.data.data || []);
          processGeneralFeedback(response.data.data || []);
        } else {
          messageApi.error(response.message || "Алдаа гарлаа");
        }
      }
    } catch (error) {
      console.error(error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const processGeneralFeedback = (feedback) => {
    const groupedByAssessment = feedback.reduce((acc, item) => {
      const assessmentId = item.assessment?.id;
      if (!assessmentId) return acc;

      if (!acc[assessmentId]) {
        acc[assessmentId] = {
          assessment: item.assessment,
          feedbacks: [],
          stats: { 10: 0, 20: 0, 30: 0, total: 0 },
        };
      }

      acc[assessmentId].feedbacks.push(item);

      if (item.status) {
        acc[assessmentId].stats[item.status]++;
        acc[assessmentId].stats.total++;
      }

      return acc;
    }, {});

    const result = Object.values(groupedByAssessment);
    setGroupedFeedback(result);
  };

  useEffect(() => {
    fetchFeedback(feedbackType);
  }, [feedbackType, currentPage, pageSize]);

  const handleTabChange = (key) => {
    setFeedbackType(parseInt(key));
    setCurrentPage(1);
  };

  const toggleCardExpansion = (assessmentId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [assessmentId]: !prev[assessmentId],
    }));
  };

  const testFeedbackColumns = [
    {
      title: "Хэрэглэгч",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative min-w-10 min-h-10 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
              <div className="text-base font-bold uppercase bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                {record.user?.firstname?.[0] || "?"}
              </div>
            </div>
          </div>
          <div className="leading-4">
            <div className="font-semibold">
              {record.user?.lastname?.[0] || ""}.{record.user?.firstname || ""}
            </div>
            <div className="text-gray-700 text-sm">
              {record.user?.email || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Тестийн нэр",
      dataIndex: ["assessment", "name"],
      key: "assessment",
      render: (text) => (
        <div className="text-main font-bold">{text || "-"}</div>
      ),
    },
    {
      title: "Санал, хүсэлт",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Огноо",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const renderStatusIcon = (status) => {
    switch (status) {
      case 10:
        return <SmileCircle className="text-green-500" />;
      case 20:
        return <ExpressionlessCircle className="text-yellow-500" />;
      case 30:
        return <SadCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const renderAssessmentCard = (group) => {
    const hasFeedbackMessages = group.feedbacks.some((f) => f.message?.trim());
    const isExpanded = expandedCards[group.assessment.id];
    const iconUrl = group.assessment.icons
      ? `${api}file/${group.assessment.icons}`
      : "/hire-logo.png";

    return (
      <Col xs={24} md={12} lg={8} key={group.assessment.id} className="mb-6">
        <div className="group bg-white backdrop-blur-md overflow-hidden transition-all duration-500 shadow shadow-slate-200 rounded-3xl z-10">
          <div className="flex flex-col gap-3">
            {group.assessment.icons && (
              <div className="relative aspect-video overflow-hidden rounded-3xl bg-gray-200 max-h-[220px] min-h-[220px] w-full">
                <Image
                  src={
                    `${api}file/${group.assessment.icons}` || "/hire-logo.png"
                  }
                  alt={group.assessment.name}
                  fill
                  loading="lazy"
                  className={`
                 object-cover
                 duration-700 
                 max-h-[220px] min-h-[220px]
               `}
                />
              </div>
            )}
            <div className="space-y-3 pb-5 pt-3 px-9">
              <h3 className="font-extrabold text-lg transition-colors duration-500 group-hover:text-main leading-5">
                {group.assessment.name}
              </h3>
              <div className="flex justify-between">
                <p className="leading-6 text-justify text-gray-700 flex items-center gap-1 font-bold text-main">
                  <UsersGroupRoundedBoldDuotone width={16} />
                  {group.stats.total} шалгуулагч
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <SmileCircle
                      className="text-green-500"
                      width={16}
                      height={16}
                    />
                    <span>{group.stats[10] || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ExpressionlessCircle
                      className="text-yellow-500"
                      width={16}
                      height={16}
                    />
                    <span>{group.stats[20] || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SadCircle
                      className="text-red-500"
                      width={16}
                      height={16}
                    />
                    <span>{group.stats[30] || 0}</span>
                  </div>
                </div>
              </div>
              {hasFeedbackMessages && (
                <Collapse
                  className="no-collapse"
                  expandIcon={({ isActive }) => (
                    <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
                  )}
                  items={[
                    {
                      key: "1",
                      label: `Санал, хүсэлтүүд (${
                        group.feedbacks.filter((f) => f.message?.trim()).length
                      })`,
                      children: (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                          {group.feedbacks
                            .filter((feedback) => feedback.message?.trim())
                            .map((feedback) => (
                              <div
                                key={feedback.id}
                                className="flex gap-3 bg-white pb-3 border-b border-neutral"
                              >
                                <div className="mt-1">
                                  {renderStatusIcon(feedback.status)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="font-semibold">
                                      <div>{feedback.user?.email}</div>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                      {new Date(
                                        feedback.createdAt
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="mt-1 text-gray-700">
                                    {feedback.message}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ),
                    },
                  ]}
                ></Collapse>
              )}
            </div>
          </div>
        </div>
      </Col>
    );
  };

  const renderGeneralFeedbackTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <Spin
            size="default"
            indicator={
              <LoadingOutlined
                style={{ color: "#f26522", fontSize: 24 }}
                spin
              />
            }
          />
        </div>
      );
    }

    if (groupedFeedback.length === 0) {
      return <Empty description="Санал хүсэлт алга байна" />;
    }

    return (
      <Row gutter={[24, 0]}>{groupedFeedback.map(renderAssessmentCard)}</Row>
    );
  };

  const items = [
    {
      key: "20",
      label: "Санал, хүсэлт",
      children: renderGeneralFeedbackTab(),
    },
    {
      key: "10",
      label: "Тестийн явцад тулгарсан",
      children: (
        <Table
          dataSource={testFeedback}
          columns={testFeedbackColumns}
          rowKey="id"
          loading={{
            spinning: loading,
            indicator: (
              <Spin
                size="default"
                indicator={
                  <LoadingOutlined
                    style={{ color: "#f26522", fontSize: 24 }}
                    spin
                  />
                }
              />
            ),
          }}
          locale={customLocale}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: testTotalCount,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      ),
    },
  ];

  return (
    <>
      <ConfigProvider locale={mnMN}>
        {contextHolder}
        <div className="flex border-b border-neutral pr-6 pl-4 justify-between items-end pt-3">
          <div className="flex gap-6">
            {items.map((item) => (
              <div
                key={item.key}
                className={`cursor-pointer p-2 ${
                  item.key === activeKey
                    ? "font-bold text-main border-b-2 border-main"
                    : ""
                }`}
                onClick={() => {
                  setActiveKey(item.key);
                  handleTabChange(item.key);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 px-6">
          {activeKey === "10" && items[1].children}
          {activeKey === "20" && items[0].children}
        </div>
      </ConfigProvider>
    </>
  );
};

export default Feedback;
