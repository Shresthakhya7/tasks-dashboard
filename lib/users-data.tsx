import React from "react";
import { TableColumnDef } from "./types";
export type UserRole = "Admin" | "Manager" | "Support" | "User";


export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
  department: string;
  status: string;
  createdAt: string;
  // location?: string;
}

export const ROLES = [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "Support", value: "Support" },
  { label: "User", value: "User" },
];

export const STATUSES = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "On Leave", value: "on-leave" },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  'on-leave': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export const userColumns: TableColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      type: "text",
      editable: true,
      placeholder: "Full name",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      type: "email",
      editable: true,
      placeholder: "user@example.com",
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    meta: {
      type: "number",
      editable: true,
      placeholder: "9876543244",
    },
  },
  {
    accessorKey: "salary",
    header: "Salary ($)",
    meta: {
      type: "number",
      editable: true,
      placeholder: "50000",
    },
    cell: ({ getValue }) => {
      const v = getValue() as number;
      return (
        <span className="font-mono text-slate-700">
          {v?.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
        </span>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    meta: {
      type: "text",
      editable: true,
      placeholder: "sales"
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: {
      type: "select",
      editable: true,
      options: ROLES,
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      type: "badge",
      editable: true,
      options: STATUSES,
      badgeClass: (v: string) => STATUS_COLORS[v] ?? "",
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    meta: { editable: false },
    cell: ({ getValue }) => (
      <span className="text-slate-500 text-xs">
        {new Date(getValue() as string).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
  // {
  //   accessorKey: "location",
  //   header: "Location",
  //   meta: {
  //     type: "text",
  //     editable: true,
  //     placeholder: "Kathmandu, Nepal",
  //   },
  // },
];

export const initialUsers: User[] = [
  {
    id: "1",
    name: "Aria Chen",
    email: "aria.chen@acme.io",
    department: "Engineering",
    role: "Admin",
    phone: "9873373738",
    salary: 145000,
    status: "active",
    createdAt: "2021-03-15",
  },
  {
    id: "2",
    name: "Marcus Webb",
    email: "m.webb@acme.io",
    department: "Design",
    role: "Manager",
    phone: "9876543212",
    salary: 115000,
    status: "active",
    createdAt: "2020-08-01",
  },
  {
    id: "3",
    name: "Priya Nair",
    email: "priya.nair@acme.io",
    department: "Marketing",
    role: "Support",
    phone: "9872435464",
    salary: 85000,
    status: "on-leave",
    createdAt: "2022-01-10",
  },
  {
    id: "4",
    name: "Tyler Johnson",
    email: "t.johnson@acme.io",
    department: "Sales",
    role: "Support",
    phone: "9876273645",
    salary: 85000,
    status: "active",
    createdAt: "2023-04-22",
  },
  {
    id: "5",
    name: "Lena Müller",
    email: "lena.muller@acme.io",
    department: "Engineering",
    role: "User",
    phone: "9876535241",
    salary: 75000,
    status: "active",
    createdAt: "2021-11-30",
  },
  {
    id: "6",
    name: "James Okafor",
    email: "james.o@acme.io",
    department: "Finance",
    role: "Support",
    salary: 85000,
    phone: "9824365342",
    status: "inactive",
    createdAt: "2019-07-14",
  },
  {
    id: "7",
    name: "Sofia Romero",
    email: "sofia.r@acme.io",
    department: "HR",
    role: "User",
    phone: "9785635343",
    salary: 75000,
    status: "active",
    createdAt: "2022-09-05",
  },
];