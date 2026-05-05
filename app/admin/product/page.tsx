"use client";

import { getAllProducts } from "@/app/api/admin/productApi";
import TableHOC from "@/app/components/admin/TableHOC";
import TableSkeleton from "@/app/components/TableSkeleton";

import Link from "next/link";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Column } from "react-table";

interface DataType {
  photo: ReactElement;
  name: string;
  price: string;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Photo", accessor: "photo" },
  { Header: "Name", accessor: "name" },
  { Header: "Price", accessor: "price" },
  { Header: "Stock", accessor: "stock" },
  { Header: "Action", accessor: "action" },
];

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getAllProducts();
        if (res?.success) {
          setProductsList(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rows = useMemo<DataType[]>(
    () =>
      productsList.map((product: any) => ({
        photo: (
          <img
            src={
              product.attachments?.length > 0
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.attachments[0]?.url}`
                : "/placeholder.png"
            }
            alt={product.name}
          />
        ),
        name: product.name,
        price: `Rs ${product.price.toLocaleString("en-IN")}`,
        stock: product.stock,
        action: (
          <Link href={`/admin/product/${product.id}`}>
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
    rows?.length > 6,
  )();

  if (loading) return <TableSkeleton />;

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