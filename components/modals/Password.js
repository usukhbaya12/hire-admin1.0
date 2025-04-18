"use client";

import { Modal, Form, Input, Button, Tooltip, Divider, message } from "antd";
import { KeyBoldDuotone, QuestionCircleBoldDuotone } from "solar-icons";
import { handlePasswordChange } from "@/app/api/constant";
import { useState, useEffect } from "react";

const PasswordModal = ({ isOpen, onClose }) => {
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handlePasswordSubmit = async (values) => {
    try {
      setLoading(true);

      const requestData = JSON.stringify({
        oldPassword: values.oldPassword,
        password: values.newPassword,
      });

      const result = await handlePasswordChange(requestData);

      if (result.success) {
        messageApi.success("Нууц үг амжилттай солигдсон.");
        onClose();
        passwordForm.resetFields();
      } else {
        messageApi.error(result.message || "Алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Password change error:", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <KeyBoldDuotone className="text-main" width={20} />
          <span>Нууц үг солих</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={380}
    >
      {contextHolder}

      <Divider className="modal-div" />
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordSubmit}
      >
        <Form.Item
          name="oldPassword"
          label={<span className="font-medium">Одоогийн нууц үг</span>}
          rules={[
            {
              required: true,
              message: "Одоогийн нууц үгээ оруулна уу.",
            },
          ]}
        >
          <Input.Password
            prefix={
              <KeyBoldDuotone
                width={16}
                height={16}
                className="text-gray-400 mr-2"
              />
            }
            className="rounded-lg py-2"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={
            <div className="flex items-center justify-between gap-1">
              <span className="font-medium">Шинэ нууц үг</span>
              <Tooltip title="Багадаа 6 тэмдэгт оруулна уу.">
                <QuestionCircleBoldDuotone
                  width={16}
                  height={16}
                  className="text-gray-400 cursor-help"
                />
              </Tooltip>
            </div>
          }
          rules={[
            {
              required: true,
              message: "Шинэ нууц үгээ оруулна уу.",
            },
            {
              min: 6,
              message: "Багадаа 6 тэмдэгт оруулна уу.",
            },
          ]}
        >
          <Input.Password
            prefix={
              <KeyBoldDuotone
                width={16}
                height={16}
                className="text-gray-400 mr-2"
              />
            }
            className="rounded-lg py-2"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span className="font-medium">Шинэ нууц үгээ давтах</span>}
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Нууц үгээ давтан оруулна уу.",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Нууц үг тохирохгүй байна."));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={
              <KeyBoldDuotone
                width={16}
                height={16}
                className="text-gray-400 mr-2"
              />
            }
            className="rounded-lg py-2"
          />
        </Form.Item>

        <div className="flex gap-3 justify-end mt-6">
          <Button
            className="back-btn"
            onClick={() => {
              onClose();
              passwordForm.resetFields();
            }}
          >
            Буцах
          </Button>
          <Button
            className="the-btn"
            loading={loading}
            htmlType="submit"
            type="primary"
          >
            Нууц үг солих
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
