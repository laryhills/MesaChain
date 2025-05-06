import TransactionHistoryTable from "./transactionHistory";

export const metadata = {
  title: 'Transactions History - MesaChain',
  description: 'View and manage your transactions history',
};

export default function TransactionHistoryPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <TransactionHistoryTable />
      </div>
    </main>
  );
} 
