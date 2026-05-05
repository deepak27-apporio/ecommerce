"use client";

import { ReactNode, useState } from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { Column } from "react-table";

type SortState<T> = {
  key: keyof T;
  desc: boolean;
} | null;

function TableHOC<T extends object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC() {
    const [sort, setSort] = useState<SortState<T>>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 6;

    const sortedData = sort
      ? [...data].sort((a, b) => {
        const aValue = a[sort.key];
        const bValue = b[sort.key];
        const result = String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
        });

        return sort.desc ? -result : result;
      })
      : data;

    const pageCount = Math.max(Math.ceil(sortedData?.length / pageSize), 1);
    const page = showPagination
      ? sortedData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
      : sortedData;

    const changeSort = (key: keyof T) => {
      setSort((current) =>
        current?.key === key ? { key, desc: !current.desc } : { key, desc: false }
      );
      setPageIndex(0);
    };
    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>

        <table className="table">
          <thead>
            <tr >
              {columns?.map((column) => {
                const key = column.accessor as keyof T;
                const sorted = sort?.key === key;
                return (
                  <th key={String(key)} className="bg-black">
                    <button type="button" onClick={() => changeSort(key)}>
                      {String(column.Header)}
                      {sorted && (
                        <span className="text-white">
                          {sort.desc ? (
                            <AiOutlineSortDescending />
                          ) : (
                            <AiOutlineSortAscending />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {page?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => {
                  const key = column.accessor as keyof T;

                  return <td key={String(key)}>{row[key] as ReactNode}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {showPagination && (
          <div className="table-pagination">
            <button
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((current) => Math.max(current - 1, 0))}
            >
              Prev
            </button>
            <span>{`${pageIndex + 1} of ${pageCount}`}</span>
            <button
              disabled={pageIndex + 1 >= pageCount}
              onClick={() =>
                setPageIndex((current) => Math.min(current + 1, pageCount - 1))
              }
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;
