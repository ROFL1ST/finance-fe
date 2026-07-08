export type EntryType = 'debit' | 'credit';

// BE: single entry per transaction (not an array)
export interface Transaction {
  id: number;
  transaction_date: string; // BE uses transaction_date, not date
  description: string;
  account_id: number;
  type: EntryType;
  amount: number;
  account?: {
    id: number;
    code: string;
    name: string;
    type: string;
  };
  created_at: string;
}

export interface TransactionPayload {
  transaction_date: string;
  description: string;
  account_id: number;
  type: EntryType;
  amount: number;
}

// Filter params accepted by BE: transaction_date, account
export interface TransactionFilters {
  transaction_date?: string;
  account?: string; // account name search
}
