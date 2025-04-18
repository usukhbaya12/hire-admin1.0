import React, { useEffect, useState } from "react";
import {
  Input,
  Table,
  message,
  Dropdown,
  Button,
  Modal,
  Form,
  InputNumber,
  Divider,
  Tabs,
  Select,
  Tag,
  Descriptions,
  Radio,
  Spin,
} from "antd";
import { MoreIcon, PlusIcon } from "./Icons";
import { customLocale } from "@/utils/values";

import {
  chargeAccount,
  createUser,
  getUsers,
  changeUserRole,
} from "@/app/api/constant";
import {
  Buildings2BoldDuotone,
  MagniferBoldDuotone,
  MagniferLineDuotone,
  PasswordBoldDuotone,
  SuitcaseBoldDuotone,
} from "solar-icons";
import { useSession } from "next-auth/react";
import TransactionHistory from "./Transactions";
import { LoadingOutlined } from "@ant-design/icons";

const UserDetailModal = ({ user, visible, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("1");
  const { data: session } = useSession();

  // Only show the role change tab for super admins (role 10) and non-organization accounts (role !== 30)
  const showRoleChangeTab = session?.user?.role === 10 && user?.role !== 30;

  const items = [
    {
      key: "1",
      label: "Ерөнхий мэдээлэл",
      children: (
        <div className="pb-2">
          {user?.role !== 30 && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Утасны дугаар">
                {user?.phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Бүртгүүлсэн огноо">
                {new Date(user?.createdAt).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          )}
          {user?.role === 30 && (
            <>
              <div className="font-bold pb-4 flex items-center gap-2">
                <Buildings2BoldDuotone className="text-gray-500" />
                Байгууллагын мэдээлэл
              </div>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Байгууллагын нэр">
                  <div className="font-semibold">{user?.organizationName}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Регистрийн дугаар">
                  <div className="flex items-center gap-1 text-main font-bold">
                    <PasswordBoldDuotone color={"#f36421"} />
                    {user?.organizationRegisterNumber}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Утасны дугаар">
                  <div className="font-semibold">{user?.organizationPhone}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Дансны үлдэгдэл">
                  {user?.wallet?.toLocaleString()}₮
                </Descriptions.Item>
                <Descriptions.Item label="Бүртгүүлсэн огноо">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>
              <div className="font-bold py-4 flex items-center gap-2">
                <SuitcaseBoldDuotone className="text-gray-500" />
                Ажилтны мэдээлэл
              </div>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Овог, нэр">
                  <div className="font-semibold">
                    {user?.lastname} {user?.firstname}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Утасны дугаар">
                  <div className="font-semibold">{user?.phone}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Албан тушаал">
                  <div className="font-semibold">{user?.position}</div>
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </div>
      ),
    },
    user?.role === 30 &&
      session?.user?.role !== 50 && {
        key: "2",
        label: "Данс цэнэглэх",
        children: <ChargeSection user={user} onSuccess={onSuccess} />,
      },
    {
      key: "3",
      label: "Гүйлгээний түүх",
      children: <TransactionHistory user={user} />,
    },
    // Add the role change tab only for super admins and non-organization users
    showRoleChangeTab && {
      key: "4",
      label: "Эрх өөрчлөх",
      children: <RoleChangeSection user={user} onSuccess={onSuccess} />,
    },
  ].filter(Boolean);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={700}
      footer={null}
      className="rounded-xl"
      title="Дэлгэрэнгүй"
    >
      <div className="flex items-center gap-3 mt-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative min-w-24 min-h-24 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
            <div className="text-4xl font-black uppercase bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
              {user?.role === 30
                ? user?.organizationName?.[0]
                : user?.firstname?.[0]}
            </div>
          </div>
        </div>
        <div className="pl-2 leading-5">
          <div className="text-xl font-extrabold">
            {user?.role === 30
              ? user?.organizationName
              : user?.lastname + " " + user?.firstname}
          </div>
          <div>{user?.email}</div>
          <Tag
            color="blue"
            className="mt-2! rounded-full! font-semibold px-2.5 shadow"
          >
            {user?.role === 30
              ? "Байгууллага"
              : user?.role === 20
              ? "Хэрэглэгч"
              : user?.role === 10
              ? "Супер админ"
              : user?.role === 40
              ? "Админ"
              : "Тестийн админ"}
          </Tag>
        </div>
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        className="mt-4!"
      />
    </Modal>
  );
};

const RoleChangeSection = ({ user, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const adminRoles = [
    { value: 10, label: "Супер админ" },
    { value: 20, label: "Хэрэглэгч" },
    { value: 40, label: "Админ" },
    { value: 50, label: "Тестийн админ" },
  ];

  useEffect(() => {
    form.setFieldsValue({
      role: user?.role,
    });
  }, [form, user]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const response = await changeUserRole(user.id, values.role);

      if (response.success) {
        messageApi.success("Хэрэглэгчийн эрх амжилттай өөрчлөгдлөө.");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        messageApi.error(response.message || "Эрх өөрчлөхөд алдаа гарлаа.");
      }
    } catch (error) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-24 bg-gray-50 rounded-3xl mb-2">
      {contextHolder}
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          role: user?.role,
        }}
      >
        <div className="flex justify-between mb-4">
          <div className="font-medium">Одоогийн эрх:</div>
          <div className="font-bold">
            {adminRoles.find((role) => role.value === user?.role)?.label ||
              "Тодорхойгүй"}
          </div>
        </div>
        <Divider />

        <Form.Item
          name="role"
          label="Шинэ эрх"
          rules={[{ required: true, message: "Эрх сонгоно уу." }]}
        >
          <Select options={adminRoles} placeholder="Эрх сонгох" />
        </Form.Item>

        <Divider />

        <div className="flex justify-end gap-2 mt-4">
          <Button
            className="back-btn"
            onClick={() => {
              form.resetFields();
              form.setFieldsValue({
                role: user?.role,
              });
            }}
          >
            Цуцлах
          </Button>
          <Button loading={loading} htmlType="submit" className="the-btn">
            Хадгалах
          </Button>
        </div>
      </Form>
    </div>
  );
};

const ChargeSection = ({ user, onSuccess }) => {
  const [form] = Form.useForm();
  const [localWallet, setLocalWallet] = useState(user?.wallet || 0);
  const [finalBalance, setFinalBalance] = useState(user?.wallet || 0);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();

  const handleAmountChange = (value) => {
    if (!value) {
      setFinalBalance(localWallet);
      return;
    }
    setFinalBalance(localWallet + value);
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const response = await chargeAccount({
        id: user.id,
        amount: values.amount,
        method: values.method,
        message: values.message || "",
      });

      if (response.success) {
        messageApi.success("Амжилттай цэнэглэлээ.");
        const newBalance = localWallet + values.amount;
        setLocalWallet(newBalance);
        setFinalBalance(newBalance);
        form.resetFields();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        messageApi.error(response.message || "Цэнэглэхэд алдаа гарлаа.");
      }
    } catch (error) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.resetFields();
    setLocalWallet(user?.wallet || 0);
    setFinalBalance(user?.wallet || 0);
  }, [user, form]);

  return (
    <div className="p-6 mx-24 bg-gray-50 rounded-3xl mb-2">
      {contextHolder}
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{
          method: 3,
        }}
      >
        <div className="flex justify-between">
          <div className="font-medium">Өмнөх үлдэгдэл:</div>
          <div className="font-bold">
            {localWallet.toLocaleString()}
            <span className="text-[13px]">₮</span>
          </div>
        </div>
        <Divider />

        <Form.Item
          className="fnp"
          name="method"
          label="Төлбөрийн хэлбэр"
          rules={[{ required: true, message: "Төлбөрийн хэлбэр сонгоно уу." }]}
        >
          <Radio.Group className="mt-1.5! ml-3!">
            <Radio value={1} className="mb-1!">
              <div className="flex items-center gap-2">
                <span>Урамшуулал</span>
              </div>
            </Radio>
            <Radio value={3}>
              <div className="flex items-center gap-2">
                <span>Дансаар шилжүүлсэн</span>
              </div>
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Divider />

        <Form.Item
          className="fnp"
          name="amount"
          label="Цэнэглэх дүн"
          rules={[{ required: true, message: "Цэнэглэх дүнгээ оруулна уу." }]}
        >
          <InputNumber
            controls={false}
            className="price"
            formatter={(value) =>
              `₮${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/₮\s?|(,*)/g, "")}
            min={0}
            onChange={handleAmountChange}
          />
        </Form.Item>
        <Divider />
        <Form.Item
          className="fnp"
          name="message"
          label="Тайлбар"
          rules={[{ required: true, message: "Тайлбар оруулна уу." }]}
        >
          <Input.TextArea rows={3} placeholder="Гүйлгээний утга" />
        </Form.Item>

        <Divider />

        <div className="flex justify-between pb-4">
          <div className="font-medium">Эцсийн үлдэгдэл:</div>
          <div className="font-bold text-lg text-main">
            {finalBalance.toLocaleString()}
            <span className="text-[13px]">₮</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            className="back-btn"
            onClick={() => {
              form.resetFields();
              setFinalBalance(localWallet);
            }}
          >
            Цуцлах
          </Button>
          <Button loading={loading} htmlType="submit" className="the-btn">
            Цэнэглэх
          </Button>
        </div>
      </Form>
    </div>
  );
};

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [addUserVisible, setAddUserVisible] = useState(false);
  const { data: session } = useSession();
  const [form] = Form.useForm();

  const items = [
    {
      key: "1",
      label: "Байгууллагууд",
      role: 30,
    },
    {
      key: "2",
      label: "Хэрэглэгчид",
      role: 20,
    },
    {
      key: "3",
      label: "Админ эрхтэй",
      role: [10, 40, 50],
    },
  ];

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
    ].filter(Boolean),
  });

  const organizationColumns = [
    {
      title: "Байгууллагын нэр",
      dataIndex: "organizationName",
      sorter: (a, b) => a.organizationName?.localeCompare(b.organizationName),
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative min-w-12 min-h-12 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
              <div className="text-base font-bold uppercase bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                {text?.[0]}
              </div>
            </div>
          </div>
          <div className="leading-4">
            <div className="font-semibold">{text}</div>
            <div className="text-gray-700 text-sm">{record.email}</div>
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
      title: "Бүртгүүлсэн огноо",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      align: "center",
    },
    {
      title: "Дансны үлдэгдэл",
      dataIndex: "wallet",
      render: (wallet) => (
        <div className="font-medium text-center">
          {wallet.toLocaleString()}₮
        </div>
      ),
      sorter: (a, b) => a.wallet - b.wallet,
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

  const regularColumns = [
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
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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

  useEffect(() => {
    const activeTab = items.find((item) => item.key === activeKey);
    const filtered = users
      .filter((user) => {
        if (Array.isArray(activeTab?.role)) {
          return activeTab.role.includes(user.role);
        }
        return user.role === activeTab?.role;
      })
      .filter((user) => {
        const searchLower = searchText.toLowerCase();
        return (
          user.firstname?.toLowerCase().includes(searchLower) ||
          user.lastname?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.organizationName?.toLowerCase().includes(searchLower) ||
          user.organizationRegisterNumber?.toLowerCase().includes(searchLower)
        );
      });
    setFilteredUsers(filtered);
  }, [users, activeKey, searchText]);

  const getConstant = async () => {
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConstant();
  }, []);

  const handleRowClick = (record) => {
    setSelectedUser(record);
    setUserModalVisible(true);
  };

  const adminRoles = [
    { value: 10, label: "Супер админ" },
    { value: 40, label: "Админ" },
    { value: 50, label: "Тестийн админ" },
  ];

  const onAddAdmin = async (values) => {
    try {
      setLoading(true);
      const response = await createUser({
        ...values,
        role: values.role,
      });

      if (response.success) {
        messageApi.success("Админ амжилттай нэмэгдлээ");
        form.resetFields();
        setAddUserVisible(false);
        await getConstant();
      } else {
        messageApi.error(response.message || "Алдаа гарлаа");
      }
    } catch (error) {
      messageApi.error("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex border-b border-neutral pr-6 pl-4 justify-between items-end pt-2">
        <div className="flex gap-6">
          {items.map((item) => (
            <div
              key={item.key}
              className={`cursor-pointer p-2 ${
                item.key === activeKey
                  ? "font-bold text-main border-b-2 border-main"
                  : ""
              }`}
              onClick={() => setActiveKey(item.key)}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 pb-2">
          <Input
            className="home"
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
          {activeKey === "3" && (
            <Button
              onClick={() => setAddUserVisible(true)}
              className="bg-main border-none text-white rounded-xl px-4 login mb-0 font-bold"
              icon={<PlusIcon width={18} />}
            >
              Админ нэмэх
            </Button>
          )}
        </div>
      </div>

      <div className="pt-4 p-6">
        <Table
          pagination={{
            pageSize: 9,
            size: "small",
          }}
          columns={activeKey === "1" ? organizationColumns : regularColumns}
          dataSource={filteredUsers}
          locale={customLocale}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            className: "cursor-pointer hover:bg-gray-50",
          })}
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
        onSuccess={() => {
          getConstant();
        }}
      />

      {/* Add Admin User Modal */}

      <Modal
        title="Админ нэмэх"
        open={addUserVisible}
        onCancel={() => {
          form.resetFields();
          setAddUserVisible(false);
        }}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={onAddAdmin}>
          <div className="p-4">
            <Form.Item
              label="Овог"
              name="lastname"
              rules={[{ required: true, message: "Овог оруулна уу" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Нэр"
              name="firstname"
              rules={[{ required: true, message: "Нэр оруулна уу" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="И-мэйл"
              name="email"
              rules={[
                { required: true, message: "И-мэйл оруулна уу" },
                { type: "email", message: "И-мэйл буруу байна" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Утасны дугаар"
              name="phone"
              rules={[{ required: true, message: "Утасны дугаар оруулна уу" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Нууц үг"
              name="password"
              rules={[{ required: true, message: "Нууц үг оруулна уу" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Эрх"
              name="role"
              rules={[{ required: true, message: "Эрх сонгоно уу" }]}
            >
              <Select options={adminRoles} placeholder="Эрх сонгох" />
            </Form.Item>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => {
                  form.resetFields();
                  setAddUserVisible(false);
                }}
                className="back border rounded-xl text-[13px] font-medium"
              >
                Цуцлах
              </Button>
              <Button
                loading={loading}
                htmlType="submit"
                className="border-none rounded-xl font-semibold text-white bg-main"
              >
                Нэмэх
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Users;
