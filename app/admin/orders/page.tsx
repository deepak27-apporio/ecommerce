"use client";

import { getAllOrders } from "@/app/api/admin/orderApi";
import TableHOC from "@/app/components/admin/TableHOC";
import OrderActionDropdown from "@/app/components/OrderActionDropdown ";
import { useFetch } from "@/app/hooks/useFetch";
import { ReactElement, useMemo } from "react";
import { Column } from "react-table";

interface DataType {
  orderid: string;
  name: string;
  date: string;
  totalprice: number;
  paymentstatus: ReactElement;
  orderstatus: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "OrderId", accessor: "orderid" },
  { Header: "Name", accessor: "name" },
  { Header: "Date", accessor: "date" },
  { Header: "Total Price", accessor: "totalprice" },
  { Header: "Payment Status", accessor: "paymentstatus" },
  // { Header: "Order Status", accessor: "orderstatus" },
  { Header: "Action", accessor: "action" },
];

const Orders = () => {
  const { data, setData, isLoading } = useFetch(() => getAllOrders(), []);
  const orders = data?.orders;

  const rows = useMemo(
    () =>
      orders?.map((order: any) => ({
        orderid: order.razorpayOrderId,
        name: `${order.address?.fullName || "N/A"}`,
        date: `${new Date(order.createdAt).toLocaleDateString("en-US")}`,
        totalprice: `₹${order.totalAmount.toFixed(2)}`,
        paymentstatus: (
          <span
            className={
              order.payment?.status?.toLowerCase() === "pending"
                ? " text-yellow-500"
                : order.payment?.status?.toLowerCase() === "success"
                  ? " text-green-500"
                  : " text-red-800"
            }
          >
            {order.payment?.status.toLowerCase() || "processing"}
          </span>
        ),
        // orderstatus: (
        //   <span
        //     className={
        //       order.status.toLowerCase() === "processing"
        //         ? " text-yellow-500"
        //         : order.status.toLowerCase() === "shipped"
        //           ? "text-blue-800"
        //           : "text-purple-800"
        //     }
        //   >
        //     {order.status.toLowerCase()==="created" ? "confirmed" : order.status.toLowerCase() || "processing"}
        //   </span>
        // ),
        action: (
          <OrderActionDropdown
            orderId={order.id}
            currentStatus={order.status}
          />
        ),
      })),
    [orders],
  );

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Orders",
    rows?.length > 6,
  )();
  return <main>{Table}</main>;
};

export default Orders;
