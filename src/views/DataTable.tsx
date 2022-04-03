import { parse, format } from "date-fns";
import { useContext, useEffect, useMemo } from "react";
import { Column, Row, SortByFn, useSortBy, useTable } from "react-table";
import StatsContext from "../store/statsContext";

const DataTable = () => {
  const { stats } = useContext(StatsContext);

  const data = useMemo(
    () =>
      stats.map((statsItem): Stats => {
        return {
          conract: statsItem.conract,
          totalTransactionAmount: statsItem.totalTransactionAmount,
          totalTransactionFee: statsItem.totalTransactionFee,
          weightedAveragePrice: statsItem.weightedAveragePrice,
        };
      }),
    [stats]
  );

  const columns: Column<Stats>[] = useMemo(() => {
    const currencyLocaleOptions: Intl.NumberFormatOptions = {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "currency",
      currency: "TRY",
    };

    const sortHandler: SortByFn<Stats> = (
      a: Row<Stats>,
      b: Row<Stats>,
      id: string
      // desc: boolean | undefined
    ): number => {
      switch (id) {
        case "date":
          const [aDate, bDate] = [
            parse(a.values[id], "dd.MM.yyyy HH:mm", new Date()),
            parse(b.values[id], "dd.MM.yyyy HH:mm", new Date()),
          ];

          return bDate.getTime() - aDate.getTime();
        case "tta":
          return (
            a.original.totalTransactionAmount -
            b.original.totalTransactionAmount
          );
        case "ttf":
          return (
            a.original.totalTransactionFee - b.original.totalTransactionFee
          );
        case "wap":
          return (
            a.original.weightedAveragePrice - b.original.weightedAveragePrice
          );

        default:
          return 0;
      }
    };

    return [
      {
        Header: "Tarih",
        id: "date",
        accessor: (a) =>
          format(
            parse(a.conract.substring(2), "yyMMddHH", new Date()),
            "dd.MM.yyyy HH:mm"
          ),
        sortType: sortHandler,
      },
      {
        Header: "Toplam İşlem Miktarı (MWh)",
        id: "tta",
        accessor: (a) => a.totalTransactionAmount.toFixed(2),
        sortType: sortHandler,
      },
      {
        Header: "Toplam İşlem Tutarı (TL)",
        id: "ttf",
        accessor: (a) =>
          a.totalTransactionFee.toLocaleString("tr-TR", currencyLocaleOptions),
        sortType: sortHandler,
      },
      {
        Header: "Ağırlık Ortalama Fiyat (TL/MWh)",
        id: "wap",
        accessor: (a) =>
          a.weightedAveragePrice.toLocaleString("tr-TR", currencyLocaleOptions),
        sortType: sortHandler,
      },
    ];
  }, []);

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
                      {column.isSortedDesc ? "▼" : "▲"}
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
