import React, { useState, useEffect } from "react";
import { Table, Empty, Spin, Tag } from "antd";
import { getUserPaymentHistory } from "@/app/api/constant";
import { LoadingOutlined } from "@ant-design/icons";

const TransactionHistory = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPayments = async (page = 1, pageSize = 10) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await getUserPaymentHistory(user.id, page, pageSize);

      if (response.success) {
        const { payments: pay } = response.data;

        const paymentsData =
          pay?.data?.map((item, index) => ({
            ...item,
            key: `payment-${item.paymentDate}-${index}`,
            transactionType: getTransactionType(item),
          })) || [];

        setPayments(paymentsData);

        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: pay?.count || paymentsData.length,
        }));
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPayments(pagination.current, pagination.pageSize);
    }
  }, [user?.id, pagination.current, pagination.pageSize]);

  const getTransactionType = (item) => {
    const isPositive = item.price > 0;

    if (item.assessment) {
      if (isPositive) {
        return "sale";
      }
      return "purchase";
    } else if (item.admin && isPositive) {
      return "deposit";
    } else if (isPositive) {
      return "income";
    } else {
      return "expense";
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const columns = [
    {
      title: "Огноо",
      key: "paymentDateType",
      render: (_, record) => {
        const d = new Date(record.paymentDate);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");

        const formatted = `${year}-${month}-${day} ${hours}:${minutes}`;

        let color = "blue";
        let text = "Бусад";

        switch (record.transactionType) {
          case "purchase":
            color = "red";
            text = "Худалдан авалт";
            break;
          case "sale":
            color = "blue";
            text = "QPay гүйлгээ";
            break;
          case "deposit":
            color = "green";
            text = "Данс цэнэглэсэн";
            break;
          case "income":
            color = "green";
            text = "Орлого";
            break;
          case "expense":
            color = "red";
            text = "Зарлага";
            break;
        }

        return (
          <div className="flex flex-col items-center gap-1">
            <div className="px-2">{formatted}</div>
            <Tag
              color={color}
              className="rounded-full! shadow shadow-slate-200 font-semibold! px-3! py-0.5!"
            >
              {text}
            </Tag>
          </div>
        );
      },
      sorter: (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate),
      align: "center",
      width: "160px",
    },
    {
      title: "Тайлбар",
      dataIndex: "message",
      key: "message",
      render: (message, record) => (
        <div>
          {record.assessment ? (
            <div className="items-center">
              <div className="text-main font-bold">
                {record.assessment.name}
              </div>
              {user?.role === 30 && (
                <div className="text-gray-700 font-medium">
                  {Math.abs(record.price / record.assessment.price)} эрх
                </div>
              )}
            </div>
          ) : (
            <div>{message}</div>
          )}
        </div>
      ),
      width: "200px",
    },
    {
      title: "Үнийн дүн",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        const isPositive = price > 0;
        return (
          <span
            className={`font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {price.toLocaleString()}₮
          </span>
        );
      },
      align: "center",
      width: "100px",
    },
    ...(user?.role === 30
      ? [
          {
            title: "Цэнэглэсэн админ",
            dataIndex: "admin",
            key: "admin",
            render: (admin) =>
              admin ? `${admin.firstname} ${admin.lastname || ""}`.trim() : "",
            align: "center",
            width: "60px",
          },
        ]
      : []),
  ];

  if (loading && payments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin
          size="default"
          indicator={
            <LoadingOutlined style={{ color: "#f26522", fontSize: 24 }} spin />
          }
        />
      </div>
    );
  }

  return (
    <div className="p-2">
      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", pagination.total.toString()],
          size: "small",
          showTotal: (total, range) => {
            const start = (pagination.current - 1) * pagination.pageSize + 1;
            let end = start + payments.length - 1;
            if (pagination.total < end) end = pagination.total;

            return `${start}-ээс ${end} / Нийт ${pagination.total}`;
          },
        }}
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
        locale={{
          emptyText: <Empty description="Өгөгдөл олдсонгүй." />,
        }}
        size="middle"
        scroll={{ x: 500 }}
      />
    </div>
  );
};

export default TransactionHistory;
