import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Input,
  message,
  Button,
  Spin,
  Progress,
  DatePicker,
  Tooltip,
  ConfigProvider,
} from "antd";
import {
  ClipboardTextBoldDuotone,
  FolderFavouriteBookmarkBoldDuotone,
  CalendarBoldDuotone,
  DownloadBoldDuotone,
  FilterBoldDuotone,
} from "solar-icons";
import { getAssessmentExams } from "@/app/api/constant";
import dayjs from "dayjs";
import mnMN from "antd/lib/locale/mn_MN";
import * as XLSX from "xlsx";
import { customLocale } from "@/utils/values";
import { getReport } from "@/app/api/assessment";
import { LoadingOutlined } from "@ant-design/icons";

const { Search } = Input;

const Results = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [sortedInfo, setSortedInfo] = useState({
    columnKey: "userStartDate",
    order: "descend",
  });
  const [filteredInfo, setFilteredInfo] = useState({});
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
  const [endDate, setEndDate] = useState(dayjs());

  const fetchResults = async (page = 1, size = pageSize) => {
    try {
      setLoading(true);

      const startDateStr = startDate ? startDate.format("YYYY-MM-DD") : null;

      const adjustedEndDate = endDate ? endDate.add(1, "day") : null;
      const endDateStr = adjustedEndDate
        ? adjustedEndDate.format("YYYY-MM-DD")
        : null;

      const response = await getAssessmentExams(
        selectedAssessment || 0,
        size,
        page,
        searchTerm,
        startDateStr,
        endDateStr
      );

      if (response.success) {
        setExamData(response.data.data || []);
        setTotalCount(response.data.total || 0);
        setCurrentPage(page);
      } else {
        messageApi.error(response.message || "Үр дүн авахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(1, pageSize);
  }, []);

  console.log("hh", examData);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchResults(1, pageSize);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const applyDateFilters = () => {
    setCurrentPage(1);
    fetchResults(1, pageSize);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const newSortedInfo =
      Object.keys(sorter).length > 0
        ? sorter
        : { columnKey: "userStartDate", order: "descend" };

    setSortedInfo(newSortedInfo);
    setFilteredInfo(filters);

    const paginationChanged =
      pagination.current !== currentPage || pagination.pageSize !== pageSize;

    if (paginationChanged) {
      if (pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize);
      }

      setCurrentPage(pagination.current);
      fetchResults(pagination.current, pagination.pageSize);
    }

    if (filters.assessmentName && filters.assessmentName.length > 0) {
      const assessmentId = filters.assessmentName[0];
      setSelectedAssessment(assessmentId);
      fetchResults(1, pagination.pageSize);
    } else if (
      (!filters.assessmentName || filters.assessmentName.length === 0) &&
      selectedAssessment !== null
    ) {
      setSelectedAssessment(null);
      fetchResults(1, pagination.pageSize);
    }
  };

  const clearFilters = () => {
    setFilteredInfo({});
    setSortedInfo({ columnKey: "userStartDate", order: "descend" });
    setStartDate(dayjs().subtract(1, "month"));
    setEndDate(dayjs());
    setSelectedAssessment(null);
    setSearchTerm("");
    setCurrentPage(1);

    setTimeout(() => {
      fetchResults(1, pageSize);
    }, 100);
  };

  const clearSorters = () => {
    setSortedInfo({ columnKey: "userStartDate", order: "descend" });
  };

  const exportToExcel = () => {
    if (examData.length === 0) {
      messageApi.warning("Экспортлох өгөгдөл олдсонгүй");
      return;
    }

    try {
      const exportData = examData.map((record, index) => ({
        "№": index + 1,
        "Шалгуулагчийн нэр": `${record.firstname} ${record.lastname}`,
        "Тестийн нэр": record.assessment.name,
        "И-мейл хаяг": record.email,
        "Эхэлсэн огноо": new Date(record.userStartDate).toLocaleString(),
        "Дууссан огноо": record.userEndDate
          ? new Date(record.userEndDate).toLocaleString()
          : "-",
        Байгууллага: record.buyer?.organizationName || "-",
        Төлөв: record.userEndDate ? "Дууссан" : "Дуусаагүй",
        "Үр дүн": record.result
          ? record.assessment.report === 10
            ? `${(
                (record.result.point / record.assessment.total) *
                100
              ).toFixed(1)}%`
            : record.result.value
          : record.result?.value || "-",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      const colWidths = [
        { wch: 5 }, // №
        { wch: 25 }, // Шалгуулагчийн нэр
        { wch: 25 }, // Тестийн нэр
        { wch: 25 }, // И-мейл хаяг
        { wch: 20 }, // Эхэлсэн огноо
        { wch: 20 }, // Дууссан огноо
        { wch: 25 }, // Байгууллага
        { wch: 12 }, // Төлөв
        { wch: 12 }, // Үр дүн
      ];
      worksheet["!cols"] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Үр дүн");

      const date = new Date().toISOString().slice(0, 10);
      const fileName = `Тест_үр_дүн_${date}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      messageApi.success("Excel файл амжилттай татагдлаа");
    } catch (error) {
      console.error("Excel export error:", error);
      messageApi.error("Excel файл үүсгэхэд алдаа гарлаа");
    }
  };

  const assessmentOptions = useMemo(() => {
    const uniqueAssessments = new Map();

    examData.forEach((exam) => {
      if (exam.assessment && !uniqueAssessments.has(exam.assessment.id)) {
        uniqueAssessments.set(exam.assessment.id, {
          text: exam.assessment.name,
          value: exam.assessment.id,
        });
      }
    });

    return Array.from(uniqueAssessments.values());
  }, [examData]);

  const organizationOptions = useMemo(() => {
    const uniqueOrgs = new Map();

    examData.forEach((exam) => {
      if (
        exam.buyer?.organizationName &&
        !uniqueOrgs.has(exam.buyer.organizationName)
      ) {
        uniqueOrgs.set(exam.buyer.organizationName, {
          text: exam.buyer.organizationName,
          value: exam.buyer.organizationName,
        });
      }
    });

    return Array.from(uniqueOrgs.values());
  }, [examData]);

  const columns = [
    {
      title: "№",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 60,
    },
    {
      title: "Шалгуулагчийн нэр",
      key: "name",
      render: (_, record) => {
        const firstName = record.firstname || "";
        const lastName = record.lastname || "";
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
              <div className="text-gray-700 text-sm">{record.email || "-"}</div>
            </div>
          </div>
        );
      },
      sorter: (a, b) =>
        `${a.firstname} ${a.lastname}`.localeCompare(
          `${b.firstname} ${b.lastname}`
        ),
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
    },
    {
      title: "Тестийн нэр",
      dataIndex: ["assessment", "name"],
      key: "assessmentName",
      render: (_, record) => (
        <div className="font-bold text-main">{record.assessment.name}</div>
      ),
      filters: assessmentOptions,
      filteredValue: filteredInfo.assessmentName || null,
      onFilter: (value, record) => record.assessment.id === value,
      filterMode: "radio",
      sorter: (a, b) => a.assessment.name.localeCompare(b.assessment.name),
      sortOrder: sortedInfo.columnKey === "assessmentName" && sortedInfo.order,
    },
    {
      title: "Эхэлсэн огноо",
      dataIndex: "userStartDate",
      key: "userStartDate",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.userStartDate) - new Date(b.userStartDate),
      sortOrder:
        sortedInfo.columnKey === "userStartDate" ? sortedInfo.order : "descend",
      defaultSortOrder: "descend",
    },
    {
      title: "Дууссан огноо",
      dataIndex: "userEndDate",
      key: "userEndDate",
      render: (date) => (date ? new Date(date).toLocaleString() : "-"),
      sorter: (a, b) => {
        if (!a.userEndDate) return 1;
        if (!b.userEndDate) return -1;
        return new Date(a.userEndDate) - new Date(b.userEndDate);
      },
      sortOrder: sortedInfo.columnKey === "userEndDate" && sortedInfo.order,
    },
    {
      title: "Байгууллага",
      dataIndex: ["buyer", "organizationName"],
      key: "organization",
      render: (text, record) => {
        if (!record.buyer?.organizationName) return "-";
        return (
          <div className="font-semibold">{record.buyer?.organizationName}</div>
        );
      },
      filters: organizationOptions,
      filteredValue: filteredInfo.organization || null,
      onFilter: (value, record) =>
        record.buyer && record.buyer.organizationName === value,
    },
    {
      title: "Төлөв",
      key: "status",
      filters: [
        { text: "Дууссан", value: "finished" },
        { text: "Дуусаагүй", value: "unfinished" },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => {
        const hasFinished = !!record.userEndDate;
        return value === "finished" ? hasFinished : !hasFinished;
      },
      render: (_, record) => (
        <span
          className={`${
            record.userEndDate
              ? "text-center border border-green-600 p-[3px] px-2.5 rounded-xl text-green-700 bg-green-500/40 font-semibold text-[13px]"
              : "text-center border border-orange-600 p-[3px] px-2.5 rounded-xl text-orange-600 bg-orange-400/40 font-semibold text-[13px]"
          }`}
        >
          {record.userEndDate ? "Дууссан" : "Дуусаагүй"}
        </span>
      ),
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      render: (_, record) => {
        if (!record.userEndDate) return "-";

        if (!record.result) return "-";

        if (record.assessment.report === 10) {
          const score =
            typeof record.result.point === "number" ? record.result.point : 0;
          const totalPoints = record.result.total || 1;
          const percent = ((score / totalPoints) * 100).toFixed(1);

          return (
            <div className="flex items-center gap-1">
              <Progress
                percent={percent}
                strokeColor={{
                  from: "#ED1C45",
                  to: "#F36421",
                }}
              />
              <span className="text-gray-600">
                ({score}/{totalPoints})
              </span>
            </div>
          );
        }

        if (record.assessment.report === 20) {
          if (record.result && typeof record.result === "object") {
            return (
              <div className="flex items-center">
                <div>{record.result.result || "-"}</div>
                <span className="px-1">•</span>
                <div>{record.result.value || "-"}</div>
              </div>
            );
          }

          if (typeof record.result === "string") {
            return <div className="text-main font-bold">{record.result}</div>;
          }

          return "-";
        }

        if (record.assessment.report === 40) {
          if (record.result && typeof record.result === "object") {
            return <div>{record.result.result || "-"}</div>;
          }
        }

        return typeof record.result === "string" ? record.result : "-";
      },
      width: "180px",
    },
    {
      title: "Тайлан",
      key: "action",
      render: (_, record) =>
        record.userEndDate && (
          <Tooltip title="Тайлан татах">
            <button
              onClick={() => generatePDF(record.code)}
              className="mx-auto text-main hover:text-secondary flex items-center gap-2 font-semibold"
            >
              <ClipboardTextBoldDuotone width={18} />
              Татах
            </button>
          </Tooltip>
        ),
      align: "center",
    },
  ];

  const generatePDF = async (code) => {
    try {
      setLoading(true);
      const res = await getReport(code);

      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report_${code}.pdf`);
        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        messageApi.error("Тайлан татахад алдаа гарлаа.");
      }
    } catch (error) {
      console.error("GET / Aлдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const isFiltered =
    selectedAssessment ||
    startDate ||
    endDate ||
    searchTerm ||
    Object.keys(filteredInfo).length > 0;

  return (
    <ConfigProvider locale={mnMN}>
      <div className="px-5 py-6">
        {contextHolder}
        <div className="flex justify-between items-center mb-4">
          <div className="text-base font-bold flex items-center gap-2">
            <FolderFavouriteBookmarkBoldDuotone className="text-main" />
            Үр дүн
          </div>
          <div className="flex gap-2">
            <DatePicker
              onChange={handleStartDateChange}
              placeholder="Эхлэх огноо"
              style={{ width: 150 }}
              value={startDate}
            />
            <DatePicker
              onChange={handleEndDateChange}
              placeholder="Дуусах огноо"
              style={{ width: 150 }}
              value={endDate}
              disabledDate={(current) =>
                startDate && current && current < startDate
              }
            />
            <Button onClick={applyDateFilters} className="back-btn">
              <CalendarBoldDuotone width={16} />
              Хайх
            </Button>
            <div>
              <Search
                placeholder="И-мейл хаягаар хайх"
                allowClear
                onSearch={handleSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                enterButton
                value={searchTerm}
              />
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              className="back-btn"
              onClick={clearFilters}
              disabled={!isFiltered}
            >
              <FilterBoldDuotone width={16} height={16} />
              Шүүлтүүр арилгах
            </Button>
            <Button
              onClick={clearSorters}
              className="back-btn"
              disabled={Object.keys(sortedInfo).length === 0}
            >
              <FilterBoldDuotone width={16} height={16} />
              Эрэмбэлэлт цуцлах
            </Button>
          </div>
          <div>
            <Button className="the-btn" onClick={exportToExcel}>
              <DownloadBoldDuotone width={16} />
              Excel татах
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={examData}
          locale={customLocale}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onShowSizeChange: (current, size) => {
              setPageSize(size);
              fetchResults(current, size);
            },
          }}
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
          rowKey="id"
          onChange={handleTableChange}
        />
      </div>
    </ConfigProvider>
  );
};

export default Results;
