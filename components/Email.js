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
  DatePicker,
  Button,
  Select,
  Input,
} from "antd";
import { getFeedback } from "@/app/api/constant";
import mnMN from "antd/lib/locale/mn_MN";
import {
  CalendarBoldDuotone,
  ExpressionlessCircle,
  LetterBoldDuotone,
  SadCircle,
  SmileCircle,
  UsersGroupRoundedBoldDuotone,
} from "solar-icons";
import { customLocale } from "@/utils/values";
import Image from "next/image";
import { api } from "@/utils/routes";
import { DropdownIcon } from "./Icons";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Panel } = Collapse;

const Email = () => {
  const [loading, setLoading] = useState(true);
  const [feedbackType, setFeedbackType] = useState(20); // Default to Санал, хүсэлт
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [testFeedback, setTestFeedback] = useState([]);
  const [generalFeedback, setGeneralFeedback] = useState([]);
  const [groupedFeedback, setGroupedFeedback] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
  const [endDate, setEndDate] = useState(dayjs());

  return (
    <>
      <ConfigProvider locale={mnMN}>
        {contextHolder}
        <div className="px-5 py-6">
          {contextHolder}

          <div className="flex justify-between items-center mb-4">
            <div className="text-base font-bold flex items-center gap-2">
              <LetterBoldDuotone className="text-main" />
              И-мэйл лог бүртгэл
            </div>
            <div className="flex justify-end items-center flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <DatePicker
                    value={startDate}
                    // onChange={handleStartDateChange}
                    format="YYYY-MM-DD"
                    placeholder="Эхлэх огноо"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <DatePicker
                    value={endDate}
                    // onChange={handleEndDateChange}
                    format="YYYY-MM-DD"
                    placeholder="Дуусах огноо"
                    disabledDate={(current) =>
                      startDate && current && current < startDate
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    // value={endDate}
                    placeholder="Төлөв сонгох"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    // value={endDate}
                    placeholder="И-мэйл хаяг"
                  />
                </div>
                <Button className="back-btn">
                  <CalendarBoldDuotone width={16} />
                  Хайх
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Table
              columns={[
                {
                  title: "№",
                  dataIndex: "id",
                  key: "id",
                },
                {
                  title: "Илгээсэн огноо",
                  dataIndex: "date",
                  key: "date",
                },
                {
                  title: "И-мэйл хаяг",
                  dataIndex: "email",
                  key: "email",
                },
                {
                  title: "Гарчиг",
                  dataIndex: "subject",
                  key: "subject",
                },
                {
                  title: "Төрөл",
                  dataIndex: "type",
                  key: "type",
                },
                {
                  title: "Төлөв",
                  dataIndex: "status",
                  key: "status",
                },
                {
                  title: "Үйлдэл",
                  dataIndex: "action",
                  key: "action",
                  render: (text) => (
                    <Button className="the-btn !px-3 !py-1 !text-sm">
                      {text}
                    </Button>
                  ),
                },
              ]}
              dataSource={[
                {
                  key: "1",
                  id: 1,
                  date: "2025-09-03 15:26",
                  email: "usukhbayarrr@gmail.com",
                  subject: "Таны тайлан бэлэн боллоо",
                  type: "Тайлан",
                  status: "Амжилттай",
                  action: "Дахин илгээх",
                },
                {
                  key: "1",
                  id: 1,
                  date: "2025-09-03 15:26",
                  email: "usukhbayarrr@gmail.com",
                  subject: "Танд тестийн урилга ирлээ",
                  type: "Урилга",
                  status: "Амжилтгүй",
                  action: "Дахин илгээх",
                },
              ]}
            ></Table>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default Email;
