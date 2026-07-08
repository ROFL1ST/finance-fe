// BE uses entry_type (not type) based on SummaryService CASE WHEN entry_type
export type EntryType = 'debit' | 'credit';

export interface Transaction {
  id: number;
  transaction_date: string;
  description: string;
  account_id: number;
  entry_type: EntryType; // BE column is entry_type
  amount: number;
  account?: {
    id: number;
    code: string;
    name: string;
    account_type: string;
  };
  created_at: string;
}

export interface TransactionPayload {
  transaction_date: string;
  description: string;
  account_id: number;
  entry_type: EntryType;
  amount: number;
}

// Filter params: transaction_date (exact), account (name ILIKE search)
export interface TransactionFilters {
  transaction_date?: string;
  account?: string;
}
