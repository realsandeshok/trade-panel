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
interface Scripts {
  id: number;
  name: string;
}

interface accounts {
  id: number;
  account_name: string;
  broker: string;
  brokerage_percentage: string;
}

interface transactions {
  id: number;
  script_name: string;
  quantity: string;
  market_cost: string;
  brokerage: string;
  purchase_date: string;
  purchaseDate: string;
  accountHolder: string;
  type: string;
  eachPrice: number;
  purchaseValue: number;
}
// interface Transaction {
//   accountHolder: string;
//   purchaseDate: string;
//   quantity: number;
//   eachPrice: number;
//   // market_cost:string;
//   purchaseValue: number;
// }

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
  const [transactionType, setTransactionType] = useState(''); // Tracks transaction type ("buy" or "sell")
  const [selectedScript, setSelectedScript] = useState<string>("");
  const [accountHolders, setAccountHolders] = useState<transactions[]>([]);
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
  const [selectedAccountHolder, setSelectedAccountHolder] = useState<string>("");
  const [totalValue, setTotalValue] = useState<number>(0);
  const [eachValue, setEachValue] = useState<number>(0);
  // const [purchaseValue, setPurchaseValue] = useState<number>(0);

  const [brokerage, setBrokerage] = useState("")
  // const [sellmarketcost, setSellMarketCost] = useState("") 
  const [quantity, setQuantity] = useState<number>(0);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  //states for auto
  const [accountId,setAccountId] = useState<number>(0)

  const [formData, setFormData] = useState({
    type: "",
    script: "",
    quantity: "",
    cost: "",
    brokerage: "",
    date: "",
    account: "",
  });


  const [sellFormData, setSellFormData] = useState({
    type: '',
    script: '',
    account: '',
    quantity: '',
    each_value: '',
    market_cost: '',
    selling_quantity: '',
    total_cost: '',
    total_sell_value: '',
    purchase_date: '',

    sell_market_cost: '',
    brokerage: '',
    f_sell_value: '',
    // t_sell_value: '',
    p_l: '',

    sell_date: '',
    term: '',
  });

  // Function to calculate Final Selling value in Sell Form
  const f_sellingValue = (parseFloat(sellFormData.sell_market_cost) - parseFloat(brokerage)).toFixed(2)
  // Function to calculate Total Selling value in Sell Form
  const t_sellingValue = (parseFloat(f_sellingValue) * parseFloat(sellFormData.selling_quantity))
  // Function to calculate Total Purchase value in while Selling in Sell Form
  const totalPurchaseValue = eachValue * parseFloat(sellFormData.selling_quantity)
  const profit_loss = t_sellingValue - totalPurchaseValue
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

  // fetch transactions
  useEffect(() => {
    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/transactions/");
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
  }, []);

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
          //   quantity: parseFloat(transaction.quantity.toString()),
          purchaseValue: parseFloat(transaction.purchaseValue.toString()),
          eachPrice: parseFloat(transaction.eachPrice.toString()),
          purchase_date: transaction.purchase_date,
          accountHolder: transaction.accountHolder
        })),
      }));
      // console.log(parsedData);
      setHoldings(parsedData)
    } catch (error) {
      console.error("Error fetching holdings data:", error);
    }
  };




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSellFormData({
      ...sellFormData,
      [e.target.name]: e.target.value
    })
  };
  

  // Handle account selection
  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAccount = accounts.find(
      (account) => account.account_name === e.target.value
    );
    setFormData({
      ...formData,
      account: selectedAccount?.account_name || "",
      brokerage: selectedAccount?.brokerage_percentage || "", // Set brokerage based on selected account
    });
    setSellFormData({
      ...sellFormData,
      account: selectedAccount?.account_name || '',
      brokerage: selectedAccount?.brokerage_percentage || ''  // Set brokerage based on selected account
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
      // Find transaction for selected account holder
      //  const accountHolder = selectedAccountHolder; // Make sure this state is updated correctly
      //  const transaction = selectedHolding.transactions.find(
      //    (transaction) => transaction.accountHolder === accountHolder
      //  ); 
    }
    // const purchaseDate = selectedHolding?.transactions?.[0]?.purchase_date || null;
  };

  const handleAccountHolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const accountHolder = e.target.value;
    setSelectedAccountHolder(accountHolder);

    // Find the selected account holder's transaction
    const selectedTransaction = accountHolders.find(
      (transaction) => transaction.accountHolder === accountHolder
    );

    if (selectedTransaction && selectedTransaction.purchaseDate) {
      console.log('selectedTransaction:', selectedTransaction)
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
        setAccountId(selectedAccount.id)
        const accountId = selectedAccount.id;  // Fetch the account_id
        const accountName = selectedAccount.account_name;  // Fetch the account_name
      
        console.log('Selected Account ID:', accountId);
        console.log('Selected Account Name:', accountName);
        
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

  useEffect(() => {
    console.log('purchaseDate:', purchaseDate);
  }, [purchaseDate]);


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

      const data = await response.json();
      // Handle the response as needed, e.g., show a success message, update UI, etc.
      console.log("Transaction added:", data);

      // Close the dialog after successful submission
      setOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      // Handle the error appropriately, e.g., show an error message
    }
  };


  const handleSellSubmit = async () => {
    try {

      // const totalPurchaseValue = parseFloat(sellFormData.total_purchase_value) || 0;
      // const sellingMarketCost = parseFloat(sellFormData.sell_market_cost) || 0;
      // const brokerage = (parseFloat(sellFormData.brokerage) || 0) / 100 * sellingMarketCost;
      // const finalSellingValue = sellingMarketCost - brokerage;
      // const totalSellingValue = finalSellingValue * (parseFloat(sellFormData.quantity) || 0);
      // const profitLoss = totalSellingValue - totalPurchaseValue;


      const response = await fetch('http://localhost:3000/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script_name: selectedScript,             // Use the script name from sellFormData
          quantity: sellFormData.selling_quantity,               // Quantity being sold
          sell_market_cost: sellFormData.sell_market_cost, // Market cost at which shares are sold
          brokerage: sellFormData.brokerage,            // Brokerage fee
          sell_date: sellFormData.sell_date,            // Date of sale
          total_sell_value:t_sellingValue,
          market_cost: eachValue,
          account_id: accountId,
          final_sell_value: f_sellingValue,  // Final sell value
          profit_loss: profit_loss,         // Profit or loss from the transaction
          type: transactionType,
          purchase_date: purchaseDate,
        }),
        
      });
      const account = accounts.find((account) => account.account_name === selectedAccountHolder);
      console.log('Selected account:', account);

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
      }

      const data = await response.json();
      // Handle the response as needed, e.g., show a success message, update UI, etc.
      console.log('Transaction added:', data);

      // Close the dialog after successful submission
      setSellOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Handle the error appropriately, e.g., show an error message
    }
  }


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
          <Button size="sm" onClick={() => { setOpen(true); setTransactionType('buy') }}>
            Buy
          </Button>
          <Button size="sm" onClick={() => { setSellOpen(true); setTransactionType('sell') }}>Sell</Button>
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
              <TableHead>Total Purchase Value</TableHead>
              <TableHead>Purchase Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const marketCost = parseInt(transaction.market_cost);
              const brokerage = parseInt(transaction.brokerage);
              const quantity = parseInt(transaction.quantity);

              // Calculate total cost with brokerage
              const totalCostWithBrokerage = marketCost + brokerage;
              const totalValue = totalCostWithBrokerage * quantity;

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium capitalize">{transaction.type}</TableCell>
                  <TableCell>{transaction.script_name}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>₹{marketCost} </TableCell>
                  <TableCell>{brokerage}%</TableCell>
                  <TableCell>₹{totalCostWithBrokerage}</TableCell>
                  <TableCell>₹{totalValue}</TableCell>
                  <TableCell>
                    {(transaction.purchase_date).slice(2, 10)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
                  onClick={() => setOpen(false)}
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
              <DialogTitle className="text-lg font-semibold">Sell Share</DialogTitle>
            </DialogHeader>

            <form onSubmit={(e) => { e.preventDefault(); handleSellSubmit(); }} className="overflow-y-scroll max-h-[80vh] hide-scrollbar">
              <div className="space-y-4">
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

                <select
                  name="account"
                  value={selectedAccountHolder}
                  onChange={handleAccountHolderChange}
                  disabled={!selectedScript}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select an account</option>
                  {accountHolders.map((transaction, index) => (
                    <option key={index} value={transaction.accountHolder}>
                      {transaction.accountHolder}
                    </option>
                  ))}
                </select>
                <span>{selectedAccountHolder} holds {quantity} share of {selectedScript}, each share bought at price {eachValue}, which costed {totalValue} for {quantity} shares on {purchaseDate ? `${purchaseDate.slice(8, 10)}-${purchaseDate.slice(5, 7)}-${purchaseDate.slice(0, 4)}` : ''}</span>
                {/* <Input

                  type="text"
                  name="quantity"
                  placeholder="Quantity"
                  value={'Holds ' + quantity + ' shares'}
                  onChange={handleInputChange}
                  readOnly
                />
                <Input
                  type="text"
                  name="each_value"
                  placeholder="Total Value of Script"
                  value={'Cost for each share is ' + eachValue}
                  readOnly
                /> */}

                {/* Each value */}
                {/* <Input
                  placeholder="Enter total cost"
                  type="number"
                  name="total_cost"
                  value={eachValue}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full border p-2 rounded"
                /> */}

                {/* Total purchase Value */}
                {/* <Input
                  placeholder="Total purchase value"
                  type="number"
                  name="total_selling_value"
                  value={totalPurchaseValue}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full border p-2 rounded"
                /> */}


                {/* Purchase Date */}
                {/* <Input
                                  placeholder="Enter purchase date"
                                  type="text"
                                  name="purchase_date"
                                  value={purchaseDate ? `${purchaseDate.slice(8, 10)}-${purchaseDate.slice(5, 7)}-${purchaseDate.slice(0, 4)}` : ''}
                                  onChange={handleInputChange}
                                  readOnly
                                  className="w-full border p-2 rounded"
                                /> */}
                {/* Selling Quantity */}
                <Input
                  placeholder="Enter Selling quantity"
                  type="number"
                  name="selling_quantity"
                  value={sellFormData.selling_quantity}
                  onChange={(e) => {
                    const sellingQuantity = parseInt(e.target.value);
                    if (sellingQuantity > quantity || sellingQuantity < 0) {
                      if (sellingQuantity > quantity) {
                        alert("Selling quantity cannot exceed existing quantity");
                      } else {
                        alert("Selling quantity cannot be less than 0");
                      }
                      e.target.value = quantity.toString();
                    } else {
                      handleInputChange(e);
                    }
                  }}
                  required
                  className="w-full border p-2 rounded"
                />


                {/* Selling Market Cost */}
                <Input
                  placeholder="Enter selling market cost"
                  type="number"
                  name="sell_market_cost"
                  value={sellFormData.sell_market_cost}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-2 rounded"
                />

                {/* Show brokerage automatically based on selected account */}
                <Input
                  placeholder="Brokerage percentage"
                  type="number"
                  name="brokerage"
                  value={brokerage}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-200"
                />

                {/* Final Selling Value */}
                <Input
                  placeholder="Final selling value"
                  type="number"
                  name="f_sell_value"
                  value={f_sellingValue}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full border p-2 rounded"
                />

                {/* Total Selling Value */}
                <Input
                  placeholder="Total selling value"
                  type="number"
                  name="t_sell_value"
                  value={t_sellingValue}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full border p-2 rounded"
                />

                {/* Profit/Loss */}
                <Input
                  placeholder="Profit/Loss"
                  type="number"
                  name="p_l"
                  value={profit_loss}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full border p-2 rounded"
                />

                {/* Selling Date */}
                <Input
                  placeholder="Enter selling date"
                  type="date"
                  name="sell_date"
                  value={sellFormData.sell_date}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-2 rounded"
                />

                {/* Longterm/Shortterm */}
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
                <Button type="submit" size="sm">Submit</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setSellOpen(false)}>Cancel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>


      </CardContent>
    </Card>
  );
}
