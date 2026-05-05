"use client";

import Link from "next/link";
import { ReactElement, useMemo } from "react";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { orders } from "../lib/dummy-data";

interface DataType {
  user: string;
  amount: string;
  discount: string;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Customer", accessor: "user" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Discount", accessor: "discount" },
  { Header: "Quantity", accessor: "quantity" },
  { Header: "Status", accessor: "status" },
  { Header: "Action", accessor: "action" },
];

const Transaction = () => {
  const rows = useMemo<DataType[]>(
    () =>
      orders.map((order) => ({
        user: order.user.name,
        amount: `Rs ${order.total.toLocaleString("en-IN")}`,
        discount: `Rs ${order.discount.toLocaleString("en-IN")}`,
        quantity: order.orderItems.length,
        status: (
          <span
            className={
              order.status === "Processing"
                ? "red"
                : order.status === "Shipped"
                  ? "green"
                  : "purple"
            }
          >
            {order.status}
          </span>
        ),
        action: <Link href={`/admin/transaction/${order._id}`}>Manage</Link>,
      })),
    [],
  );

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6,
  )();

  return <main>{Table}</main>;
};

export default Transaction;
