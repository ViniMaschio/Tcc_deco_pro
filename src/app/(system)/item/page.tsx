"use client";

import { PlusCircle } from "lucide-react";

import { Item } from "@/app/api/item/types";
import { itemFilterCols } from "@/app/modules/item/columns";
import { ItemDataTable } from "@/app/modules/item/data-table";
import { ItemModal } from "@/app/modules/item/modal";
import { IconButton } from "@/components/icon-button";
import { PageFilter } from "@/components/page-filter";

import { usePage } from "./use-page";

export default function Page() {
  const {
    filters,
    item,
    isLoading,
    showState,
    pagination,
    isDeleting,
    setItem,
    itemData,
    afterSubmit,
    columns,
    removeItem,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
  } = usePage();

  return (
    <>
      <div className="flex h-[calc(100dvh-100px)] w-full flex-col transition-all duration-500 sm:mx-1">
        <div>
          <div className="flex flex-col bg-white p-6">
            <div className="flex justify-end">
              <div className="flex gap-2">
                <PageFilter
                  changeFilter={handleChangeFilters}
                  clearFilters={handleClearFilters}
                  filterCols={itemFilterCols}
                  filters={filters}
                />

                <IconButton
                  icon={<PlusCircle size={20} />}
                  onClick={() => changeShowState("showModal", true)}
                  tooltip="Adicionar"
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </div>

        <ItemDataTable
          columns={columns}
          data={itemData || []}
          pagination={pagination}
          setPagination={changePagination}
          changeFilters={handleChangeFilters}
          filters={filters}
          isLoading={isLoading}
          showState={showState}
          changeShowState={changeShowState}
          removeItem={removeItem}
          isDeleting={isDeleting}
        />
      </div>

      {showState.showModal ? (
        <ItemModal
          open={showState.showModal}
          changeOpen={(value) => {
            changeShowState("showModal", value);
            setItem({} as Item);
          }}
          afterSubmit={afterSubmit}
          item={item}
        />
      ) : null}
    </>
  );
}
