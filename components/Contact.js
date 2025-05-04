"use client";

import React, { useState, useEffect } from "react";
import { Table, Spin, message, Empty, ConfigProvider } from "antd";
import { getContact } from "@/app/api/constant";
import mnMN from "antd/lib/locale/mn_MN";
import { customLocale } from "@/utils/values";
import { LoadingOutlined } from "@ant-design/icons";

const Contact = () => {
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [activeKey, setActiveKey] = useState("10");
  const [groupedData, setGroupedData] = useState({});

  const fetchContactData = async () => {
    setLoading(true);
    try {
      const response = await getContact();
      if (response.success) {
        const data = response.data.data || [];
        setContactData(data);

        // Group data by type
        const grouped = data.reduce((acc, item) => {
          const type = item.type.toString();
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(item);
          return acc;
        }, {});

        setGroupedData(grouped);
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
    fetchContactData();
  }, []);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const columns = [
    {
      title: "№",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Илгээсэн огноо",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "И-мейл хаяг",
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
    },
  ];

  const renderTabContent = (type) => {
    const typeData = groupedData[type] || [];

    if (typeData.length === 0) {
      return (
        <Empty
          description="Өгөгдөл олдсонгүй"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-12"
        />
      );
    }

    return (
      <Table
        dataSource={typeData}
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
        pagination={{ size: "small" }}
      />
    );
  };

  const items = [
    {
      key: "10",
      label: "Тест нийлүүлэх",
    },
    {
      key: "20",
      label: "Хамтран ажиллах",
    },
    {
      key: "30",
      label: "Тестийн талаарх санал хүсэлт",
    },
    {
      key: "40",
      label: "Бусад",
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

        <div className="pt-6 px-6">{renderTabContent(activeKey)}</div>
      </ConfigProvider>
    </>
  );
};

export default Contact;
