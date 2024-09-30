import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

// Define the interface for each transaction
interface Transaction {
  id: number;
  script_name: string;
  quantity: number;
  final_sell_value: string;
  total_sell_value: number;
  sell_date: string;
  account_name: string;
  type: string; // "buy" or "sell"
}

export function Sold() {
  const [soldTransactions, setSoldTransactions] = useState<Transaction[]>([]); // Sold transactions
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch sold transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/transactions");
        const transactionData: Transaction[] = await response.json();

        // Filter out only 'sell' transactions
        const sold = transactionData.filter(transaction => transaction.type === 'sell');
        setSoldTransactions(sold);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false); // Ensure loading is false even on error
      }
    };

    fetchTransactions();
  }, []); // No dependencies to prevent infinite loop

  // Format purchase date as Month/Year
  const formatPurchaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Sold Transactions</CardTitle>
        <CardDescription>View and manage your sold transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Conditional rendering based on loading state */}
        {loading ? (
          <p>Loading sold transactions...</p>
        ) : soldTransactions.length === 0 ? (
          <p>No sold transactions found.</p>
        ) : (
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Script Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Each Selling Value</TableHead>
                <TableHead>Total Selling Value</TableHead>
                <TableHead>Sell Date</TableHead>
                <TableHead>Sell Month & Year</TableHead>
                <TableHead>Account Holder</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {soldTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.script_name}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{parseFloat(transaction.final_sell_value).toFixed(2)}</TableCell>
                  <TableCell>{transaction.total_sell_value ? transaction.total_sell_value : 'N/A'}</TableCell>
                  <TableCell>{new Date(transaction.sell_date).toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })}</TableCell>
                  <TableCell>{formatPurchaseDate(transaction.sell_date)}</TableCell>
                  <TableCell>{transaction.account_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
