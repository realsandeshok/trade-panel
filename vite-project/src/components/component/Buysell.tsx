import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

// Interface Definitions
interface Transaction {
  id: number;
  script_name: string;
  quantity: string;
  market_cost: string;
  brokerage: string;
  purchase_date: string; // Ensure this is in a valid date format
  account_name: string;
  type: string; // 'buy' or 'sell'
  eachPrice: number;
  purchaseValue: number;
  final_sell_value:number;
  total_sell_value:number;
}

const Buysell = () => {
  const [buyTransactions, setBuyTransactions] = useState<Transaction[]>([]);
  const [sellTransactions, setSellTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);



  // Fetch transactions data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3000/transactions'); // Adjust this to your transactions API endpoint
        const data: Transaction[] = await response.json();

        // Filter buy and sell transactions
        const allBuyTransactions = data.filter(t => t.type === 'buy');
        const allSellTransactions = data.filter(t => t.type === 'sell');

        setBuyTransactions(allBuyTransactions);
        setSellTransactions(allSellTransactions);

      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchTransactions();
  }, []);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Buy and Sell</CardTitle>
        <CardDescription>View and manage your buy and sell transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          {/* Buy Transactions Table */}
          <TabsContent value="buy">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purchase Month & Year</TableHead>
                  <TableHead>Account Holder</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Each Price</TableHead>
                  <TableHead>Total Purchase Value</TableHead>
                  <TableHead>Purchase Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buyTransactions.map((transaction) => (

                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.purchase_date).toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>{transaction.account_name}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{transaction.market_cost}</TableCell>
                    <TableCell>{parseFloat(transaction.market_cost ) * parseFloat( transaction.quantity)}</TableCell>
                    <TableCell>{new Date(transaction.purchase_date).toLocaleDateString('en-GB')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Sell Transactions Table */}
          <TabsContent value="sell">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sold Month & Year</TableHead>
                  <TableHead>Account Holder</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Each Price</TableHead>
                  <TableHead>Total Sold Value</TableHead>
                  <TableHead>Purchase Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.purchase_date).toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>{transaction.account_name}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{transaction.final_sell_value}</TableCell>
                    <TableCell>{transaction.total_sell_value}</TableCell>
                    <TableCell>{new Date(transaction.purchase_date).toLocaleDateString('en-GB')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Buysell;
