"use client";

import React, { useState, useEffect } from "react";
import { Table, Spin, message, Empty, ConfigProvider, Modal } from "antd";
import { getContact } from "@/app/api/constant";
import mnMN from "antd/lib/locale/mn_MN";
import { customLocale } from "@/utils/values";
import { LoadingOutlined } from "@ant-design/icons";
import { HandShakeBoldDuotone } from "solar-icons";

const Contact = ({ type }) => {
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // For modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const fetchContactData = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const response = await getContact(page, size, type);
      if (response.success) {
        const data = response.data.data || [];
        setContactData(data);
        setTotalCount(response.data.count || 0);
        setCurrentPage(page);
      } else {
        messageApi.error(response.message || "Алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData(1, pageSize);
  }, [type]); // Re-fetch when type changes

  const handleTableChange = (pagination) => {
    const newPage = pagination.current;
    const newPageSize = pagination.pageSize;

    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }

    fetchContactData(newPage, newPageSize);
  };

  const columns = [
    {
      title: "№",
      key: "no",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
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
      title: "Нэр",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "И-мэйл хаяг",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Утасны дугаар",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Агуулга",
      dataIndex: "message",
      key: "message",
      render: (text) => (
        <div
          className="max-w-xs truncate text-blue-600 cursor-pointer hover:underline"
          onClick={() => {
            setSelectedMessage(text);
            setIsModalVisible(true);
          }}
        >
          {text}
        </div>
      ),
    },
  ];

  // Get the title based on type
  const getTitle = () => {
    switch (type) {
      case "10":
        return "Тест нийлүүлэх";
      case "20":
        return "Хамтран ажиллах";
      case "30":
        return "Тестийн талаарх санал хүсэлт";
      case "40":
        return "Бусад";
      default:
        return "Холбоо барих";
    }
  };

  if (loading && contactData.length === 0) {
    return (
      <ConfigProvider locale={mnMN}>
        <div className="flex justify-center items-center h-64">
          <Spin
            size="large"
            indicator={
              <LoadingOutlined
                style={{ color: "#f26522", fontSize: 32 }}
                spin
              />
            }
          />
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider locale={mnMN}>
      {contextHolder}
      <div className="px-5 py-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-base font-bold flex items-center gap-2">
            <HandShakeBoldDuotone className="text-main" />
            {getTitle()}
          </div>
        </div>

        {contactData.length === 0 ? (
          <Empty
            description="Өгөгдөл олдсонгүй"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-12"
          />
        ) : (
          <>
            <Table
              dataSource={contactData}
              columns={columns}
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
                size: "small",
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) =>
                  `${range[0]}-ээс ${range[1]} / Нийт ${total}`,
                onShowSizeChange: (current, size) => {
                  setPageSize(size);
                  fetchContactData(current, size);
                },
              }}
              onChange={handleTableChange}
            />

            {/* Modal for full message */}
            <Modal
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onOk={() => setIsModalVisible(false)}
              title="Агуулга"
              footer={null}
            >
              <p className="whitespace-pre-wrap">{selectedMessage}</p>
            </Modal>
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default Contact;
