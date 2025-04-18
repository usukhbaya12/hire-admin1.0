import React, { useState, useEffect } from "react";
import { Table, Empty, Spin, Tag, Button } from "antd";
import { getUserPaymentHistory } from "@/app/api/constant";
import { LoadingOutlined } from "@ant-design/icons";

const TransactionHistory = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentsPagination, setPaymentsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [transactionsPagination, setTransactionsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [activeView, setActiveView] = useState("payments");

  const fetchData = async (page = 1, pageSize = 10) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await getUserPaymentHistory(user.id, page, pageSize);

      if (response.success) {
        console.log(response.data);

        const transactionsData = response.data.transactions.data.map(
          (item, index) => ({
            ...item,
            key: `transaction-${item.paymentDate}-${index}`,
          })
        );

        const paymentsData = response.data.payments.data.map((item, index) => ({
          ...item,
          key: `payment-${item.paymentDate}-${index}`,
          transactionType: getTransactionType(item),
        }));

        setTransactions(transactionsData);
        setPayments(paymentsData);

        setPaymentsPagination((prev) => ({
          ...prev,
          total: Math.max(paymentsData.length * 2, prev.total),
        }));

        setTransactionsPagination((prev) => ({
          ...prev,
          total: Math.max(transactionsData.length * 2, prev.total),
        }));
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveView("payments");
  }, [user?.id]);

  useEffect(() => {
    if (activeView === "payments") {
      fetchData(paymentsPagination.current, paymentsPagination.pageSize);
    } else {
      fetchData(
        transactionsPagination.current,
        transactionsPagination.pageSize
      );
    }
  }, [
    user?.id,
    activeView,
    paymentsPagination.current,
    paymentsPagination.pageSize,
    transactionsPagination.current,
    transactionsPagination.pageSize,
  ]);

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

  const handlePaymentsTableChange = (pagination) => {
    setPaymentsPagination(pagination);
  };

  const handleTransactionsTableChange = (pagination) => {
    setTransactionsPagination(pagination);
  };

  const paymentsColumns = [
    {
      title: "Төрөл",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => {
        let color = "blue";
        let text = "Бусад";

        switch (type) {
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
          <Tag
            color={color}
            className="rounded-full! shadow shadow-slate-200 font-semibold! px-3! py-0.5!"
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Огноо",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString();
        const formattedTime = new Date(date).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div>
            <div className="px-4">
              {formattedDate}
              <span className="text-gray-500 pl-1">{formattedTime}</span>
            </div>
          </div>
        );
      },
      sorter: (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate),
      defaultSortOrder: "ascend",
      align: "center",
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
      align: "right",
      width: "120px",
    },
    {
      title: "Тайлбар",
      dataIndex: "message",
      key: "message",
      render: (message, record) => (
        <div>
          {record.assessment ? (
            <div className="flex items-center">
              <div className="text-main font-bold">
                {record.assessment.name}
              </div>
              {user?.role === 30 && (
                <div className="text-gray-700 font-medium">
                  <span className="px-2">•</span>
                  {Math.abs(record.price / record.assessment.price)} эрх
                </div>
              )}
            </div>
          ) : (
            <div>{message}</div>
          )}
        </div>
      ),
    },
    {
      title: "Цэнэглэсэн админ",
      dataIndex: "admin",
      key: "admin",
      render: (admin) =>
        admin ? `${admin.firstname} ${admin.lastname || ""}`.trim() : "-",
    },
  ];

  const transactionsColumns = [
    {
      title: "Огноо",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-GB");
        const formattedTime = new Date(date).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div>
            <div>
              {formattedDate}
              <span className="text-gray-500 text-sm pl-1">
                {formattedTime}
              </span>
            </div>
          </div>
        );
      },
      sorter: (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate),
      defaultSortOrder: "descend",
    },
    {
      title: "Тестийн нэр",
      dataIndex: ["assessment", "name"],
      key: "assessment",
      render: (text) => <div className="font-bold text-main">{text}</div>,
    },
    {
      title: "Худалдан авалтын дүн",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-medium text-green-600">
          {price.toLocaleString()}₮
        </span>
      ),
      align: "right",
    },
    {
      title: "Худалдан авсан эрх",
      dataIndex: "count",
      key: "count",
      align: "center",
    },
    {
      title: "Ашигласан эрхийн тоо",
      dataIndex: "usedUserCount",
      key: "usedUserCount",
      align: "center",
    },
  ];

  if (loading && transactions.length === 0 && payments.length === 0) {
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
      <div className="flex gap-2 mb-4 -mt-2">
        <Button
          onClick={() => setActiveView("payments")}
          className={activeView === "payments" ? "the-btn" : "back-btn"}
        >
          Гүйлгээний түүх
        </Button>
        {/* {user?.role === 30 && (
          <Button
            onClick={() => setActiveView("transactions")}
            className={activeView === "transactions" ? "the-btn" : "back-btn"}
          >
            Эрх зарцуулалт
          </Button>
        )} */}
      </div>

      {activeView === "payments" ? (
        <Table
          columns={paymentsColumns}
          dataSource={payments}
          pagination={paymentsPagination}
          onChange={handlePaymentsTableChange}
          loading={loading && activeView === "payments"}
          locale={{
            emptyText: <Empty description="Өгөгдөл олдсонгүй." />,
          }}
          size="middle"
          scroll={{ x: 800 }}
        />
      ) : (
        <Table
          columns={transactionsColumns}
          dataSource={transactions}
          pagination={transactionsPagination}
          onChange={handleTransactionsTableChange}
          loading={loading && activeView === "transactions"}
          locale={{
            emptyText: <Empty description="Өгөгдөл олдсонгүй." />,
          }}
          size="middle"
          scroll={{ x: 800 }}
        />
      )}
    </div>
  );
};

export default TransactionHistory;
