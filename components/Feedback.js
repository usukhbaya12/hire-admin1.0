"use client";

import React, { useState, useEffect } from "react";
import { Table, Spin, message, ConfigProvider, Select } from "antd";
import { getFeedback } from "@/app/api/constant";
import mnMN from "antd/lib/locale/mn_MN";
import { customLocale } from "@/utils/values";
import { LoadingOutlined } from "@ant-design/icons";
import {
  ExpressionlessCircle,
  LightbulbBoltBoldDuotone,
  SadCircle,
  SmileCircle,
} from "solar-icons";
import { DropdownIcon } from "./Icons";

const { Option } = Select;

const GeneralFeedback = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [generalFeedback, setGeneralFeedback] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [statusSummary, setStatusSummary] = useState({
    smile: 0,
    meh: 0,
    bad: 0,
    avg: 0,
  });

  const fetchGeneralFeedback = async () => {
    setLoading(true);
    try {
      const response = await getFeedback({
        type: 20,
        page: currentPage,
        limit: pageSize,
        assessment: selectedAssessment,
      });

      if (response.success) {
        const feedbackData = response.data.data || [];
        setGeneralFeedback(feedbackData);
        setTotalCount(response.data.count || 0);

        // 👉 Only calculate summary if a test is selected
        if (selectedAssessment) {
          let smile = 0,
            meh = 0,
            bad = 0,
            totalScore = 0;

          feedbackData.forEach((item) => {
            switch (item.status) {
              case 10: // smile
                smile++;
                totalScore += 3;
                break;
              case 20: // meh
                meh++;
                totalScore += 2;
                break;
              case 30: // bad
                bad++;
                totalScore += 1;
                break;
            }
          });

          const total = smile + meh + bad;
          const avg = total > 0 ? (totalScore / total).toFixed(2) : 0;

          setStatusSummary({ smile, meh, bad, avg });
        } else {
          setStatusSummary({ smile: 0, meh: 0, bad: 0, avg: 0 });
        }
      } else {
        messageApi.error(response.message || "Алдаа гарлаа");
      }
    } catch (error) {
      console.error(error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async () => {
    setLoadingAssessments(true);
    try {
      // Fetch a larger dataset to get all unique assessments
      const response = await getFeedback({
        type: 20,
        page: 1,
        limit: 1000,
      });

      if (response.success) {
        const uniqueAssessments = [];
        const assessmentIds = new Set();

        response.data.data?.forEach((item) => {
          if (item.assessment && !assessmentIds.has(item.assessment.id)) {
            assessmentIds.add(item.assessment.id);
            uniqueAssessments.push({
              id: item.assessment.id,
              name: item.assessment.name,
            });
          }
        });

        setAssessments(uniqueAssessments);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoadingAssessments(false);
    }
  };

  useEffect(() => {
    fetchGeneralFeedback();
  }, [currentPage, pageSize, selectedAssessment]);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleAssessmentChange = (value) => {
    setSelectedAssessment(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 10:
        return (
          <SmileCircle className="text-green-500" width={20} height={20} />
        );
      case 20:
        return (
          <ExpressionlessCircle
            className="text-yellow-500"
            width={20}
            height={20}
          />
        );
      case 30:
        return <SadCircle className="text-red-500" width={20} height={20} />;
      default:
        return null;
    }
  };

  const generalFeedbackColumns = [
    {
      title: "№",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Огноо",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      },
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      align: "center",
    },
    {
      title: "Шалгуулагчийн нэр",
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
      title: "Үнэлгээ",
      dataIndex: "status",
      key: "status",
      width: 90,
      align: "center",
      render: (status) => (
        <div className="flex justify-center">{renderStatusIcon(status)}</div>
      ),
    },
    {
      title: "Санал, хүсэлт",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (text) => <div className="max-w-md">{text || "-"}</div>,
    },
  ];

  return (
    <ConfigProvider locale={mnMN}>
      {contextHolder}
      <div className="px-5 py-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-base font-bold flex items-center gap-2">
            <LightbulbBoltBoldDuotone className="text-main" />
            Тестийн тухай санал, хүсэлтүүд
          </div>
          <div className="flex items-center gap-2">
            {selectedAssessment && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-green-600 font-bold">
                  <SmileCircle width={20} height={20} /> {statusSummary.smile}
                </div>
                <div className="flex items-center gap-1 text-yellow-600 font-bold">
                  <ExpressionlessCircle width={20} height={20} />{" "}
                  {statusSummary.meh}
                </div>
                <div className="flex items-center gap-1 text-red-600 font-bold">
                  <SadCircle width={20} height={20} /> {statusSummary.bad}
                </div>
                <div className="flex items-center gap-1 font-semibold text-main">
                  Нийт:{" "}
                  {statusSummary.smile + statusSummary.meh + statusSummary.bad}{" "}
                  шалгуулагч, {((statusSummary.avg / 3) * 100).toFixed(1)}%
                </div>
              </div>
            )}
            <Select
              showSearch
              placeholder="Тест сонгох"
              suffixIcon={
                <DropdownIcon width={15} height={15} color={"#f36421"} />
              }
              style={{ width: 220 }}
              allowClear
              loading={loadingAssessments}
              value={selectedAssessment}
              onChange={handleAssessmentChange}
            >
              {assessments.map((assessment) => (
                <Option key={assessment.id} value={assessment.id}>
                  {assessment.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <Table
          dataSource={generalFeedback}
          columns={generalFeedbackColumns}
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
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", totalCount],
            onChange: handlePageChange,
            size: "small",
            showTotal: (total, range) =>
              `${range[0]}-ээс ${range[1]} / Нийт ${total}`,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default GeneralFeedback;
