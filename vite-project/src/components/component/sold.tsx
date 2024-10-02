import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
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
  // const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const recordsPerPage = 10;



  // Format purchase date as Month/Year
  const formatPurchaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
  };


  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(totalRecords / recordsPerPage)) {
      setCurrentPage(page);
    }
  };
  const indexOfLastTransaction = currentPage * recordsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - recordsPerPage;
  const currentTransactions = soldTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);



  // Fetch total records once to calculate the total number of pages
  useEffect(() => {
    const fetchTotalRecords = async () => {
      try {
        const response = await fetch("http://localhost:3000/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch total transactions");
        }
        const soldData: Transaction[] = await response.json();
        const paginatedSold = soldData.filter(transaction => transaction.type === 'sell');
        setSoldTransactions(paginatedSold);
        // console.log(data.length)
        setTotalRecords(paginatedSold.length);  // Assuming the API returns the full array of transactions
        // console.log(setTotalRecords)
        // console.log(totalRecords)
      } catch (error) {
        console.error("Error fetching total transactions:", error);
      }
    };
    fetchTotalRecords();
  }, []);


  // Fetch sold transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/transactions?page=${currentPage}&limit=${recordsPerPage}");
        const transactionData: Transaction[] = await response.json();

        // Filter out only 'sell' transactions
        const sold = transactionData.filter(transaction => transaction.type === 'sell');
        setSoldTransactions(sold);
        // setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // setLoading(false); // Ensure loading is false even on error
      }
    };

    fetchTransactions();
  }, [currentPage]); // No dependencies to prevent infinite loop

  const totalPages = Math.ceil(totalRecords / recordsPerPage);


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Sold Transactions</CardTitle>
        <CardDescription>View and manage your sold transactions.</CardDescription>
      </CardHeader>
      <CardContent>

        <Table>
          <TableHeader>
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
            {currentTransactions.map((transaction) => (
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
        {/* Pagination controls */}
        <Pagination>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
          // disabled={currentPage === 1}
          />

          <PaginationContent>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    // Apply disabled styles if the link is inactive
                    className={currentPage === page ? '' : 'pointer-events-none opacity-50'}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          </PaginationContent>

          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
          // disabled={currentPage === totalPages}
          />
        </Pagination>

      </CardContent>
    </Card>
  );
}
