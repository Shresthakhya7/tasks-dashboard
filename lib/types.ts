import { LucideIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

export interface Menu {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
}

export type FieldType = "text" | "number" | "email" | "select" | "badge";

export interface SelectOption {
  label: string;
  value: string;
}

export interface ColumnMeta {
  type?: FieldType;
  editable?: boolean;
  options?: SelectOption[]; // for select/badge types
  validate?: (value: unknown) => string | undefined;
  badgeClass?: (value: string) => string;
   placeholder?: string;
}

// Extend TanStack's ColumnDef to include our meta
export type TableColumnDef<TData> = ColumnDef<TData> & {
  meta?: ColumnMeta;
};

export interface DataTableProps<TData extends { id: string }> {
  data: TData[];
  columns: TableColumnDef<TData>[];
  editMode?: "row" | "cell" | "both";
  onEdit?: (rowId: string, rowData: TData) => void;
  onSave?: (rowId: string, updatedData: TData, originalData: TData) => Promise<void> | void;
  onDelete?: (rowId: string, rowData: TData) => Promise<void> | void;
  caption?: string;
  showRowNumbers?: boolean;
  emptyMessage?: string;
  enableColumnVisibility?: boolean;
}