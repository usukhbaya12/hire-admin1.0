"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Input, Button, Table, Dropdown, message, Select, Spin } from "antd";
import { PlusIcon, MoreIcon, DropdownIcon } from "./Icons";
import { useRouter } from "next/navigation";
import NewAssessment from "./modals/New";
import InfoModal from "./modals/Info";
import {
  createAssessment,
  getAssessmentCategory,
  getAssessments,
  deleteAssessmentById,
  updateAssessmentById,
} from "@/app/api/assessment";
import { customLocale } from "@/utils/values";
import {
  ChartSquareLineDuotone,
  CheckCircleBoldDuotone,
  CopyBoldDuotone,
  EyeBoldDuotone,
  ListCheckLineDuotone,
  MagniferLineDuotone,
  TrashBin2BoldDuotone,
} from "solar-icons";
import { LoadingOutlined } from "@ant-design/icons";

const ASSESSMENT_TYPE = {
  TEST: 10,
  SURVEY: 20,
};

const STATUS = {
  OPEN: 10,
  ARCHIVED: 20,
  FEATURED: 30,
};

const TYPE_OPTIONS = [
  {
    label: (
      <div className="flex gap-2 items-center">
        <span className="text-main">
          <ChartSquareLineDuotone width={18} />
        </span>
        <span>Үнэлгээ</span>
      </div>
    ),
    value: ASSESSMENT_TYPE.SURVEY,
  },
  {
    label: (
      <div className="flex gap-2 items-center">
        <span className="text-main">
          <ListCheckLineDuotone width={18} />
        </span>
        <span>Зөв хариулттай тест</span>
      </div>
    ),
    value: ASSESSMENT_TYPE.TEST,
  },
];

const STATUS_OPTIONS = [
  { text: "Нээлттэй", value: STATUS.OPEN },
  { text: "Архив", value: STATUS.ARCHIVED },
  { text: "Онцлох", value: STATUS.FEATURED },
];

const renderStatus = (status) => {
  switch (status) {
    case STATUS.OPEN:
      return (
        <div className="text-center border border-main p-1 px-3 rounded-full text-main bg-bg20 font-semibold text-sm shadow shadow-slate-200">
          Нээлттэй
        </div>
      );
    case STATUS.ARCHIVED:
      return (
        <div className="text-center border border-gray-600 p-1 px-3 rounded-full text-gray-600 bg-gray-100 font-semibold text-sm shadow shadow-slate-200">
          Архив
        </div>
      );
    case STATUS.FEATURED:
      return (
        <div className="text-center border border-yellow-500 p-1 px-3 rounded-full text-yellow-700 bg-yellow-200 font-semibold text-sm shadow shadow-slate-200">
          Онцлох
        </div>
      );
    default:
      return null;
  }
};

const formatUserName = (user) => {
  if (!user?.createdUser) return null;
  const firstName = user.createdUser.firstname;
  const lastInitial = user.createdUser.lastname?.charAt(0) || "";
  return user.createdUser.lastname ? `${firstName}.${lastInitial}` : firstName;
};

const Assessments = ({ initialAssessments, initialCategories }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [assessments, setAssessments] = useState(initialAssessments);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null });
  const [messageApi, contextHolder] = message.useMessage();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const refreshData = useCallback(async () => {
    setIsActionLoading(true); // Use action loading state
    try {
      // Example: Re-fetch assessments only
      const assessmentsRes = await getAssessments();
      if (assessmentsRes.success) {
        const sortedAssessments = (assessmentsRes.data?.res || []).sort(
          (a, b) =>
            new Date(b.data.createdAt).getTime() -
            new Date(a.data.createdAt).getTime()
        );
        setAssessments(sortedAssessments);
      } else {
        messageApi.error(assessmentsRes.message || "Алдаа гарлаа.");
      }
      // Optionally re-fetch categories if they can change
    } catch (error) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setIsActionLoading(false);
    }
  }, [messageApi]);

  const refreshCategories = useCallback(async () => {
    // No need for loading state here unless you want one specifically for category refresh
    try {
      const categoriesRes = await getAssessmentCategory();
      if (categoriesRes.success) {
        setCategories(categoriesRes.data || []); // Update the state
      } else {
        messageApi.error(
          categoriesRes.message || "Ангилал дахин татахад алдаа гарлаа."
        );
      }
    } catch (error) {
      console.error("Refresh categories error:", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    }
  }, [messageApi]);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      const matchesSearch = searchText
        ? item.data.name.toLowerCase().includes(searchText.toLowerCase())
        : true;
      const matchesType =
        typeFilter !== null ? item.data.type === typeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [assessments, searchText, typeFilter]);

  const showModal = useCallback(() => setIsModalOpen(true), []);
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleOk = useCallback(
    async (formData) => {
      setIsActionLoading(true);
      const answerCategories = (formData.categories || []).map(
        (categoryName) => ({
          name: categoryName,
          description: "",
        })
      );
      try {
        const response = await createAssessment({
          category: formData.assessmentCategory,
          name: formData.testName,
          description: "",
          usage: "",
          measure: "",
          questionCount: 0,
          price: 0,
          duration: 0,
          type: formData.type,
          answerCategories: answerCategories,
          status: STATUS.ARCHIVED,
        });

        if (response.success && response.data?.id) {
          messageApi.success("Тест амжилттай үүссэн.");
          setIsModalOpen(false);

          router.push(`/test/${response.data.id}`);
        } else {
          messageApi.error(response.message || "Тест үүсгэхэд алдаа гарлаа.");
        }
      } catch (error) {
        console.error("Create assessment error:", error);
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
      } finally {
        setIsActionLoading(false);
      }
    },
    [router, messageApi]
  );

  const handleStatusChange = useCallback(
    async (record, newStatus) => {
      if (!record?.data?.id) return;
      setIsActionLoading(true);

      try {
        const response = await updateAssessmentById(record.data.id, {
          status: newStatus,
        });
        if (response.success) {
          messageApi.success("Төлөв амжилттай өөрчлөгдлөө.");
          refreshData();
        } else {
          messageApi.error(response.message || "Төлөв өөрчлөхөд алдаа гарлаа.");
        }
      } catch (error) {
        console.error("Update status error:", error);
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
      } finally {
        setIsActionLoading(false);
      }
    },
    [messageApi]
  );

  const handleDelete = useCallback(
    async (record) => {
      if (!record?.data?.id) return;
      setIsActionLoading(true);

      try {
        const response = await deleteAssessmentById(record.data.id);
        if (response.success) {
          messageApi.info("Тест устсан.");
          setDeleteModal({ open: false, record: null });
          await refreshData();
        } else {
          messageApi.error(response.message || "Тест устгахад алдаа гарлаа.");
        }
      } catch (error) {
        console.error("Delete assessment error:", error);
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
      } finally {
        setIsActionLoading(false);
      }
    },
    [messageApi, refreshData]
  );

  const closeDeleteModal = useCallback(
    () => setDeleteModal({ open: false, record: null }),
    []
  );
  const openDeleteModal = useCallback(
    (record) => setDeleteModal({ open: true, record }),
    []
  );

  const getActionMenu = useCallback(
    (record) => ({
      items: [
        {
          key: "status",
          expandIcon: (
            <DropdownIcon width={13} rotate={-90} color={"#94a3b8"} />
          ),
          label: (
            <div className="flex items-center gap-2 pr-3">
              <CheckCircleBoldDuotone width={18} /> Төлөв өөрчлөх
            </div>
          ),
          onClick: (e) => e.domEvent.stopPropagation(),
          children: [
            {
              key: `status-${STATUS.OPEN}`,
              label: (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-main" />
                  <span className="font-medium">Нээлттэй</span>
                </div>
              ),
              onClick: (e) => {
                e.domEvent.stopPropagation();
                handleStatusChange(record, STATUS.OPEN);
              },
              disabled: record.data.status === STATUS.OPEN,
            },
            {
              key: `status-${STATUS.ARCHIVED}`,
              label: (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                  <span className="font-medium">Архив</span>
                </div>
              ),
              onClick: (e) => {
                e.domEvent.stopPropagation();
                handleStatusChange(record, STATUS.ARCHIVED);
              },
              disabled: record.data.status === STATUS.ARCHIVED,
            },
            {
              key: `status-${STATUS.FEATURED}`,
              label: (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="font-medium">Онцлох</span>
                </div>
              ),
              onClick: (e) => {
                e.domEvent.stopPropagation();
                handleStatusChange(record, STATUS.FEATURED);
              },
              disabled: record.data.status === STATUS.FEATURED,
            },
          ],
        },
        {
          key: "preview",
          label: (
            <div className="flex items-center gap-2">
              <EyeBoldDuotone width={18} /> Урьдчилж харах
            </div>
          ),
          onClick: (e) => {
            e.domEvent.stopPropagation();
            window.open(
              `/preview/${record.data.id}`,
              "_blank",
              "noopener,noreferrer"
            );
          },
        },
        {
          key: "copy",
          label: (
            <div className="flex items-center gap-2">
              <CopyBoldDuotone width={18} /> Хувилах
            </div>
          ),
          onClick: (e) => e.domEvent.stopPropagation(),
          disabled: true,
        },
        {
          key: "delete",
          label: (
            <div className="flex items-center gap-2">
              <TrashBin2BoldDuotone width={18} /> Устгах
            </div>
          ),
          danger: true,
          onClick: (e) => {
            e.domEvent.stopPropagation();
            openDeleteModal(record);
          },
        },
      ],
    }),
    [handleStatusChange, openDeleteModal]
  );

  const categoryFilters = useMemo(() => {
    return categories
      .filter((cat) => cat.parent === null)
      .map((mainCat) => ({
        text: mainCat.name,
        value: mainCat.id,
        children: (mainCat.subcategories || []).map((subCat) => ({
          text: subCat.name,
          value: subCat.id,
        })),
      }));
  }, [categories]);

  const userFilters = useMemo(() => {
    const users = new Map();
    assessments.forEach((item) => {
      if (item.user?.createdUser?.id && !users.has(item.user.createdUser.id)) {
        const userName = formatUserName(item.user);
        if (userName) {
          users.set(item.user.createdUser.id, {
            text: userName,
            value: item.user.createdUser.id,
          });
        }
      }
    });
    return Array.from(users.values());
  }, [assessments]);

  const columns = useMemo(
    () => [
      {
        title: "Төрөл",
        dataIndex: ["data", "type"],
        key: "type",
        width: 60,
        align: "center",
        render: (type) => (
          <span className="text-main">
            {type === ASSESSMENT_TYPE.SURVEY ? (
              <ChartSquareLineDuotone width={18} />
            ) : (
              <ListCheckLineDuotone width={18} />
            )}
          </span>
        ),
      },
      {
        title: "Тестийн нэр",
        dataIndex: ["data", "name"],
        key: "name",
        sorter: (a, b) => a.data.name.localeCompare(b.data.name),
        render: (text, record) => (
          <Link
            href={`/test/${record.data.id}`}
            className="text-main! font-bold hover:text-secondary! transition-colors hover:underline! underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {text}
          </Link>
        ),
      },
      {
        title: "Ангилал",
        dataIndex: "category",
        key: "category",
        render: (_, record) => {
          const categoryName = record.category?.parent
            ? record.category.parent.name
            : record.category?.name;
          return <span>{categoryName || "-"}</span>;
        },
        filters: categoryFilters,
        filterMode: "tree",
        // filterSearch: true,
        onFilter: (value, record) => {
          return (
            record.category?.id === value ||
            record.category?.parent?.id === value
          );
        },
      },
      {
        title: "Төлөв",
        dataIndex: ["data", "status"],
        key: "status",
        width: 100,
        align: "center",
        render: renderStatus,
        filters: STATUS_OPTIONS,
        onFilter: (value, record) => record.data.status === value,
      },
      {
        title: "Үүсгэсэн",
        dataIndex: "user",
        key: "user",
        render: formatUserName,
        filters: userFilters,
        onFilter: (value, record) => record.user?.createdUser?.id === value,
        filterSearch: true,
      },
      {
        title: "Үүсгэсэн огноо",
        dataIndex: ["data", "createdAt"],
        key: "createdAt",
        sorter: (a, b) =>
          new Date(a.data.createdAt).getTime() -
          new Date(b.data.createdAt).getTime(),
        render: (date) =>
          date ? new Date(date).toISOString().split("T")[0] : "-",
        width: 160,
      },
      {
        title: "Шинэчилсэн огноо",
        dataIndex: ["data", "updatedAt"],
        key: "updatedAt",
        sorter: (a, b) =>
          new Date(a.data.updatedAt).getTime() -
          new Date(b.data.updatedAt).getTime(),
        render: (date) =>
          date ? new Date(date).toISOString().split("T")[0] : "-",
        width: 150,
      },
      {
        title: "",
        key: "action",
        width: 50,
        align: "center",
        render: (_, record) => (
          <Dropdown
            menu={getActionMenu(record)}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="hover:opacity-100 hover:rounded-full!"
              icon={<MoreIcon width={16} height={16} />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        ),
      },
    ],
    [categoryFilters, userFilters, getActionMenu]
  );

  return (
    <>
      {contextHolder}
      <InfoModal
        open={deleteModal.open}
        onOk={() => {
          if (deleteModal.record) handleDelete(deleteModal.record);
        }}
        onCancel={closeDeleteModal}
        text={`${
          deleteModal.record?.data?.name || "Сонгосон тест"
        }-ийг устгах гэж байна. Итгэлтэй байна уу? Энэ үйлдлийг сэргээх боломжгүй.`}
      />

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex gap-4 flex-wrap">
          <Input
            className="max-w-[220px]"
            prefix={
              <MagniferLineDuotone
                className="text-gray-400 mr-2"
                width={18}
                height={18}
              />
            }
            placeholder="Нэрээр хайх"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            className="min-w-[224px]"
            placeholder="Төрлөөр хайх"
            suffixIcon={<DropdownIcon width={15} height={15} />}
            options={TYPE_OPTIONS}
            value={typeFilter}
            onChange={(value) => {
              setTypeFilter(value === undefined ? null : value);
            }}
            allowClear
            onClear={() => setTypeFilter(null)}
          />
        </div>
        <Button
          onClick={showModal}
          className="the-btn"
          icon={<PlusIcon width={18} height={18} color={"#f36421"} />}
        >
          Тест үүсгэх
        </Button>
      </div>

      <div className="pt-2">
        <Table
          columns={columns}
          dataSource={filteredAssessments}
          locale={customLocale}
          rowKey={(record) => record.data.id}
          loading={{
            spinning: isActionLoading,
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
          pagination={{
            pageSize: 10,
            size: "small",
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} тестүүд`,
          }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <NewAssessment
        assessmentCategories={categories}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onCategoryCreate={refreshCategories}
      />
    </>
  );
};

export default Assessments;
