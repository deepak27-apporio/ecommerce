"use client";

import { useDebounce } from "@/app/hooks/useDebounce";
import { ReactNode, useState, useMemo, useEffect } from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { Column } from "react-table";

type SortState<T> = { key: keyof T; desc: boolean } | null;

interface ServerPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

function TableHOC<T extends object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false,
  search: string,
  setSearch: (data: any) => void,
  serverPagination?: ServerPagination,
) {
  return function HOC() {
    const [sort, setSort] = useState<SortState<T>>(null);
    const [pageIndex, setPageIndex] = useState(0);

    const [inputValue, setInputValue] = useState(search);

    const debouncedSearch = useDebounce(inputValue, 500);

    const pageSize = 10;

    useEffect(() => {
      setSearch(debouncedSearch);
      setPageIndex(0);
    }, [debouncedSearch]);

    const filtered = useMemo(() => {
      if (!search?.trim()) return data;
      return data?.filter((row) =>
        Object.values(row as object).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }, [data, search]);

    const sortedData = useMemo(() => {
      if (!sort) return filtered;
      return [...filtered].sort((a, b) => {
        const result = String(a[sort.key]).localeCompare(
          String(b[sort.key]),
          undefined,
          { numeric: true },
        );
        return sort.desc ? -result : result;
      });
    }, [filtered, sort]);

    const pageCount = Math.max(Math.ceil(sortedData?.length / pageSize), 1);
    const page =
      showPagination && !serverPagination
        ? sortedData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
        : sortedData;

    const changeSort = (key: keyof T) => {
      setSort((cur) =>
        cur?.key === key ? { key, desc: !cur.desc } : { key, desc: false },
      );
      setPageIndex(0);
    };

    const statusColors: Record<string, string> = {
      Pending: "bg-amber-100 text-amber-800",
      Shipped: "bg-blue-100 text-blue-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };

    return (
      <div className={containerClassname}>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h2 className="text-lg font-medium flex-1">{heading}</h2>
          <input
            type="text"
            placeholder="Search..."
            value={inputValue}              
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 w-56"
          />
        </div>

        <div className="border border-gray-100 rounded-xl overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {columns.map((column) => {
                  const key = column.accessor as keyof T;
                  const isSorted = sort?.key === key;
                  return (
                    <th
                      key={String(key)}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wide"
                    >
                      <button
                        type="button"
                        onClick={() => changeSort(key)}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        {String(column.Header)}
                        {isSorted ? (
                          sort!.desc ? (
                            <AiOutlineSortDescending />
                          ) : (
                            <AiOutlineSortAscending />
                          )
                        ) : (
                          <span className="opacity-0 group-hover:opacity-40">
                            <AiOutlineSortAscending />
                          </span>
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {page?.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-gray-400">
                    No data found
                  </td>
                </tr>
              ) : (
                page?.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    {columns?.map((column) => {
                      const key = column.accessor as keyof T;
                      const value = row[key];
                      const isStatus = key === "status";
                      return (
                        <td key={String(key)} className="px-4 py-3">
                          {isStatus ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[String(value)] ?? "bg-gray-100 text-gray-700"}`}>
                              {String(value)}
                            </span>
                          ) : (
                            (value as ReactNode)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {serverPagination && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Page {serverPagination.currentPage} of {serverPagination.totalPages} — {serverPagination.totalItems} total
              </span>
              <div className="flex gap-2">
                <button
                  disabled={!serverPagination.hasPrevPage}
                  onClick={() => serverPagination.onPageChange(serverPagination.currentPage - 1)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1.5 text-xs text-gray-500">
                  {serverPagination.currentPage} / {serverPagination.totalPages}
                </span>
                <button
                  disabled={!serverPagination.hasNextPage}
                  onClick={() => serverPagination.onPageChange(serverPagination.currentPage + 1)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {showPagination && !serverPagination && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                {pageIndex * pageSize + 1}–
                {Math.min(pageIndex * pageSize + pageSize, sortedData.length)} of {sortedData.length}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pageIndex === 0}
                  onClick={() => setPageIndex((c) => Math.max(c - 1, 0))}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1.5 text-xs text-gray-500">
                  {pageIndex + 1} / {pageCount}
                </span>
                <button
                  disabled={pageIndex + 1 >= pageCount}
                  onClick={() => setPageIndex((c) => Math.min(c + 1, pageCount - 1))}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
}

export default TableHOC;