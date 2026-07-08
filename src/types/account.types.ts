export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface Account {
  id: number;
  code: string;
  name: string;
  account_type: AccountType;
  is_active: boolean;
  parent_id: number | null;
  parent?: Account;
  children?: Account[];
  balance?: number;
}

export interface AccountPayload {
  name: string;
  account_type: AccountType;
  is_active: boolean;
  parent_id?: number | null;
}

// BE wraps all responses in: { success, message, data }
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
