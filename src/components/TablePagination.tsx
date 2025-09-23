import type { PaginationTable } from "@/app/api/types";
import { usePaginationStore } from "@/store/pagination";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type TablePaginationProps = {
  pagination: PaginationTable;
  customPagination?: number[];
  disableSelect?: boolean;
  setPagination: (pagination: PaginationTable) => void;
};

export const TablePagination = ({
  pagination,
  disableSelect,
  customPagination,
  setPagination,
}: TablePaginationProps) => {
  const changePerPage = usePaginationStore((state) => state.changePerPage);

  const generatePaginationItems = (m: number, c: number) => {
    const current = c;
    const last = m;
    const delta = 1;
    const left = current - delta;
    const right = current + delta + 1;
    const range = [];
    const rangeWithDots = [];
    let l: any;

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const selectPage = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const nextPage = () => {
    setPagination({ ...pagination, currentPage: pagination.currentPage + 1 });
  };

  const previousPage = () => {
    setPagination({ ...pagination, currentPage: pagination.currentPage - 1 });
  };

  const handleChangePerPage = (value: string) => {
    changePerPage(+value);
    setPagination({ ...pagination, perPage: Number(value), currentPage: 1 });
  };

  return (
    <div className="sticky bottom-0 flex flex-col items-center justify-between rounded-b-xl border-t-[1px] bg-white px-4 md:flex-row dark:bg-[#020817]">
      <div>
        <p className="flex gap-2">
          <span className="font-bold">{pagination.count || 0}</span> Registros
        </p>
      </div>
      <Pagination className="p-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              disabled={pagination.currentPage < 2}
              onClick={() => selectPage(1)}
              href="#"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              disabled={pagination.currentPage < 2}
              onClick={previousPage}
              href="#"
            />
          </PaginationItem>
          {generatePaginationItems(
            pagination.pagesCount,
            pagination.currentPage,
          ).map((item, index) => {
            if (item === "...") {
              return (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            if (typeof item !== "number") return <></>;
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => selectPage(item)}
                  isActive={
                    typeof item === "number" && item === pagination.currentPage
                  }
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              disabled={pagination.currentPage >= pagination.pagesCount}
              href="#"
              onClick={nextPage}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              disabled={pagination.currentPage >= pagination.pagesCount}
              onClick={() => selectPage(pagination.pagesCount)}
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="w-auto p-2 text-end text-xs">
        <div className="flex items-center gap-1">
          <Select
            disabled={disableSelect}
            onValueChange={handleChangePerPage}
            value={pagination.perPage.toString()}
          >
            <SelectTrigger className="mr-1 w-fit px-2 py-0 outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {customPagination ? (
                customPagination.map((c, index) => (
                  <SelectItem key={index} value={c.toString()}>
                    {c}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <span className="text-nowrap"> Linhas por página</span>
        </div>
      </div>
    </div>
  );
};
