"use client";

import { Form, message, Input, Button } from "antd";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyBoldDuotone, LetterBoldDuotone, ShieldKeyhole } from "solar-icons";
import { signIn } from "next-auth/react";

export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [session, router]);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        messageApi.error(result.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setIsLoading(false);
    }
  };

  if (session) {
    return null;
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex bg-slate-50">
        <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-main to-secondary relative overflow-hidden">
          <div className="relative z-10 p-12 flex flex-col h-full">
            <div>
              <Image
                src="/hire-white.png"
                width={100}
                height={40}
                alt="Hire logo"
                className="mb-2"
              />
            </div>

            <div className="flex-grow flex flex-col justify-center -mt-32">
              <h1 className="text-white font-black text-5xl/10 mb-4">
                Онлайн тест,
                <br />
                хөндлөнгийн үнэлгээ
              </h1>
              <p className="text-white/80 font-semibold mb-8">
                Удирдлагын систем
              </p>
            </div>

            <div className="text-white/70">
              © {new Date().getFullYear()} Аксиом Инк.
            </div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-16 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-xl"></div>
        </div>

        <div className="w-full md:w-3/5 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow shadow-slate-200 px-8 pt-8 pb-3 md:px-10 md:pt-10 md:pb-5">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-main/10 mb-4">
                  <ShieldKeyhole width={28} height={28} className="text-main" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-800">
                  Сайн уу, Админ? 👋
                </h2>
              </div>

              <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                className="space-y-4"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "И-мейл хаягаа оруулна уу.",
                    },
                  ]}
                  validateTrigger="onFinish"
                >
                  <Input
                    prefix={
                      <LetterBoldDuotone
                        className="text-gray-400 mr-2"
                        width={18}
                        height={18}
                      />
                    }
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
                  <Input.Password
                    prefix={
                      <KeyBoldDuotone
                        className="text-gray-400 mr-2"
                        width={18}
                        height={18}
                      />
                    }
                    placeholder="Нууц үг"
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    htmlType="submit"
                    loading={isLoading}
                    className="w-full the-btn"
                  >
                    Нэвтрэх
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <div className="text-center mt-24 md:hidden">
              <Image
                src="/hire-white.png"
                width={80}
                height={26}
                alt="Hire logo"
                className="mx-auto mb-2 invert"
              />
              <p className="text text-gray-500">
                © {new Date().getFullYear()} Аксиом Инк.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
