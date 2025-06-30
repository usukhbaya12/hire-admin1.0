import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Table,
  DatePicker,
  Button,
  message,
  Tooltip,
  Spin,
  Tag,
  ConfigProvider,
  Divider,
} from "antd";
import { ebarimt, getPaymentHistory, sendEbarimt } from "@/app/api/constant";
import dayjs from "dayjs";
import mnMN from "antd/lib/locale/mn_MN";
import {
  Buildings2BoldDuotone,
  CalendarBoldDuotone,
  GiftLineDuotone,
  MoneyBagBoldDuotone,
  ArrowDownBoldDuotone,
  Wallet2BoldDuotone,
  HandMoneyBoldDuotone,
  QrCodeBoldDuotone,
  DatabaseBoldDuotone,
} from "solar-icons";
import { customLocale } from "@/utils/values";
import { LoadingOutlined } from "@ant-design/icons";
import EBarimtModal from "./modals/EBarimt";

const METHODS = {
  BONUS: 1,
  QPAY: 2,
  BANK: 3,
  WITHDRAW: 4,
};

const methodLabels = {
  [METHODS.BONUS]: "Урамшуулал",
  [METHODS.QPAY]: "QPay",
  [METHODS.BANK]: "Дансаар",
};

const ROLES = {
  USER: 20,
  ORGANIZATION: 30,
};

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [sortedInfo, setSortedInfo] = useState({
    columnKey: "createdAt",
    order: "descend",
  });
  const [filteredInfo, setFilteredInfo] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    role: 0,
    assessmentId: 0,
    payment: 0,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const [barimtVisible, setBarimtVisible] = useState(false);
  const [barimtLoading, setBarimtLoading] = useState(false);
  const [barimtData, setBarimtData] = useState(null);
  const [selectedAssessmentName, setSelectedAssessmentName] = useState("");
  const [selectedBarimtId, setSelectedBarimtId] = useState(null);
  const [sendEbarimtLoading, setSendEbarimtLoading] = useState(false);

  const totals = useMemo(() => {
    if (!data || !data.totalPrice)
      return { income: 0, total: 0, balance: 0, byMethod: {} };

    const methodTotals = {
      [METHODS.BONUS]: 0,
      [METHODS.QPAY]: 0,
      [METHODS.BANK]: 0,
      [METHODS.WITHDRAW]: 0,
    };

    data.totalPrice.forEach((item) => {
      if (item && item.method !== undefined) {
        methodTotals[item.method] = parseInt(item.total || 0, 10);
      }
    });

    const income =
      (methodTotals[METHODS.QPAY] || 0) + (methodTotals[METHODS.BANK] || 0);

    const total = income + (methodTotals[METHODS.BONUS] || 0);

    const balance =
      (methodTotals[METHODS.BONUS] || 0) +
      (methodTotals[METHODS.BANK] || 0) +
      (methodTotals[METHODS.WITHDRAW] || 0);

    return {
      income,
      total,
      balance,
      byMethod: methodTotals,
    };
  }, [data]);

  const fetchPaymentData = async (
    page = 1,
    size = pageSize,
    filters = activeFilters
  ) => {
    setLoading(true);
    try {
      const startDateStr = startDate ? startDate.format("YYYY-MM-DD") : null;

      const adjustedEndDate = endDate ? endDate.add(1, "day") : null;
      const endDateStr = adjustedEndDate
        ? adjustedEndDate.format("YYYY-MM-DD")
        : null;

      const response = await getPaymentHistory(
        page,
        size,
        startDateStr,
        endDateStr,
        filters.role,
        filters.assessmentId,
        filters.payment
      );

      if (response.success) {
        console.log("API Response:", {
          requestedPageSize: size,
          returnedDataLength: response.data.data?.length || 0,
          totalCount: response.data.total || 0,
          actualData: response.data.data,
        });

        setData(response.data);
        setPayments(response.data.data || []);
        setTotalCount(response.data.total || 0);
        setCurrentPage(page);
      } else {
        messageApi.error(
          response.message || "Сервертэй холбогдоход алдаа гарлаа."
        );
      }
    } catch (error) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData(1, pageSize);
  }, []);

  const handleRowClick = async (record) => {
    if (!record.message) return;
    const match = record.message.match(/\d+/);
    const id = match ? parseInt(match[0], 10) : null;
    if (!id) {
      messageApi.error("ID олдсонгүй.");
      return;
    }
    setSelectedAssessmentName(record.assessment?.name || "");
    setSelectedBarimtId(id); // <-- set the extracted id
    setBarimtVisible(true);
    setBarimtLoading(true);
    setBarimtData(null);
    try {
      const res = await ebarimt(id);
      setBarimtData(res.data || res);
    } catch (err) {
      setBarimtData(null);
      messageApi.error("Баримтын мэдээлэл авахад алдаа гарлаа.");
    } finally {
      setBarimtLoading(false);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const applyDateFilters = () => {
    fetchPaymentData(1, pageSize, activeFilters);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);

    // Convert antd filter values to API filter parameters
    const newFilters = {
      role: 0,
      assessmentId: 0,
      payment: 0,
    };

    // Extract role filter
    if (filters.type && filters.type.length) {
      newFilters.role = filters.type[0]; // Use the first selected role
    }

    // Extract assessment filter
    if (filters.assessment && filters.assessment.length) {
      newFilters.assessmentId = filters.assessment[0]; // Use the first selected assessment
    }

    // Extract payment method filter
    if (filters.method && filters.method.length) {
      newFilters.payment = filters.method[0]; // Use the first selected payment method
    }

    // Update active filters
    setActiveFilters(newFilters);

    // Check if pagination has changed
    const paginationChanged =
      pagination.current !== currentPage || pagination.pageSize !== pageSize;

    // Fetch new data with filters and pagination
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }

    // Always fetch when filters change or pagination changes
    fetchPaymentData(pagination.current, pagination.pageSize, newFilters);
  };

  const handleSendEbarimt = async () => {
    setSendEbarimtLoading(true);
    try {
      const res = await sendEbarimt();
      if (res && res.success) {
        messageApi.success("Амжилттай илгээлээ.");
      } else {
        messageApi.error(res?.message || "ebarimt руу илгээхэд алдаа гарлаа.");
      }
    } catch (e) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setSendEbarimtLoading(false);
    }
  };

  const assessmentOptions = useMemo(() => {
    const uniqueAssessments = new Map();

    payments.forEach((payment) => {
      if (payment.assessment?.name) {
        const key = payment.assessment.id;
        if (!uniqueAssessments.has(key)) {
          uniqueAssessments.set(key, {
            text: payment.assessment.name,
            value: payment.assessment.id,
          });
        }
      }
    });

    return Array.from(uniqueAssessments.values());
  }, [payments]);

  const columns = [
    {
      title: "Худалдан авагч",
      dataIndex: ["user", "firstname"],
      key: "user",
      render: (_, record) => {
        const isOrganization = record.user.role === ROLES.ORGANIZATION;

        if (isOrganization) {
          return (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/50 to-blue-700/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative min-w-10 min-h-10 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full flex items-center justify-center border border-blue-500/10">
                  <Buildings2BoldDuotone className="text-blue-600" width={24} />
                </div>
              </div>
              <div className="leading-4">
                <div className="font-semibold">
                  {record.user?.organizationName || "-"}
                </div>
                <div className="text-gray-700 text-sm">
                  {record.user?.organizationRegisterNumber || "-"}
                </div>
              </div>
            </div>
          );
        } else {
          const firstName = record.user?.firstname || "";
          const lastName = record.user?.lastname || "";
          const fullName = `${firstName} ${lastName}`;
          const firstChar = firstName ? firstName[0] : "";

          return (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative min-w-10 min-h-10 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                  <div className="text-base font-bold uppercase bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                    {firstChar}
                  </div>
                </div>
              </div>
              <div className="leading-4">
                <div className="font-semibold">{fullName}</div>
                <div className="text-gray-700 text-sm">
                  {record.user?.email || "-"}
                </div>
              </div>
            </div>
          );
        }
      },
    },
    {
      title: "Төрөл",
      dataIndex: ["user", "role"],
      key: "type",
      render: (role) => (
        <Tag
          color={role === ROLES.ORGANIZATION ? "blue" : "green"}
          className="rounded-full! font-semibold px-2.5! shadow"
        >
          {role === ROLES.ORGANIZATION ? "Байгууллага" : "Хэрэглэгч"}
        </Tag>
      ),
      filters: [
        { text: "Байгууллага", value: ROLES.ORGANIZATION },
        { text: "Хэрэглэгч", value: ROLES.USER },
      ],
      filteredValue: filteredInfo.type || null,
      // Client-side filtering disabled as we're using server-side filtering
      // onFilter: (value, record) => record.user.role === value,
    },
    {
      title: "Админ",
      dataIndex: "charger",
      key: "charger",
      render: (charger) => {
        if (!charger) return <span>-</span>;
        return (
          <Tooltip title={charger?.email}>
            <span className="font-semibold">{charger?.firstname || "-"}</span>
          </Tooltip>
        );
      },
      sorter: (a, b) => {
        if (a.charger && b.charger) {
          return (a.charger?.firstname || "").localeCompare(
            b.charger?.firstname || ""
          );
        }
        return 0;
      },
      sortOrder: sortedInfo.columnKey === "charger" ? sortedInfo.order : null,
    },
    {
      title: "Тестийн нэр",
      dataIndex: ["assessment", "name"],
      key: "assessment",
      filters: assessmentOptions,
      filteredValue: filteredInfo.assessment || null,
      // Client-side filtering disabled as we're using server-side filtering
      // onFilter: (value, record) => record.assessment?.id === value,
      render: (text) => (
        <span className="font-bold text-main">{text || "-"}</span>
      ),
      sorter: (a, b) =>
        (a.assessment?.name || "").localeCompare(b.assessment?.name || ""),
      sortOrder:
        sortedInfo.columnKey === "assessment" ? sortedInfo.order : null,
    },
    {
      title: "Үнийн дүн",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <span
          className={
            price < 0 ? "text-red-500" : "text-green-700 font-semibold"
          }
        >
          {parseInt(price || 0).toLocaleString()}
          <span className="text-[13px]">₮</span>
        </span>
      ),
      sorter: (a, b) => (a.totalPrice || 0) - (b.totalPrice || 0),
      sortOrder:
        sortedInfo.columnKey === "totalPrice" ? sortedInfo.order : null,
    },
    {
      title: "Төлбөрийн хэлбэр",
      dataIndex: "method",
      key: "method",
      render: (method) => {
        const displayMethod = method || METHODS.QPAY;
        return (
          <div className="flex items-center gap-2">
            {displayMethod === METHODS.BONUS && (
              <div className="flex items-center gap-2">
                <GiftLineDuotone width={16} className="text-green-500" />
                {methodLabels[METHODS.BONUS]}
              </div>
            )}
            {displayMethod === METHODS.QPAY && (
              <div>
                <img src="/qpay.png" alt="qpay" width="40px"></img>
              </div>
            )}
            {displayMethod === METHODS.BANK && (
              <div className="flex items-center gap-2">
                <Buildings2BoldDuotone width={16} className="text-blue-500" />
                {methodLabels[METHODS.BANK]}
              </div>
            )}
          </div>
        );
      },
      filters: [
        { text: methodLabels[METHODS.BONUS], value: METHODS.BONUS },
        { text: methodLabels[METHODS.QPAY], value: METHODS.QPAY },
        { text: methodLabels[METHODS.BANK], value: METHODS.BANK },
      ],
      filteredValue: filteredInfo.method || null,
      // Client-side filtering disabled as we're using server-side filtering
      // onFilter: (value, record) => {
      //   const recordMethod = record.method || METHODS.QPAY;
      //   return recordMethod === value;
      // },
    },
    {
      title: "Огноо",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      sortOrder:
        sortedInfo.columnKey === "createdAt" ? sortedInfo.order : "descend",
      defaultSortOrder: "descend",
    },
  ];

  return (
    <ConfigProvider locale={mnMN}>
      <div className="px-5 py-6">
        {contextHolder}
        <EBarimtModal
          visible={barimtVisible}
          onClose={() => setBarimtVisible(false)}
          loading2={barimtLoading}
          data={barimtData}
          assessment={selectedAssessmentName}
          barimtId={selectedBarimtId}
        />
        <div className="flex justify-between items-center mb-4">
          <div className="text-base font-bold flex items-center gap-2">
            <MoneyBagBoldDuotone className="text-main" />
            Төлбөр
          </div>
          <div className="flex justify-end items-center flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <DatePicker
                  value={startDate}
                  onChange={handleStartDateChange}
                  format="YYYY-MM-DD"
                  placeholder="Эхлэх огноо"
                />
              </div>
              <div className="flex items-center gap-2">
                <DatePicker
                  value={endDate}
                  onChange={handleEndDateChange}
                  format="YYYY-MM-DD"
                  placeholder="Дуусах огноо"
                  disabledDate={(current) =>
                    startDate && current && current < startDate
                  }
                />
              </div>
              <Button onClick={applyDateFilters} className="back-btn">
                <CalendarBoldDuotone width={16} />
                Хайх
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-6 flex-1">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-full mr-4">
                <MoneyBagBoldDuotone width={28} className="text-blue-600" />
              </div>
              <div>
                <div className="text-gray-500 font-medium">Нийт дүн</div>
                <div className="text-xl font-bold text-blue-800">
                  {totals.total.toLocaleString()}
                  <span className="text-sm font-normal ml-1">₮</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-6 flex-1">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-full mr-4">
                <HandMoneyBoldDuotone width={28} className="text-green-600" />
              </div>
              <div>
                <div className="text-gray-500 font-medium">Нийт орлого</div>
                <div className="text-xl font-bold text-green-700">
                  {totals.income.toLocaleString()}
                  <span className="text-sm font-normal ml-1">₮</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-6 flex-1">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <div>
                  <div className="text-blue-500 text-sm flex items-center font-bold gap-1">
                    <Buildings2BoldDuotone width={16} />
                    {methodLabels[METHODS.BANK]}
                  </div>
                  <div className="font-bold text-blue-900">
                    {(totals.byMethod[METHODS.BANK] || 0).toLocaleString()}
                    <span className="text-xs ml-1">₮</span>
                  </div>
                </div>
              </div>
              <Divider type="vertical" />

              <div className="flex items-center">
                <div>
                  <div className="text-gray-900 text-sm flex items-center font-bold gap-1">
                    <QrCodeBoldDuotone width={16} className="text-gray-900" />
                    {methodLabels[METHODS.QPAY]}
                  </div>
                  <div className="font-bold text-gray-900">
                    {(totals.byMethod[METHODS.QPAY] || 0).toLocaleString()}
                    <span className="text-xs ml-1">₮</span>
                  </div>
                </div>
              </div>
              <Divider type="vertical" />

              <div className="flex items-center">
                <div>
                  <div className="text-green-500 text-sm flex items-center font-bold gap-1">
                    <GiftLineDuotone width={16} className="text-green-500" />
                    {methodLabels[METHODS.BONUS]}
                  </div>
                  <div className="font-bold text-green-800">
                    {(totals.byMethod[METHODS.BONUS] || 0).toLocaleString()}
                    <span className="text-xs ml-1">₮</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-6 flex-1">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-full mr-4">
                <Wallet2BoldDuotone width={28} className="text-purple-600" />
              </div>
              <div>
                <div className="text-gray-500 font-medium">Хэтэвчинд</div>
                <div className="text-xl font-bold text-purple-700">
                  {totals.balance.toLocaleString()}
                  <span className="text-sm font-normal ml-1">₮</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pb-4">
          <Button
            loading={sendEbarimtLoading}
            onClick={handleSendEbarimt}
            className="the-btn pl-2 flex items-center !text-sm"
          >
            <img src="/ebarimt.png" width={20}></img>ebarimt руу мэдээлэл илгээх
          </Button>
          <div className="justify-end text-gray-500 font-bold text-sm flex items-center gap-1">
            <DatabaseBoldDuotone width={14} />
            {totalCount} өгөгдөл олдсон
          </div>
        </div>

        <Table
          columns={columns}
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
          dataSource={payments}
          locale={customLocale}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onShowSizeChange: (current, size) => {
              console.log(`Size changed to ${size}`);
              setPageSize(size);
              fetchPaymentData(current, size);
            },
          }}
          onChange={handleTableChange}
          rowKey={(record) => record.id}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </ConfigProvider>
  );
};

export default Payment;
