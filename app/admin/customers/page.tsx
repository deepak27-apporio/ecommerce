"use client";

import TableHOC from "@/app/components/admin/TableHOC";
import { customers } from "@/app/lib/dummy-data";
/* eslint-disable @next/next/no-img-element */

import { ReactElement, useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Avatar", accessor: "avatar" },
  { Header: "Name", accessor: "name" },
  { Header: "Gender", accessor: "gender" },
  { Header: "Email", accessor: "email" },
  { Header: "Role", accessor: "role" },
  { Header: "Action", accessor: "action" },
];

const Customers = () => {
  const rows = useMemo<DataType[]>(
    () =>
      customers.map((customer) => ({
        avatar: (
          <img
            style={{ borderRadius: "50%" }}
            src={customer.photo}
            alt={customer.name}
          />
        ),
        name: customer.name,
        email: customer.email,
        gender: customer.gender,
        role: customer.role,
        action: (
          <button aria-label={`Delete ${customer.name}`} onClick={() => alert("Dummy data only")}>
            <FaTrash />
          </button>
        ),
      })),
    []
  );

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
      <main>{Table}</main>
  );
};

export default Customers;
