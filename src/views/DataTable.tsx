import { parse, format } from "date-fns";
import { useContext, useEffect, useMemo } from "react";
import { Column, useSortBy, useTable } from "react-table";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import StatsContext from "../store/statsContext";

const DataTable = () => {
  const { stats } = useContext(StatsContext);

  const data = useMemo(
    () =>
      stats.map((stat) => {
        const currencyLocaleOptions: Intl.NumberFormatOptions = {
          maximumFractionDigits: 2,
        };
        return {
          date: format(
            parse(stat.conract.substring(2), "yyMMddHH", new Date()),
            "yyyy-MM-dd HH:mm"
          ),
          totalTransactionAmount: stat.totalTransactionAmount.toFixed(2),
          totalTransactionFee: stat.totalTransactionFee.toLocaleString(
            "tr",
            currencyLocaleOptions
          ),
          weightedAveragePrice: stat.weightedAveragePrice.toLocaleString(
            "tr",
            currencyLocaleOptions
          ),
        };
      }),
    [stats]
  );

  const columns: Column<{
    date: string;
    totalTransactionAmount: string;
    totalTransactionFee: string;
    weightedAveragePrice: string;
  }>[] = useMemo(
    () => [
      {
        Header: "Tarih",
        accessor: "date",
      },
      {
        Header: "Toplam İşlem Miktarı (MWh)",
        accessor: "totalTransactionAmount",
      },
      {
        Header: "Toplam İşlem Tutarı (TL)",
        accessor: "totalTransactionFee",
      },
      {
        Header: "Ağırlık Ortalama Fiyat (TL/MWh)",
        accessor: "weightedAveragePrice",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  useEffect(() => {
    const tableHeader = document.getElementsByTagName("thead")[0];

    // prevent selection on double click
    const mouseDownHandler = (e: MouseEvent) => {
      if (e.detail > 1) e.preventDefault();
    };

    tableHeader.addEventListener("mousedown", mouseDownHandler, false);

    return () => {
      tableHeader.removeEventListener("mousedown", mouseDownHandler);
    };
  }, []);

  return (
    <div className="table-container">
      <table className="table" {...getTableProps()}>
        <thead className="table-header">
          {headerGroups.map((headerGroup) => (
            <tr
              className="table-header--row"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  className="table-header--cell"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <div>
                    <span
                      className={`table-header--sort-icon${
                        column.isSorted ? " active" : ""
                      }`}
                    >
                      {column.isSortedDesc ? (
                        <CaretDownOutlined />
                      ) : (
                        <CaretUpOutlined />
                      )}
                    </span>
                    {column.render("Header")}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="table-body" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr className="table-body--row" {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className="table-body--cell" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
