import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User, initialUsers } from "@/lib/users-data";

interface UsersStore {
  users: User[];
  setUsers: (users: User[]) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  users: initialUsers,

  setUsers: (users) => set({ users }),

  updateUser: (id, data) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, ...data } : u
      ),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
}));


export type EditMode = "row" | "cell";

export interface CellAddress {
  rowId: string;
  columnId: string;
}

export interface EditingState {
  editingRows: Record<string, Record<string, unknown>>;
  activeCell: CellAddress | null;
  validationErrors: Record<string, Record<string, string>>;
}

export interface TableStoreActions {
  startRowEdit: (rowId: string, rowData: Record<string, unknown>) => void;
  startCellEdit: (rowId: string, columnId: string, rowData: Record<string, unknown>) => void;
  updateDraft: (rowId: string, field: string, value: unknown) => void;
  setValidationError: (rowId: string, field: string, error: string) => void;
  clearValidationError: (rowId: string, field: string) => void;
  cancelEdit: (rowId: string) => void;
  cancelAllEdits: () => void;
  clearActiveCell: () => void;
  isRowEditing: (rowId: string) => boolean;
  getDraft: (rowId: string) => Record<string, unknown> | undefined;
  getErrors: (rowId: string) => Record<string, string>;
}

interface TableStore extends EditingState, TableStoreActions { }

export const useTableStore = create<TableStore>()(
  devtools(
    (set, get) => ({
      editingRows: {},
      activeCell: null,
      validationErrors: {},

      startRowEdit: (rowId, rowData) => {
        set((state) => ({
          editingRows: {
            ...state.editingRows,
            [rowId]: { ...rowData },
          },
          activeCell: null,
        }));
      },

      startCellEdit: (rowId, columnId, rowData) => {
        set((state) => ({
          editingRows: {
            ...state.editingRows,
            [rowId]: state.editingRows[rowId] ?? { ...rowData },
          },
          activeCell: { rowId, columnId },
        }));
      },

      updateDraft: (rowId, field, value) => {
        set((state) => ({
          editingRows: {
            ...state.editingRows,
            [rowId]: {
              ...(state.editingRows[rowId] ?? {}),
              [field]: value,
            },
          },
        }));
      },

      setValidationError: (rowId, field, error) => {
        set((state) => ({
          validationErrors: {
            ...state.validationErrors,
            [rowId]: {
              ...(state.validationErrors[rowId] ?? {}),
              [field]: error,
            },
          },
        }));
      },

      clearValidationError: (rowId, field) => {
        set((state) => {
          const rowErrors = { ...(state.validationErrors[rowId] ?? {}) };
          delete rowErrors[field];
          return {
            validationErrors: {
              ...state.validationErrors,
              [rowId]: rowErrors,
            },
          };
        });
      },

      cancelEdit: (rowId) => {
        set((state) => {
          const newEditingRows = { ...state.editingRows };
          delete newEditingRows[rowId];
          const newErrors = { ...state.validationErrors };
          delete newErrors[rowId];
          return {
            editingRows: newEditingRows,
            validationErrors: newErrors,
            activeCell:
              state.activeCell?.rowId === rowId ? null : state.activeCell,
          };
        });
      },

      cancelAllEdits: () => {
        set({ editingRows: {}, activeCell: null, validationErrors: {} });
      },

      clearActiveCell: () => {
        set({ activeCell: null });
      },

      isRowEditing: (rowId) => {
        return rowId in get().editingRows;
      },

      getDraft: (rowId) => {
        return get().editingRows[rowId];
      },

      getErrors: (rowId) => {
        return get().validationErrors[rowId] ?? {};
      },
    }),
    { name: "table-store" }
  )
);