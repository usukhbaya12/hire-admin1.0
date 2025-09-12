import React, { useEffect, useState } from "react";
import {
  Input,
  message,
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
} from "antd";
import {
  AccessibilityBoldDuotone,
  Buildings2BoldDuotone,
  SuitcaseBoldDuotone,
  PasswordBoldDuotone,
} from "solar-icons";
import { useSession } from "next-auth/react";
import { chargeAccount, changeUserRole } from "@/app/api/constant";
import TransactionHistory from "../Transactions";

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

export default UserDetailModal;
