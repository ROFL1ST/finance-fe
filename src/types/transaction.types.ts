export type EntryType = 'debit' | 'credit';

export interface Transaction {
  id: number;
  transaction_date: string;
  description: string;
  account_id: number;
  entry_type: EntryType; 
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


export interface TransactionFilters {
  transaction_date?: string;
  account?: string;
}
