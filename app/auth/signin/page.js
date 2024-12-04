"use client";

import Image from "next/image";
import { Form, Input, Button } from "antd";
import { KeyIcon, MailIcon } from "@/components/Icons";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen justify-center flex items-center">
      <div className="border rounded-3xl p-12 pb-6">
        <div className="flex justify-center pb-10">
          <Image
            src="/axiom.png"
            width={90}
            height={10}
            alt="Axiom Logo"
          ></Image>
        </div>
        <Form layout="vertical">
          <div>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "И-мейл хаягаа оруулна уу.",
                },
              ]}
            >
              <Input
                prefix={<MailIcon width={18} height={18} />}
                placeholder="И-мейл хаяг"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Нууц үгээ оруулна уу.",
                },
              ]}
            >
              <Input
                prefix={<KeyIcon width={18} height={18} />}
                type="password"
                placeholder="Нууц үг"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex items-center justify-center pt-2">
                <Button
                  htmlType="submit"
                  className="bg-main border-none text-white rounded-xl px-9 login mb-0 font-bold"
                >
                  Нэвтрэх
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}
