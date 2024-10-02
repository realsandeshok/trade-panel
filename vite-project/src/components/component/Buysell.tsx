import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  // PaginationEllipsis,
} from "@/components/ui/pagination";

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
  final_sell_value: number;
  total_sell_value: number;
}

const Buysell = () => {
  const [buyTransactions, setBuyTransactions] = useState<Transaction[]>([]);
  const [sellTransactions, setSellTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);


  const [buyCurrentPage, setBuyCurrentPage] = useState(1);
  const [buyTotalRecords, setBuyTotalRecords] = useState<number>(0);

  const [sellCurrentPage, setSellCurrentPage] = useState(1);
  const [sellTotalRecords, setSellTotalRecords] = useState<number>(0);
  const recordsPerPage = 10;

  // Paginate Buy Transactions
  const buyPaginatedTransactions = buyTransactions.slice(
    (buyCurrentPage - 1) * recordsPerPage,
    buyCurrentPage * recordsPerPage
  );

  // Paginate Sell Transactions
  const sellPaginatedTransactions = sellTransactions.slice(
    (sellCurrentPage - 1) * recordsPerPage,
    sellCurrentPage * recordsPerPage
  );

  // const indexOfLastTransaction = currentPage * recordsPerPage;
  // const indexOfFirstTransaction = indexOfLastTransaction - recordsPerPage;
  // const currentTransactions = soldTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);



  // Handle Page Change for Buy Tab
  const handleBuyPageChange = (page:number) => {
    if (page > 0 && page <= Math.ceil(buyTotalRecords / recordsPerPage)) {
      setBuyCurrentPage(page);
    }
  };

  // Handle Page Change for Sell Tab
  const handleSellPageChange = (page:number) => {
    if (page > 0 && page <= Math.ceil(sellTotalRecords / recordsPerPage)) {
      setSellCurrentPage(page);
    }
  };



  // Fetch transactions data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/transactions?page=${currentPage}&limit=${recordsPerPage}");
        const data: Transaction[] = await response.json();

        // Filter buy and sell transactions
        const allBuyTransactions = data.filter(t => t.type === 'buy');
        const allSellTransactions = data.filter(t => t.type === 'sell');

        setBuyTransactions(allBuyTransactions);
        setSellTransactions(allSellTransactions);
        setBuyTotalRecords(allBuyTransactions.length);  // Assuming the API returns the full array of transactions
        setSellTotalRecords(allSellTransactions.length);  // Assuming the API returns the full array of transactions
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

  const buyTotalPages = Math.ceil(buyTotalRecords / recordsPerPage);
  const sellTotalPages = Math.ceil(sellTotalRecords / recordsPerPage);


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
                {buyPaginatedTransactions.map((transaction) => (

                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.purchase_date).toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>{transaction.account_name}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{transaction.market_cost}</TableCell>
                    <TableCell>{parseFloat(transaction.market_cost) * parseFloat(transaction.quantity)}</TableCell>
                    <TableCell>{new Date(transaction.purchase_date).toLocaleDateString('en-GB')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination controls */}
            <Pagination>
              <PaginationPrevious
                onClick={() => handleBuyPageChange(buyCurrentPage - 1)}
              // disabled={currentPage === 1}
              />

              <PaginationContent>
                {Array.from({ length: buyTotalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handleBuyPageChange(page)}
                        isActive={buyCurrentPage === page}
                        // Apply disabled styles if the link is inactive
                        className={buyCurrentPage === page ? '' : 'pointer-events-none opacity-50'}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              </PaginationContent>

              <PaginationNext
                onClick={() => handleBuyPageChange(buyCurrentPage + 1)}
              // disabled={currentPage === totalPages}
              />
            </Pagination>

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
                {sellPaginatedTransactions.map((transaction) => (
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
            {/* Pagination controls */}
            <Pagination>
              <PaginationPrevious
                onClick={() => handleSellPageChange(sellCurrentPage - 1)}
              // disabled={currentPage === 1}
              />

              <PaginationContent>
                {Array.from({ length: sellTotalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handleSellPageChange(page)}
                        isActive={sellCurrentPage === page}
                        // Apply disabled styles if the link is inactive
                        className={sellCurrentPage === page ? '' : 'pointer-events-none opacity-50'}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              </PaginationContent>

              <PaginationNext
                onClick={() => handleSellPageChange(sellCurrentPage + 1)}
              // disabled={currentPage === totalPages}
              />
            </Pagination>

          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Buysell;
