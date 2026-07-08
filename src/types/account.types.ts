export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  is_active: boolean;
  parent_id: number | null;
  parent?: Account;
  children?: Account[];
  balance?: number;
}

export interface AccountPayload {
  name: string;
  type: AccountType;
  is_active: boolean;
  parent_id?: number | null;
}

// BE wraps all responses in: { success, message, data }
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
