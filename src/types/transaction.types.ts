export type EntryType = 'debit' | 'credit';

export interface TransactionEntry {
  account_id: number;
  account?: {
    id: number;
    code: string;
    name: string;
  };
  type: EntryType;
  amount: number;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  entries: TransactionEntry[];
  created_at: string;
}

export interface TransactionPayload {
  date: string;
  description: string;
  entries: Omit<TransactionEntry, 'account'>[];
}

export interface TransactionFilters {
  date_from?: string;
  date_to?: string;
  account_id?: number;
}
