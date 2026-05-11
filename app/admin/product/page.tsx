"use client";

import {
  getAllAdminProducts,
  getAllProducts,
  updateProduct,
  updateProductStatus,
} from "@/app/api/admin/productApi";
import ActiveToggle from "@/app/components/ActiveToggle";
import TableHOC from "@/app/components/admin/TableHOC";
import TableSkeleton from "@/app/components/TableSkeleton";
import { useFetch } from "@/app/hooks/useFetch";

import Link from "next/link";
import { ReactElement, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Column } from "react-table";

interface DataType {
  photo: ReactElement;
  name: string;
  price: string;
  stock: number;
  active: boolean;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Photo", accessor: "photo" },
  { Header: "Name", accessor: "name" },
  { Header: "Price", accessor: "price" },
  { Header: "Stock", accessor: "stock" },
  { Header: "Active", accessor: "active" },
  { Header: "Action", accessor: "action" },
];

const Products = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, setData, isLoading } = useFetch(
    () => getAllAdminProducts({ page, search }),
    [page, search],
  );
  const productsList = data?.data;
  const pagination = data?.pagination;

  const rows = useMemo<DataType[]>(
    () =>
      productsList?.map((product: any) => ({
        photo: (
          <img
            src={
              product.attachments?.length > 0
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.attachments[0]?.url}`
                : "/placeholder.png"
            }
            alt={product.name}
            className="h-20 w-20"
          />
        ),
        name: product.name,
        price: `Rs ${product.price.toLocaleString("en-IN")}`,
        stock: product.stock,
        active: (
          <ActiveToggle
            productId={product.id}
            initialActive={product.isActive}
            onToggle={async (id, newStatus) => {
              await updateProductStatus(Number(id), newStatus);
            }}
          />
        ),
        action: (
          <Link
            href={`/admin/product/${product.id}`}
            className="bg-black text-white! px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Manage
          </Link>
        ),
      })),
    [productsList],
  );

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    false,
    search,
    setSearch,
    pagination
      ? {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalOrders,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage,
          onPageChange: setPage,
        }
      : undefined,
  )();

  if (isLoading) return <TableSkeleton />;

  return (
    <>
      <main>{Table}</main>
      <Link href="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </>
  );
};

export default Products;
