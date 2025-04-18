"use client";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function LoadingSpinner({ tip = "Уншиж байна..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
      <Spin
        tip={tip}
        fullscreen
        indicator={
          <LoadingOutlined style={{ color: "#fff", fontSize: 24 }} spin />
        }
      />
    </div>
  );
}
