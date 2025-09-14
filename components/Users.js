import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Dropdown,
  Button,
  Spin,
  ConfigProvider,
  Input,
  Select,
} from "antd";
import { DropdownIcon, MoreIcon } from "./Icons";
import { customLocale } from "@/utils/values";
import { getUsers } from "@/app/api/constant";
import { LoadingOutlined } from "@ant-design/icons";
import UserDetailModal from "./modals/User";
import mnMN from "antd/lib/locale/mn_MN";
import {
  MagniferLineDuotone,
  PeopleNearbyBoldDuotone,
  RestartBold,
} from "solar-icons";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchType, setSearchType] = useState("email");
  const [searchText, setSearchText] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchText]);

  const getActionMenu = (record) => ({
    items: [
      {
        key: "1",
        label: "Дэлгэрэнгүй",
        onClick: () => {
          setSelectedUser(record);
          setUserModalVisible(true);
        },
      },
    ],
  });

  const userColumns = [
    {
      title: "Хэрэглэгч",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative min-w-12 min-h-12 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
              <div className="text-base font-bold uppercase bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                {record?.firstname?.[0]}
              </div>
            </div>
          </div>
          <div className="leading-4">
            <div className="font-semibold">
              {record.lastname} {record.firstname}
            </div>
            <div className="text-gray-700 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Утасны дугаар",
      dataIndex: "phone",
    },
    {
      title: "Бүртгүүлсэн огноо",
      dataIndex: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) =>
        date ? new Date(date).toISOString().split("T")[0] : "-",
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={getActionMenu(record)}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            className="hover:opacity-100 rounded-full!"
            icon={<MoreIcon width={16} />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const fetchUsers = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);

      const params = {
        limit: pageSize,
        page: page,
        role: 20,
      };

      if (debouncedSearch) {
        if (searchType === "name") {
          params.firstname = debouncedSearch;
        } else if (searchType === "email") {
          params.email = debouncedSearch;
        }
      }

      const response = await getUsers(params);

      if (response.success && response.data) {
        // Handle different possible response structures
        let usersData = [];
        let totalCount = 0;

        if (Array.isArray(response.data)) {
          // If response.data is directly an array
          usersData = response.data;
          totalCount = response.data.length;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          // If response.data has a users property
          usersData = response.data.users;
          totalCount = response.data.total || response.data.users.length;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a data property
          usersData = response.data.data;
          totalCount = response.data.count || response.data.data.length;
        }

        setUsers(usersData);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: totalCount,
        }));
      } else {
        setUsers([]); // Ensure it's always an array
        messageApi.error(response.message || "Өгөгдөл татахад алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Ensure it's always an array
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, pagination.pageSize);
  }, [debouncedSearch, searchType]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (paginationParams, filters, sorter) => {
    fetchUsers(paginationParams.current, paginationParams.pageSize);
  };

  const handleRowClick = (record) => {
    setSelectedUser(record);
    setUserModalVisible(true);
  };

  const handleModalSuccess = () => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  return (
    <>
      <ConfigProvider locale={mnMN}>
        {contextHolder}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-base font-bold flex items-center gap-2">
              <PeopleNearbyBoldDuotone className="text-main" />
              Бүртгэлтэй хэрэглэгчид
            </div>
            <div className="flex gap-2 flex-row">
              <Select
                value={searchType}
                onChange={(value) => setSearchType(value)}
                suffixIcon={
                  <DropdownIcon width={15} height={15} color={"#f36421"} />
                }
                className="w-36 no-zoom flex-shrink-0"
                options={[
                  { value: "email", label: "И-мэйлээр" },
                  { value: "name", label: "Нэрээр" },
                ]}
              />
              <Input
                className="max-w-[180px]"
                prefix={
                  <MagniferLineDuotone
                    className="text-gray-400 mr-2"
                    width={18}
                    height={18}
                  />
                }
                placeholder="Хайх"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
              <Button className="the-btn" onClick={() => fetchUsers()}>
                <RestartBold width={20} />
              </Button>
            </div>
          </div>

          <Table
            pagination={{
              ...pagination,
              size: "small",
              pageSizeOptions: ["10", "20", "50", pagination.total],
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-ээс ${range[1]} / Нийт ${total}`,
            }}
            columns={userColumns}
            dataSource={users}
            locale={customLocale}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              className: "cursor-pointer hover:bg-gray-50",
            })}
            onChange={handleTableChange}
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
          />
        </div>

        {/* User Detail Modal */}
        <UserDetailModal
          user={selectedUser}
          visible={userModalVisible}
          onClose={() => {
            setUserModalVisible(false);
            setSelectedUser(null);
          }}
          onSuccess={handleModalSuccess}
        />
      </ConfigProvider>
    </>
  );
};

export default Users;
