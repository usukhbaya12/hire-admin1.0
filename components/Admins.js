import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Dropdown,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Divider,
  Spin,
  ConfigProvider,
} from "antd";
import { MoreIcon, PlusIcon } from "./Icons";
import { customLocale } from "@/utils/values";
import { getUsers, createUser } from "@/app/api/constant";
import { AccessibilityBoldDuotone, SettingsBoldDuotone } from "solar-icons";
import { LoadingOutlined } from "@ant-design/icons";
import UserDetailModal from "./modals/User";
import mnMN from "antd/lib/locale/mn_MN";

const Admins = () => {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [addUserVisible, setAddUserVisible] = useState(false);
  const [form] = Form.useForm();
  const [createLoading, setCreateLoading] = useState(false);
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

  const adminColumns = [
    {
      title: "Админ",
      key: "admin",
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
      title: "Эрх",
      dataIndex: "role",
      render: (role) => (
        <span className="font-medium">
          {role === 10
            ? "Супер админ"
            : role === 40
            ? "Админ"
            : role === 50
            ? "Тестийн админ"
            : "Тодорхойгүй"}
        </span>
      ),
    },
    {
      title: "Бүртгүүлсэн огноо",
      dataIndex: "createdAt",
      render: (date) =>
        date ? new Date(date).toISOString().split("T")[0] : "-",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
            className="hover:opacity-100 rounded-full!"
            icon={<MoreIcon width={16} />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const adminRoles = [
    { value: 10, label: "Супер админ" },
    { value: 40, label: "Админ" },
    { value: 50, label: "Тестийн админ" },
  ];

  const fetchAdmins = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await getUsers({
        limit: pageSize,
        page: page,
        role: 35,
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
          totalCount = response.data.count || response.data.data.length;
        }

        setAdmins(organizationsData);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: totalCount,
        }));
      } else {
        setAdmins([]);
        messageApi.error(response.message || "Өгөгдөл татахад алдаа гарлаа.");
      }
    } catch (error) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleTableChange = (paginationParams, filters, sorter) => {
    fetchAdmins(paginationParams.current, paginationParams.pageSize);
  };

  const handleRowClick = (record) => {
    setSelectedUser(record);
    setUserModalVisible(true);
  };

  const handleModalSuccess = () => {
    fetchAdmins(pagination.current, pagination.pageSize);
  };

  const onAddAdmin = async (values) => {
    try {
      setCreateLoading(true);
      const response = await createUser({
        ...values,
        role: values.role,
      });

      if (response.success) {
        messageApi.success("Админ амжилттай нэмэгдлээ");
        form.resetFields();
        setAddUserVisible(false);
        fetchAdmins(pagination.current, pagination.pageSize);
      } else {
        messageApi.error(response.message || "Алдаа гарлаа");
      }
    } catch (error) {
      messageApi.error("Алдаа гарлаа");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <>
      <ConfigProvider locale={mnMN}>
        {contextHolder}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-base font-bold flex items-center gap-2">
              <SettingsBoldDuotone className="text-main" />
              Идэвхтэй админууд
            </div>
            <Button
              onClick={() => setAddUserVisible(true)}
              className="the-btn"
              icon={<PlusIcon width={18} color={"#f36421"} />}
            >
              Админ нэмэх
            </Button>
          </div>

          <Table
            pagination={{
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", pagination.total],
              size: "small",
              showTotal: (total, range) =>
                `${range[0]}-ээс ${range[1]} / Нийт ${total}`,
            }}
            columns={adminColumns}
            dataSource={admins}
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

        {/* Add Admin User Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <AccessibilityBoldDuotone className="text-main" width={20} />
              <span>Админ нэмэх</span>
            </div>
          }
          open={addUserVisible}
          onCancel={() => {
            form.resetFields();
            setAddUserVisible(false);
          }}
          footer={null}
          width={380}
        >
          <Divider className="modal-div" />

          <Form form={form} layout="vertical" onFinish={onAddAdmin}>
            <div>
              <Form.Item
                label="Овог"
                name="lastname"
                rules={[{ required: true, message: "Овог оруулна уу." }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Нэр"
                name="firstname"
                rules={[{ required: true, message: "Нэр оруулна уу." }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                validateTrigger="onFinish"
                label="И-мэйл хаяг"
                name="email"
                rules={[
                  { required: true, message: "И-мэйл хаяг оруулна уу." },
                  { type: "email", message: "И-мэйл хаяг буруу байна." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Утасны дугаар"
                name="phone"
                rules={[
                  { required: true, message: "Утасны дугаар оруулна уу." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Нууц үг"
                name="password"
                rules={[{ required: true, message: "Нууц үг оруулна уу." }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Эрх"
                name="role"
                rules={[{ required: true, message: "Эрх сонгоно уу." }]}
              >
                <Select options={adminRoles} placeholder="Эрх сонгох" />
              </Form.Item>

              <div className="flex gap-3 justify-end mt-6">
                <Button
                  onClick={() => {
                    form.resetFields();
                    setAddUserVisible(false);
                  }}
                  className="back-btn"
                >
                  Цуцлах
                </Button>
                <Button
                  loading={createLoading}
                  htmlType="submit"
                  className="the-btn"
                >
                  Нэмэх
                </Button>
              </div>
            </div>
          </Form>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default Admins;
