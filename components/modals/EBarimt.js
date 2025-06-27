import React, { useState } from "react";
import { Modal, Spin, Button, message, Divider, Empty } from "antd";
import { QrCodeBoldDuotone } from "solar-icons";

const EBarimtModal = ({ visible, onClose, loading, data, assessment }) => {
  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <QrCodeBoldDuotone className="text-main -mt-0.5" width={20} />
            <span className="text-[15px]">Баримтын мэдээлэл</span>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={400}
        closeIcon={
          <div className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        }
      >
        {loading ? (
          <Spin />
        ) : data ? (
          <>
            <Divider />
            <div className="flex items-center justify-between pt-1">
              <img
                src="/ebarimt.png"
                width={35}
                className="pt-1"
                alt="E-Barimt"
              ></img>
              <div className="text-center leading-5">
                <div className="font-bold text-[16px]">Таны баримт</div>
                {data.date}
              </div>
              <img src="/favicon.ico" width={35} alt="Hire-logo"></img>
            </div>
            <div className="pt-4 flex justify-between">
              <div className="w-1/2 text-gray-500">{assessment}</div>
              <div className="text-gray-500">1</div>
              <div>{data?.totalAmount?.toLocaleString()}</div>
            </div>
            <Divider dashed />
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between font-bold">
                НӨАТ{" "}
                <div className="text-main">{data?.noat?.toLocaleString()}</div>
              </div>
              <div className="flex items-center justify-between font-bold">
                Нийт дүн{" "}
                <div className="text-main">
                  {data?.totalAmount?.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between font-bold">
                Сугалааны дугаар <div className="text-main">{data.lottery}</div>
              </div>
              <Divider dashed />
              <div className="flex flex-col items-center text-center">
                <div className="font-bold">Таны и-баримт</div>
                <img
                  src={data.qrdata}
                  alt="Base64 Image"
                  className="w-auto h-auto"
                />
                <div>ДДТД: {data.ddtd}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Divider />
            <Empty description="Баримт олдсонгүй" />
            <Divider dashed />
            <div className="text-center pb-2">Холбоо барих</div>
            <div className="flex items-center justify-between font-bold">
              Утасны дугаар <div className="text-main">9909-9371</div>
            </div>
            <div className="flex items-center justify-between font-bold">
              И-мейл хаяг <div className="text-main">info@hire.mn</div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default EBarimtModal;
