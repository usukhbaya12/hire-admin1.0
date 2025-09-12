import React, { useEffect, useState } from "react";
import { Table, message, Dropdown, Button, Spin, ConfigProvider } from "antd";
import { MoreIcon } from "./Icons";
import { customLocale } from "@/utils/values";
import { getUsers } from "@/app/api/constant";
import { LoadingOutlined } from "@ant-design/icons";
import UserDetailModal from "./modals/User";
import mnMN from "antd/lib/locale/mn_MN";
import { Buildings2BoldDuotone } from "solar-icons";

const Organizations = () => {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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

  const organizationColumns = [
    {
      title: "Байгууллагын нэр",
      dataIndex: "organizationName",
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/50 to-blue-600/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative min-w-12 min-h-12 bg-gradient-to-br from-blue-600/10 to-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/10">
              <div className="text-base font-bold uppercase bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent">
                {text?.[0]}
              </div>
            </div>
          </div>
          <div className="leading-4">
            <div className="font-bold text-blue-600">{text}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Регистрийн дугаар",
      dataIndex: "organizationRegisterNumber",
      align: "center",
    },
    {
      title: "Холбогдох ажилтан",
      dataIndex: "firstname",
      sorter: true,
      render: (text, record) => (
        <div className="leading-4">
          <div className="font-semibold">
            {record.lastname[0]}.{text}
          </div>
          <div className="text-gray-700 text-sm">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Утасны дугаар",
      dataIndex: "organizationPhone",
      align: "center",
    },
    {
      title: "Бүртгүүлсэн огноо",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: true,
      align: "center",
    },
    {
      title: "Дансны үлдэгдэл",
      dataIndex: "wallet",
      render: (wallet) => (
        <div className="font-medium text-center">
          {wallet?.toLocaleString()}₮
        </div>
      ),
      sorter: true,
      align: "center",
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
            className="hover:opacity-100"
            icon={<MoreIcon width={16} />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const fetchOrganizations = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await getUsers({
        limit: pageSize,
        page: page,
        role: 30,
      });

      if (response.success && response.data) {
        let organizationsData = [];
        let totalCount = 0;

        if (Array.isArray(response.data)) {
          organizationsData = response.data;
          totalCount = response.data.length;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          organizationsData = response.data.users;
          totalCount = response.data.total || response.data.users.length;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          organizationsData = response.data.data;
          totalCount = response.data.total || response.data.data.length;
        }

        setOrganizations(organizationsData);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: totalCount,
        }));
      } else {
        setOrganizations([]);
        messageApi.error(response.message || "Өгөгдөл татахад алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleTableChange = (paginationParams, filters, sorter) => {
    fetchOrganizations(paginationParams.current, paginationParams.pageSize);
  };

  const handleRowClick = (record) => {
    setSelectedUser(record);
    setUserModalVisible(true);
  };

  const handleModalSuccess = () => {
    fetchOrganizations(pagination.current, pagination.pageSize);
  };

  return (
    <>
      <ConfigProvider locale={mnMN}>
        {contextHolder}
        <div className="p-6">
          <div className="mb-4">
            <div className="text-base font-bold flex items-center gap-2">
              <Buildings2BoldDuotone className="text-main" />
              Бүртгэлтэй байгууллагууд
            </div>
          </div>

          <Table
            pagination={{
              ...pagination,
              showSizeChanger: true,
              size: "small",
              pageSizeOptions: ["10", "20", "50", pagination.total],
              showTotal: (total, range) =>
                `${range[0]}-ээс ${range[1]} / Нийт ${total}`,
            }}
            columns={organizationColumns}
            dataSource={organizations}
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

export default Organizations;
