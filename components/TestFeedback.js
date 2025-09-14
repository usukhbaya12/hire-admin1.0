"use client";

import React, { useState, useEffect } from "react";
import { Table, Spin, message, ConfigProvider } from "antd";
import { getFeedback } from "@/app/api/constant";
import mnMN from "antd/lib/locale/mn_MN";
import { customLocale } from "@/utils/values";
import { LoadingOutlined } from "@ant-design/icons";
import { LightbulbBoltBoldDuotone } from "solar-icons";

const TestFeedback = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [testFeedback, setTestFeedback] = useState([]);
  const [testTotalCount, setTestTotalCount] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchTestFeedback = async () => {
    setLoading(true);
    try {
      const response = await getFeedback({
        type: 10,
        page: currentPage,
        limit: pageSize,
      });

      if (response.success) {
        setTestFeedback(response.data.data || []);
        setTestTotalCount(response.data.count || 0);
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

  useEffect(() => {
    fetchTestFeedback();
  }, [currentPage, pageSize]);

  const testFeedbackColumns = [
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
      title: "Санал, хүсэлт",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
  ];

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <ConfigProvider locale={mnMN}>
      {contextHolder}
      <div className="pt-6 px-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-base font-bold flex items-center gap-2">
            <LightbulbBoltBoldDuotone className="text-main" />
            Тестийн явцад тулгарсан санал, хүсэлтүүд
          </div>
        </div>

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
            pageSizeOptions: ["10", "20", "50", testTotalCount],
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

export default TestFeedback;
