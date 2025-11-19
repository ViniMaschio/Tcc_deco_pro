import type { SortingType } from "@/components/sort-table";

export function buildOrderBy<SortableField extends string>(
  sort: string | undefined,
  sortableFields: Set<SortableField>,
  options?: {
    defaultField?: SortableField;
    defaultDirection?: "asc" | "desc";
  },
): Record<SortableField, "asc" | "desc"> {
  const { defaultField, defaultDirection } = {
    defaultField: "id" as SortableField,
    defaultDirection: "desc" as const,
    ...options,
  };

  if (!sort)
    return { [defaultField]: defaultDirection } as Record<
      SortableField,
      "asc" | "desc"
    >;

  const [field, dirRaw] = sort.split(":");
  const direction = dirRaw === "asc" ? "asc" : "desc";

  if (field && sortableFields.has(field as SortableField)) {
    return { [field as SortableField]: direction } as Record<
      SortableField,
      "asc" | "desc"
    >;
  }

  return { [defaultField]: defaultDirection } as Record<
    SortableField,
    "asc" | "desc"
  >;
}

type PaginationInput = {
  currentPage: number;
  perPage: number;
};

export function buildQueryStringFrom(
  filters: Record<string, unknown>,
  pagination: PaginationInput,
): string {
  const params: Record<string, string> = {
    page: String(pagination.currentPage),
    perPage: String(pagination.perPage),
  };


  const sorting = filters?.sorting as SortingType | undefined;
  if (sorting?.name && sorting?.type) {
    params.sort = `${sorting.name}:${sorting.type}`;
  }


  Object.entries(filters || {}).forEach(([key, value]) => {
    if (key === "sorting") return; // já tratado

    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;

    params[key] = String(value);
  });

  return new URLSearchParams(params).toString();
}
