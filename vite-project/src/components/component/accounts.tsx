import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
// import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu"
import { CirclePlusIcon, FilePenIcon, Trash2Icon } from "lucide-react";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  // PaginationEllipsis,
} from "@/components/ui/pagination";

// Define the TypeScript interface for the account data
interface Account {
  id: number;
  parent_account_name: string;
  account_name: string;
  broker_id: string;
  broker: string;
  created_at: string;
  client_code: string;
  brokerage_percentage: number;
}

export function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<
    Omit<Account, "id" | "created_at">
  >({
    parent_account_name: "",
    account_name: "",
    broker_id: "",
    broker: "",
    client_code: "",
    brokerage_percentage: 0,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAccountValues, setNewAccountValues] = useState({
    parent_account_name: "",
    account_name: "",
    broker_id: "",
    broker: "",
    client_code: "",
    brokerage_percentage: 0,
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const recordsPerPage = 10;

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:3000/accounts")
      .then((response) => response.json())
      .then((data: Account[]) => setAccounts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDelete = (id: number) => {
    setAccountToDelete(id); // Set the account ID to delete
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const handleConfirmDelete = () => {
    if (accountToDelete !== null) {
      fetch(`http://localhost:3000/accounts/${accountToDelete}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Update state to remove the deleted account
            setAccounts((prevAccounts) =>
              prevAccounts.filter((account) => account.id !== accountToDelete)
            );
            toast.success("Account deleted successfully", {
              duration: 3000,
              position: "top-right",
            });
          } else {
            console.error("Failed to delete account");
          }
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
          toast.error("Failed to delete account.", {
            duration: 3000,
            position: "top-right",
          });
        })
        .finally(() => setIsConfirmModalOpen(false)); // Close the modal after operation
    }
  };

  const handleNewAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccountValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost:3000/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAccountValues),
    })
      .then((response) => response.json())
      .then((data) => {
        setAccounts((prevAccounts) => [...prevAccounts, data]);
        setIsAddModalOpen(false);
        toast.success("Account added successfully", {
          duration: 3000,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.error("Error adding account:", error);
        toast.error("Failed to add account.", {
          duration: 3000,
          position: "top-right",
        });
      });
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormValues({
      parent_account_name: account.parent_account_name,
      account_name: account.account_name,
      broker_id: account.broker_id,
      broker: account.broker,
      client_code: account.client_code,
      brokerage_percentage: account.brokerage_percentage,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    fetch(`http://localhost:3000/accounts/${editingAccount.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    })
      .then((response) => {
        if (response.ok) {
          setAccounts((prevAccounts) =>
            prevAccounts.map((account) =>
              account.id === editingAccount.id
                ? { ...account, ...formValues }
                : account
            )
          );
          setIsModalOpen(false);
          toast.success("Account updated successfully!", {
            duration: 3000,
            position: "top-right",
          });
        } else {
          console.error("Failed to update account");
          toast.error("Failed to update account.", {
            duration: 3000,
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating account:", error);
        toast.error("Error updating account.", {
          duration: 3000,
          position: "top-right",
        });
      });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(totalRecords / recordsPerPage)) {
      setCurrentPage(page);
    }
  };

  // Calculate indices for slicing the accounts array
  const indexOfLastAccount = currentPage * recordsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - recordsPerPage;
  const currentAccounts = accounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  // Fetch total records once to calculate the total number of pages
  useEffect(() => {
    const fetchTotalRecords = async () => {
      try {
        const response = await fetch("http://localhost:3000/accounts");
        if (!response.ok) {
          throw new Error("Failed to fetch total accounts");
        }
        const data = await response.json();
        setTotalRecords(data.length); // Assuming the API returns the full array of accounts
      } catch (error) {
        console.error("Error fetching total accounts:", error);
      }
    };

    fetchTotalRecords();
  }, []);

  // Fetch accounts data based on current page
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/accounts?page=${currentPage}&limit=${recordsPerPage}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const modalClose = () => {
    setIsAddModalOpen(false);
    setNewAccountValues({
      parent_account_name: "",
      account_name: "",
      broker_id: "",
      broker: "",
      client_code: "",
      brokerage_percentage: 0,
    });
  };

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col">
          <CardTitle>Accounts</CardTitle>
          <CardDescription>
            Manage your accounts and view details.
          </CardDescription>
        </div>
        <Button
          size="sm"
          className="h-8 gap-1"
          onClick={() => setIsAddModalOpen(true)}
        >
          <CirclePlusIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add account
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Broker Id</TableHead>
              <TableHead className="hidden sm:table-cell">
                Client Code
              </TableHead>
              <TableHead className="hidden sm:table-cell">%</TableHead>
              <TableHead className="hidden sm:table-cell">Account</TableHead>
              <TableHead className="hidden sm:table-cell">
                Parent Account
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  {account.account_name}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {account.broker_id}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {account.client_code}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {account.brokerage_percentage}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge>{account.broker}</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {account.parent_account_name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(account)}
                          >
                            <FilePenIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(account.id)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
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

        {/* delete dialog */}

        {isConfirmModalOpen && (
          <Dialog
            open={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
                <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                <p>
                  Are you sure you want to delete this account? This action
                  cannot be undone.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button onClick={handleConfirmDelete}>Confirm</Button>
                  <Button onClick={() => setIsConfirmModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        )}
        {/* Add Account Modal */}
        {isAddModalOpen && (
          <Dialog
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
                <h2 className="text-lg font-semibold">Add New Account</h2>
                <form onSubmit={handleAddSubmit} className="mt-4">
                  <label className="block">
                    Parent Account Name:
                    <input
                      type="text"
                      name="parent_account_name"
                      value={newAccountValues.parent_account_name}
                      onChange={handleNewAccountChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <label className="block">
                    Account Name:
                    <input
                      type="text"
                      name="account_name"
                      value={newAccountValues.account_name}
                      onChange={handleNewAccountChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Broker ID:
                    <input
                      type="text"
                      name="broker_id"
                      value={newAccountValues.broker_id}
                      onChange={handleNewAccountChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Broker:
                    <input
                      type="text"
                      name="broker"
                      value={newAccountValues.broker}
                      onChange={handleNewAccountChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Client Code:
                    <input
                      type="text"
                      name="client_code"
                      value={newAccountValues.client_code}
                      onChange={handleNewAccountChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Brokerage %:
                    <input
                      type="number"
                      name="brokerage_percentage"
                      value={newAccountValues.brokerage_percentage}
                      onChange={handleNewAccountChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <div className="mt-4 flex gap-2">
                    <Button type="submit">Add Account</Button>
                    <Button
                      type="button"
                      onClick={modalClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Dialog>
        )}
        {isModalOpen && editingAccount && (
          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
                <h2 className="text-lg font-semibold">Edit Account</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                <label className="block">
                    Parent Account Name:
                    <input
                      type="text"
                      name="parent_account_name"
                      value={formValues.parent_account_name}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <label className="block">
                    Account Name:
                    <input
                      type="text"
                      name="account_name"
                      value={formValues.account_name}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <label className="block mt-2">
                    Broker ID:
                    <input
                      type="text"
                      name="broker_id"
                      value={formValues.broker_id}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <label className="block mt-2">
                    Broker:
                    <input
                      type="text"
                      name="broker"
                      value={formValues.broker}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <label className="block mt-2">
                    Client Code:
                    <input
                      type="text"
                      name="client_code"
                      value={formValues.client_code}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <label className="block mt-2">
                    Brokerage Percentage:
                    <input
                      type="text"
                      name="brokerage_percentage"
                      value={formValues.brokerage_percentage}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <div className="mt-4 flex gap-2">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
