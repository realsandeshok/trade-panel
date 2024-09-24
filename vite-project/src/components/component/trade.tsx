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
  account_name: string;
  // Add other fields as necessary
}

export function Trade() {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<accounts[]>([]);
  const [scripts, setScripts] = useState<Scripts[]>([]);
  const [transactions, setTransactions] = useState<transactions[]>([]);

  const [formData, setFormData] = useState({
    type: "",
    script: "",
    quantity: "",
    cost: "",
    brokerage: "",
    date: "",
    account: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
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
      brokerage: selectedAccount?.brokerage_percentage || "", // Set brokerage based on selected account
    });
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
          account_id: accounts.find(
            (account) => account.account_name === formData.account
          )?.id,
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
          <Button size="sm" onClick={() => setOpen(true)}>
            Buy
          </Button>
          <Button size="sm">Sell</Button>
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
              <TableHead>Account Holder</TableHead>
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
                  <TableCell className="font-medium">Buy</TableCell>
                  <TableCell>{transaction.script_name}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>₹{marketCost} </TableCell>
                  <TableCell>{brokerage}%</TableCell>
                  <TableCell>₹{totalCostWithBrokerage}</TableCell>
                  <TableCell>₹{totalValue}</TableCell>
                  <TableCell>
                    {transaction.purchase_date.slice(0, 10)}
                  </TableCell>
                  <TableCell>{transaction.account_name}</TableCell>
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
      </CardContent>
    </Card>
  );
}
