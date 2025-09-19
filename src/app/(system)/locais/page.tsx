"use client";

import { TabelaLocais } from "@/app/modules/locais/table";

import { usePage } from "./use-page";

export default function Page() {
  return (
    <div className="mb-2 h-full overflow-auto rounded-b-md bg-white p-6 sm:mx-1">
      <TabelaLocais />
    </div>
  );
}
