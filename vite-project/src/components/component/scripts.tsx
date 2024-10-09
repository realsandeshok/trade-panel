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
import { useEffect, useState } from "react";
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


interface Script {
  id: number;
  name: string;
  sector: string;
  parent_companies: string;
  portfolio: string;
  referred: string;
}

export function Scripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<Omit<Script, "id">>({
    name: "",
    sector: "",
    parent_companies: "",
    portfolio: "",
    referred: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newScriptValues, setNewScriptValues] = useState<Omit<Script, "id">>({
    name: "",
    sector: "",
    parent_companies: "",
    portfolio: "",
    referred: "",
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // For delete confirmation dialog
  const [scriptToDelete, setScriptToDelete] = useState<number | null>(null); // Track which script to delete


  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const recordsPerPage = 10;


  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:3000/scripts")
      .then((response) => response.json())
      .then((data: Script[]) => setScripts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDeleteConfirmation = (id: number) => {
    setScriptToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (scriptToDelete) {
      fetch(`http://localhost:3000/scripts/${scriptToDelete}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setScripts((prevScripts) =>
              prevScripts.filter((script) => script.id !== scriptToDelete)
            );
            toast.success("Script deleted successfully", {
              duration: 3000,
              position: "top-right",
            });
          } else {
            console.error("Failed to delete script");
          }
        })
        .catch((error) => {
          console.error("Error deleting script:", error);
          toast.error("Error deleting script.", {
            duration: 3000,
            position: 'top-right',
          });
        })
        .finally(() => {
          setIsDeleteDialogOpen(false);
          setScriptToDelete(null);
        });
    }
  };


  const handleNewScriptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewScriptValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost:3000/scripts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newScriptValues),
    })
      .then((response) => response.json())
      .then((data) => {
        setScripts((prevScripts) => [...prevScripts, data]);
        setIsAddModalOpen(false);
        toast.success("Script added successfully", {
          duration: 3000,
          position: 'top-right',
        })
      })
      .catch((error) => {
        console.error("Error adding script:", error);
        toast.error("Error adding script.", {
          duration: 3000,
          position: 'top-right',
        });
      });
      setNewScriptValues({
        name: "",
        sector: "",
        parent_companies: "",
        portfolio: "",
        referred: "",
      });
  };

  const handleEdit = (script: Script) => {
    setEditingScript(script);
    setFormValues({
      name: script.name,
      sector: script.sector,
      parent_companies: script.parent_companies,
      portfolio: script.portfolio,
      referred: script.referred,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScript) return;

    fetch(`http://localhost:3000/scripts/${editingScript.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    })
      .then((response) => {
        if (response.ok) {
          setScripts((prevScripts) =>
            prevScripts.map((script) =>
              script.id === editingScript.id
                ? { ...script, ...formValues }
                : script
            )
          );
          setIsModalOpen(false);
          toast.success("Script updated successfully!", {
            duration: 3000,
            position: 'top-right',
          });
        } else {
          console.error("Failed to update script");
          toast.error("Failed to update script.", {
            duration: 3000,
            position: 'top-right',
          });
        }
      })
      .catch((error) => {
        console.error("Error updating script:", error);
        toast.error("Error updating script.", {
          duration: 3000,
          position: 'top-right',
        });
      });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(totalRecords / recordsPerPage)) {
      setCurrentPage(page);
    }
  };
  const indexOfLastScript = currentPage * recordsPerPage;
  const indexOfFirstScript = indexOfLastScript - recordsPerPage;
  const currentScripts = scripts.slice(indexOfFirstScript, indexOfLastScript);


    // Fetch total records once to calculate the total number of pages
    useEffect(() => {
      const fetchTotalRecords = async () => {
        try {
          const response = await fetch("http://localhost:3000/scripts");
          if (!response.ok) {
            throw new Error("Failed to fetch total scripts");
          }
          const data = await response.json();
          setTotalRecords(data.length); // Assuming the API returns the full array of scripts
        } catch (error) {
          console.error("Error fetching total scripts:", error);
        }
      };
  
      fetchTotalRecords();
    }, []);



  // Fetch scripts data based on current page
  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/scripts?page=${currentPage}&limit=${recordsPerPage}`);
        if (!response.ok) {
          throw new Error("Failed to fetch scripts");
        }
        const data = await response.json();
        setScripts(data);
      } catch (error) {
        console.error("Error fetching scripts:", error);
      }
    };

    fetchScripts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const modalClose = () => {
    setIsAddModalOpen(false);
    setNewScriptValues({
      name: "",
      sector: "",
      parent_companies: "",
      portfolio: "",
      referred: "",
    });
  };


  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col">
          <CardTitle>Scripts</CardTitle>
          <CardDescription>
            Manage your scripts and view details.
          </CardDescription>
        </div>
        <Button
          size="sm"
          className="h-8 gap-1"
          onClick={() => setIsAddModalOpen(true)}
        >
          <CirclePlusIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add script
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Sector</TableHead>
              <TableHead className="hidden sm:table-cell">
                Parent Companies
              </TableHead>
              <TableHead>Portfolio</TableHead>
              <TableHead>Referred</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentScripts.map((script) => (
              <TableRow key={script.id}>
                <TableCell className="font-medium">{script.name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {script.sector}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {script.parent_companies}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {script.portfolio}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {script.referred}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(script)}
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
                            onClick={() => handleDeleteConfirmation(script.id)}
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

        

        {isAddModalOpen && (
          <Dialog
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
                <h2 className="text-lg font-semibold">Add New Script</h2>
                <form onSubmit={handleAddSubmit} className="mt-4">
                  <label className="block">
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={newScriptValues.name}
                      onChange={handleNewScriptChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Sector:
                    <input
                      type="text"
                      name="sector"
                      value={newScriptValues.sector}
                      onChange={handleNewScriptChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Parent Companies:
                    <input
                      type="text"
                      name="parent_companies"
                      value={newScriptValues.parent_companies}
                      onChange={handleNewScriptChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Portfolio:
                    <input
                      type="text"
                      name="portfolio"
                      value={newScriptValues.portfolio}
                      onChange={handleNewScriptChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <label className="block mt-2">
                    Referred:
                    <input
                      type="text"
                      name="referred"
                      value={newScriptValues.referred}
                      onChange={handleNewScriptChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </label>
                  <div className="mt-4 flex gap-2">
                    <Button type="submit">Add Script</Button>
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

        {/* Edit Script Modal */}
        {isModalOpen && editingScript && (
          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
                <h2 className="text-lg font-semibold">Edit Script</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                  <label className="block">
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <label className="block mt-2">
                    Sector:
                    <input
                      type="text"
                      name="sector"
                      value={formValues.sector}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <label className="block mt-2">
                    Parent Companies:
                    <input
                      type="text"
                      name="parent_companies"
                      value={formValues.parent_companies}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <label className="block mt-2">
                    Portfolio:
                    <input
                      type="text"
                      name="portfolio"
                      value={formValues.portfolio}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                  </label>
                  <label className="block mt-2">
                    Referred:
                    <input
                      type="text"
                      name="referred"
                      value={formValues.referred}
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
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
              <h2 className="text-lg font-semibold">Confirm Deletion</h2>
              <p className="mt-2">Are you sure you want to delete this script?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          </div>
        </Dialog>
      </CardContent>
    </Card>
  );
}
