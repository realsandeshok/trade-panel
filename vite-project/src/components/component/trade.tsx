import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import toast from "react-hot-toast";
// import  {Pagination}  from "@/components/ui/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  // PaginationEllipsis,
} from "@/components/ui/pagination";
import { format } from "date-fns";

interface Scripts {
  id: number;
  name: string;
}

interface accounts {
  id: number;
  account_name: string;
  broker: string;
  brokerage_percentage: number;
}

interface transactions {
  id: number;
  script_name: string;
  quantity: string;
  market_cost: string;
  brokerage: number;
  purchase_date: string;
  purchaseDate: string;
  accountHolder: string;
  type: string;
  eachPrice: number;
  purchaseValue: number;
  account_name: string;
  final_sell_value: number;
  total_sell_value: number;
  sell_market_cost: number;
}

interface Holding {
  scriptName: string;
  totalQuantity: number;
  totalPurchaseValue: number;
  avgHoldingCost: number;
  sector: string;
  transactions: transactions[];
  showHolding?: boolean;
  // eachPrice:number;
}

export function Trade() {
  const [open, setOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [accounts, setAccounts] = useState<accounts[]>([]);
  const [scripts, setScripts] = useState<Scripts[]>([]);
  const [transactions, setTransactions] = useState<transactions[]>([]);
  const [transactionType, setTransactionType] = useState(""); // Tracks transaction type ("buy" or "sell")
  const [selectedScript, setSelectedScript] = useState<string>("");
  const [accountHolders, setAccountHolders] = useState<transactions[]>([]);
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
  const [selectedAccountHolder, setSelectedAccountHolder] =
    useState<string>("");
  const [totalValue, setTotalValue] = useState<number>(0);
  const [eachValue, setEachValue] = useState<number>(0);
  const [transactionsUpdated, setTransactionsUpdated] = useState(false);

  const [brokerage, setBrokerage] = useState(0);
  // const [sellmarketcost, setSellMarketCost] = useState("")
  const [quantity, setQuantity] = useState<number>(0);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [accountId, setAccountId] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const recordsPerPage = 10;

  const [formData, setFormData] = useState({
    type: "",
    script: "",
    quantity: "",
    cost: "",
    brokerage: 0,
    date: "",
    account: "",
  });

  const [sellFormData, setSellFormData] = useState({
    type: "",
    script: "",
    account: "",
    quantity: "",
    each_value: "",
    market_cost: "",
    selling_quantity: "",
    total_cost: "",
    total_sell_value: "",
    purchase_date: "",

    sell_market_cost: "",
    brokerage: 0,
    f_sell_value: 0,
    // t_sell_value: '',
    p_l: "",

    sell_date: "",
    term: "",
  });

  // Function to calculate Final Selling value in Sell Form
  const f_sellingValue =
    parseFloat(sellFormData.sell_market_cost) -
    (parseFloat(sellFormData.sell_market_cost) * brokerage) / 100;
  // Function to calculate Total Selling value in Sell Form
  const t_sellingValue =
    f_sellingValue * parseFloat(sellFormData.selling_quantity);
  // Function to calculate Total Purchase value in while Selling in Sell Form
  const totalPurchaseValue =
    eachValue * parseFloat(sellFormData.selling_quantity);
  const profit_loss = t_sellingValue - totalPurchaseValue;
  // Fetch accounts from the API
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("http://localhost:3000/accounts");
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    }
    fetchAccounts();
  }, []);

  useEffect(() => {
    async function fetchScripts() {
      try {
        const response = await fetch("http://localhost:3000/scripts");
        const data = await response.json();
        setScripts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    }
    fetchScripts();
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(totalRecords / recordsPerPage)) {
      setCurrentPage(page);
    }
  };
  const indexOfLastTransaction = currentPage * recordsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - recordsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Fetch total records once to calculate the total number of pages
  useEffect(() => {
    const fetchTotalRecords = async () => {
      try {
        const response = await fetch("http://localhost:3000/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch total transactions");
        }
        const data = await response.json();
        // console.log(data.length)
        setTotalRecords(data.length); // Assuming the API returns the full array of transactions
        // console.log(setTotalRecords)
        // console.log(totalRecords)
      } catch (error) {
        console.error("Error fetching total transactions:", error);
      }
    };
    fetchTotalRecords();
  }, []);

  // fetch transactions
  useEffect(() => {
    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/transactions?page=${currentPage}&limit=${recordsPerPage}"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, [currentPage, transactionsUpdated]);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  //fetch holdings
  useEffect(() => {
    fetchHoldings();
  }, []);

  const fetchHoldings = async () => {
    try {
      const response = await fetch("http://localhost:3000/holdings");
      const data: Holding[] = await response.json();

      // Ensure numerical values are correct
      const parsedData = data.map((holding) => ({
        ...holding,
        transactions: holding.transactions.map((transaction) => ({
          ...transaction,
          purchaseValue: parseFloat(transaction.purchaseValue.toString()),
          eachPrice: parseFloat(transaction.eachPrice.toString()),
          purchase_date: transaction.purchase_date,
          accountHolder: transaction.accountHolder,
        })),
      }));
      setHoldings(parsedData);
    } catch (error) {
      console.error("Error fetching holdings data:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSellFormData({
      ...sellFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle account selection
  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAccount = accounts.find(
      (account) => account.account_name === e.target.value
    );
    setFormData({
      ...formData,
      account: selectedAccount?.account_name || "",
      brokerage: selectedAccount?.brokerage_percentage || 0, // Set brokerage based on selected account
    });
    setSellFormData({
      ...sellFormData,
      account: selectedAccount?.account_name || "",
      brokerage: selectedAccount?.brokerage_percentage || 0, // Set brokerage based on selected account
    });
  };

  const handleSellScriptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scriptName = e.target.value;
    setSelectedScript(scriptName);

    // Find the selected script's holding
    const selectedHolding = holdings.find(
      (holding) => holding.scriptName === scriptName
    );

    if (selectedHolding) {
      // Update account holders based on selected script
      setAccountHolders(selectedHolding.transactions);
    }
  };

  const handleAccountHolderChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const accountHolder = e.target.value;
    setSelectedAccountHolder(accountHolder);

    // Find the selected account holder's transaction
    const selectedTransaction = accountHolders.find(
      (transaction) => transaction.accountHolder === accountHolder
    );

    if (selectedTransaction && selectedTransaction.purchaseDate) {
      console.log("selectedTransaction:", selectedTransaction);
      // Set the quantity and total value based on the selected account holder
      setQuantity(parseFloat(selectedTransaction.quantity));
      setTotalValue(selectedTransaction.purchaseValue);
      setEachValue(selectedTransaction.eachPrice);
      // Set the purchase date
      setPurchaseDate(selectedTransaction.purchaseDate);

      const selectedAccount = accounts.find(
        (account) => account.account_name === selectedTransaction.accountHolder
      );
      if (selectedAccount) {
        setAccountId(selectedAccount.id);
        const accountId = selectedAccount.id; // Fetch the account_id
        const accountName = selectedAccount.account_name; // Fetch the account_name

        console.log("Selected Account ID:", accountId);
        console.log("Selected Account Name:", accountName);

        setBrokerage(selectedAccount.brokerage_percentage);

        // Update sell form data with purchase date and brokerage percentage
        setSellFormData({
          ...sellFormData,
          purchase_date: selectedTransaction.purchase_date,
          brokerage: selectedAccount.brokerage_percentage,
        });
      }
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedScript = scripts.find(
      (script) => script.name === e.target.value
    );
    setFormData({
      ...formData,
      script: selectedScript?.name || "", // Set the script name based on the selected script
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script_name: formData.script,
          quantity: formData.quantity,
          market_cost: formData.cost,
          brokerage: formData.brokerage,
          purchase_date: formData.date,
          account_name: formData.account,
          account_id: accounts.find(
            (account) => account.account_name === formData.account
          )?.id,
          type: transactionType,
        }),
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      // const data = await response.json();
      // Handle the response as needed, e.g., show a success message, update UI, etc.
      // Reset the form if needed
      setFormData({
        type: "",
        script: "",
        quantity: "",
        cost: "",
        brokerage: 0,
        date: "",
        account: "",
      });
      // Close the dialog after successful submission
      setOpen(false);
      toast.success("Purchase successful", {
        duration: 3000,
        position: "top-right",
      });
      setTransactionsUpdated(true);
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Error adding transaction.", {
        duration: 3000,
        position: "top-right",
      });
      // Handle the error appropriately, e.g., show an error message
    }
  };

  const handleSellSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script_name: selectedScript, // Use the script name from sellFormData
          quantity: sellFormData.selling_quantity, // Quantity being sold
          sell_market_cost: sellFormData.sell_market_cost, // Market cost at which shares are sold
          brokerage: sellFormData.brokerage, // Brokerage fee
          sell_date: sellFormData.sell_date, // Date of sale
          total_sell_value: t_sellingValue.toFixed(2),
          market_cost: eachValue,
          account_id: accountId,
          final_sell_value: f_sellingValue.toFixed(2), // Final sell value
          profit_loss: profit_loss, // Profit or loss from the transaction
          type: transactionType,
          purchase_date: purchaseDate,
        }),
      });
      const account = accounts.find(
        (account) => account.account_name === selectedAccountHolder
      );
      console.log("Selected account:", account);

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      // const data = await response.json();
      // Handle the response as needed, e.g., show a success message, update UI, etc.
      // Clear the sell form fields after successful submission
      setSellFormData({
        type: "",
        script: "",
        account: "",
        quantity: "",
        each_value: "",
        market_cost: "",
        selling_quantity: "",
        total_cost: "",
        total_sell_value: "",
        purchase_date: "",
        sell_market_cost: "",
        brokerage: 0,
        f_sell_value: 0,
        // t_sell_value: '',
        p_l: "",
        sell_date: "",
        term: "",
      });
      setSelectedAccountHolder(""), setSelectedScript("");
      setBrokerage(0);

      // Close the dialog after successful submission
      setSellOpen(false);
      toast.success("Sold successfully!", {
        duration: 3000,
        position: "top-right",
      });
      setTransactionsUpdated(true); // Add this line
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Error adding transaction.", {
        duration: 3000,
        position: "top-right",
      });
      // Handle the error appropriately, e.g., show an error message
    }
  };

  const modalSellClose = () => {
    setSellOpen(false);
    setSellFormData({
      type: "",
      script: "",
      account: "",
      quantity: "",
      each_value: "",
      market_cost: "",
      selling_quantity: "",
      total_cost: "",
      total_sell_value: "",
      purchase_date: "",
      sell_market_cost: "",
      brokerage: 0,
      f_sell_value: 0,
      // t_sell_value: '',
      p_l: "",
      sell_date: "",
      term: "",
    });
    setSelectedAccountHolder(""), setSelectedScript("");
    setBrokerage(0);
  };

  const modalBuyClose = () => {
    setOpen(false);
    setFormData({
      type: "",
      script: "",
      quantity: "",
      cost: "",
      brokerage: 0,
      date: "",
      account: "",
    });
  };

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>View and manage your transactions.</CardDescription>
        </div>
        <div className="space-x-4">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setOpen(true);
              setTransactionType("buy");
            }}
          >
            Buy
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSellOpen(true);
              setTransactionType("sell");
            }}
          >
            Sell
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Brokerage</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Month-Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction) => {
              const marketCost = parseInt(transaction.market_cost);
              const brokerage = transaction.brokerage;
              const quantity = parseInt(transaction.quantity);
              const percentBrokerage = transaction.brokerage / 100;
              // Calculate total cost with brokerage
              const totalCostWithBrokerage = (
                marketCost +
                marketCost * percentBrokerage
              ).toFixed(2);
              const totalValue = parseFloat(totalCostWithBrokerage) * quantity;

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium capitalize">
                    {transaction.type}
                  </TableCell>
                  <TableCell>{transaction.script_name}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>
                    {transaction.type === "buy"
                      ? `₹${marketCost}`
                      : `₹${transaction.sell_market_cost}`}
                  </TableCell>
                  <TableCell>{brokerage}%</TableCell>
                  <TableCell>
                    {transaction.type === "buy"
                      ? `₹${totalCostWithBrokerage}`
                      : `₹${transaction.final_sell_value}`}
                  </TableCell>
                  <TableCell>
                    {transaction.type === "buy"
                      ? `₹${totalValue.toFixed(2)}`
                      : `₹${transaction.total_sell_value}`}
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.purchase_date), "dd-MM-yyyy")}
                  </TableCell>
                  <TableCell>{transaction.account_name}</TableCell>{" "}
                  {/* Add this line */}
                  <TableCell>
                    {new Date(transaction.purchase_date).toLocaleString(
                      "default",
                      { month: "long", year: "numeric" }
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
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
                    className={
                      currentPage === page
                        ? ""
                        : "pointer-events-none opacity-50"
                    }
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buy Share</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="space-y-4">
                <select
                  name="Scripts"
                  value={formData.script}
                  onChange={handleScriptChange}
                  required
                  className="w-full border p-2"
                >
                  <option value="">Select Script</option>
                  {scripts.map((script) => (
                    <option key={script.id} value={script.name}>
                      {script.name}
                    </option>
                  ))}
                </select>

                <Input
                  placeholder="Enter quantity"
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  placeholder="Enter cost"
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  required
                />

                {/* Dropdown for selecting account */}

                <select
                  name="account"
                  value={formData.account}
                  onChange={handleAccountChange}
                  required
                  className="w-full border p-2"
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.account_name}>
                      {account.account_name} ({account.broker})
                    </option>
                  ))}
                </select>

                {/* Show brokerage automatically based on selected account */}
                <Input
                  placeholder="Brokerage percentage"
                  type="number"
                  name="brokerage"
                  value={formData.brokerage}
                  readOnly
                />

                <Input
                  placeholder="Enter date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <DialogFooter className="p-3">
                <Button type="submit" size="sm">
                  Submit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={modalBuyClose}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* sell dialog */}
        <Dialog open={sellOpen} onOpenChange={setSellOpen}>
          <DialogContent className="max-w-md mx-auto h-auto max-h-[90vh] overflow-y-hidden p-6 rounded-lg bg-white shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Sell Share
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSellSubmit();
              }}
              className="overflow-y-scroll max-h-[80vh] hide-scrollbar space-y-3 p-1"
            >
              <div>
                <label htmlFor="Scripts" className="block font-medium pb-1">
                  Select Scripts
                </label>
                <select
                  name="Scripts"
                  value={selectedScript}
                  onChange={handleSellScriptChange}
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Script</option>
                  {holdings.map((holding) => (
                    <option key={holding.scriptName} value={holding.scriptName}>
                      {holding.scriptName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="account" className="block font-medium pb-1">
                  Select Account
                </label>
                <select
                  name="account"
                  value={selectedAccountHolder}
                  onChange={handleAccountHolderChange}
                  disabled={!selectedScript}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select an account</option>
                  {accountHolders.map((transaction) => (
                    <option
                      key={transaction.id}
                      value={transaction.accountHolder}
                    >
                      {transaction.accountHolder}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-gray-100 p-3 rounded text-sm ">
                <span>
                  {selectedAccountHolder} holds <strong>{quantity}</strong>{" "}
                  share(s) of <strong>{selectedScript}</strong>, each bought at{" "}
                  <strong>₹{eachValue}</strong>, costing{" "}
                  <strong>₹{totalValue}</strong> for <strong>{quantity}</strong>{" "}
                  share(s) on{" "}
                  <strong>
                    {purchaseDate
                      ? `${purchaseDate.slice(8, 10)}-${purchaseDate.slice(
                          5,
                          7
                        )}-${purchaseDate.slice(0, 4)}`
                      : ""}
                  </strong>
                </span>
              </div>

              {/* Selling Quantity */}
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="selling_quantity"
                    className="block font-medium pb-1"
                  >
                    Enter Selling Quantity
                  </label>
                  <Input
                    type="number"
                    name="selling_quantity"
                    value={sellFormData.selling_quantity}
                    onChange={(e) => {
                      const sellingQuantity = parseInt(e.target.value);
                      if (sellingQuantity > quantity || sellingQuantity < 0) {
                        if (sellingQuantity > quantity) {
                          toast.error(
                            "Selling quantity cannot exceed existing quantity.",
                            { duration: 5000, position: "top-right" }
                          );
                        } else {
                          toast.error(
                            "Selling quantity cannot be less than 0.",
                            { duration: 5000, position: "top-right" }
                          );
                        }
                        e.target.value = quantity.toString();
                      } else {
                        handleInputChange(e);
                      }
                    }}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                {/* Selling Market Cost */}
                <div className="w-1/2">
                  <label
                    htmlFor="sell_market_cost"
                    className="block font-medium pb-1"
                  >
                    Enter Selling Market Cost
                  </label>
                  <Input
                    type="number"
                    name="sell_market_cost"
                    value={sellFormData.sell_market_cost}
                    onChange={(e) => {
                      const marketCost = parseFloat(e.target.value);
                      if (marketCost <= 0) {
                        toast.error(
                          "Selling market cost must be greater than 0.",
                          { duration: 5000, position: "top-right" }
                        );
                        e.target.value = ""; // Reset the value if it’s invalid
                      } else {
                        handleInputChange(e);
                      }
                    }}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              {/* Show brokerage automatically based on selected account */}
              <div>
                <label htmlFor="brokerage" className="block font-medium pb-1">
                  Brokerage Percentage
                </label>
                <Input
                  type="number"
                  name="brokerage"
                  value={brokerage}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-200"
                />
              </div>

              {/* Final Selling Value */}
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="f_sell_value"
                    className="block font-medium pb-1"
                  >
                    Final Selling Value
                  </label>
                  <Input
                    type="number"
                    name="f_sell_value"
                    value={f_sellingValue.toFixed(2)}
                    onChange={handleInputChange}
                    readOnly
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Total Selling Value */}
                <div className="w-1/2">
                  <label
                    htmlFor="t_sell_value"
                    className="block font-medium pb-1"
                  >
                    Total Selling Value
                  </label>
                  <Input
                    type="number"
                    name="t_sell_value"
                    value={t_sellingValue.toFixed(2)}
                    onChange={handleInputChange}
                    readOnly
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              {/* Profit/Loss */}
              <div>
                <label htmlFor="p_l" className="block font-medium pb-1">
                  Profit/Loss
                </label>
                <Input
                  type="number"
                  name="p_l"
                  value={profit_loss.toFixed(2)}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Selling Date */}
              <div>
                <label htmlFor="sell_date" className="block font-medium pb-1">
                  Enter Selling Date
                </label>
                <Input
                  type="date"
                  name="sell_date"
                  value={sellFormData.sell_date}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Longterm/Shortterm */}
              <div>
                <label htmlFor="term" className="block font-medium pb-1">
                  Select Term
                </label>
                <select
                  name="term"
                  value={sellFormData.term}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select term</option>
                  <option value="longterm">Longterm</option>
                  <option value="shortterm">Shortterm</option>
                </select>
              </div>

              <DialogFooter className="p-3">
                <Button type="submit" size="sm">
                  Submit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={modalSellClose}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
