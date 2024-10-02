import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { FilterIcon } from "lucide-react";
=======
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    // PaginationEllipsis,
} from "@/components/ui/pagination";
>>>>>>> 5f0af07c85d37f66b2e1445b556374c4168bb971

interface Script {
  id: number;
  name: string;
  sector: string;
  parent_companies: string;
}

interface Holding {
  scriptName: string;
  totalPurchaseValue: number;
  totalQuantity: number;
  avgHoldingCost: number;
}

export function Analytics() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [totalHoldingCost, setTotalHoldingCost] = useState(0);

<<<<<<< HEAD
  // New states for filter
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedParentCompany, setSelectedParentCompany] =
    useState<string>("");
  const [filteredHoldings, setFilteredHoldings] = useState<Holding[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch scripts data
        const scriptsResponse = await fetch("http://localhost:3000/scripts"); // Replace with your API endpoint
        const scriptsData = await scriptsResponse.json();
        setScripts(scriptsData);
=======


    const [particularCurrentPage, setParticularCurrentPage] = useState(1);
    const [sectorCurrentPage, setSectorCurrentPage] = useState(1);
    // const [currentPage,setCurrentPage] = useState(1)
    const [particularTotalRecords, setParticularTotalRecords] = useState<number>(0);
    const [sectorTotalRecords, setSectorTotalRecords] = useState<number>(0);
    const recordsPerPage = 10;

    // Fetch Particular total records once to calculate the total number of pages
    useEffect(() => {
        const fetchParticularTotalRecords = async () => {
            try {
                const response = await fetch("http://localhost:3000/holdings");
                if (!response.ok) {
                    throw new Error("Failed to fetch total holdings");
                }
                const data = await response.json();
                // console.log(data.length)
                setParticularTotalRecords(data.length);  // Assuming the API returns the full array of transactions
                // console.log(setTotalRecords)
                // console.log(totalRecords)
            } catch (error) {
                console.error("Error fetching total holdinhgs:", error);
            }
        };
        fetchParticularTotalRecords();
    }, []);


    // Fetch sector total records once to calculate the total number of pages
    useEffect(() => {
        const fetchSectorTotalRecords = async () => {
            try {
                const response = await fetch("http://localhost:3000/scripts");
                if (!response.ok) {
                    throw new Error("Failed to fetch total holdings");
                }
                const data = await response.json();
                // console.log(data.length)
                setSectorTotalRecords(data.length);  // Assuming the API returns the full array of transactions
                // console.log(setTotalRecords)
                // console.log(totalRecords)
            } catch (error) {
                console.error("Error fetching total holdinhgs:", error);
            }
        };
        fetchSectorTotalRecords();
    }, []);


    // Handle page change
    const handleParticularPageChange = (page: number) => {
        if (page > 0 && page <= Math.ceil(particularTotalRecords / recordsPerPage)) {
            setParticularCurrentPage(page);
        }
    };
    const handleSectorPageChange = (page: number) => {
        if (page > 0 && page <= Math.ceil(sectorTotalRecords / recordsPerPage)) {
            setSectorCurrentPage(page);
        }
    };
    const indexOfLastParticulars = particularCurrentPage * recordsPerPage;
    const indexOfLastSectors = sectorCurrentPage * recordsPerPage;

    const indexOfFirstParticularss = indexOfLastParticulars - recordsPerPage;
    const indexOfFirstSectors = indexOfLastSectors - recordsPerPage;

    const currentParticulars = scripts.slice(indexOfFirstParticularss, indexOfLastParticulars);

    const particularTotalPages = Math.ceil(particularTotalRecords / recordsPerPage);
    const sectorTotalPages = Math.ceil(sectorTotalRecords / recordsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch scripts data
                const scriptsResponse = await fetch('http://localhost:3000/scripts?page=${currentPage}&limit=${recordsPerPage}'); // Replace with your API endpoint
                const scriptsData = await scriptsResponse.json();
                setScripts(scriptsData);

                // Fetch holdings data
                const holdingsResponse = await fetch('http://localhost:3000/holdings?page=${currentPage}&limit=${recordsPerPage}'); // Replace with your API endpoint
                const holdingsData: Holding[] = await holdingsResponse.json();
>>>>>>> 5f0af07c85d37f66b2e1445b556374c4168bb971

        // Fetch holdings data
        const holdingsResponse = await fetch("http://localhost:3000/holdings"); // Replace with your API endpoint
        const holdingsData: Holding[] = await holdingsResponse.json();

<<<<<<< HEAD
        const parsedHoldings = holdingsData.map((holding) => ({
          ...holding,
          totalQuantity: parseFloat(holding.totalQuantity.toString()),
          totalPurchaseValue: parseFloat(holding.totalPurchaseValue.toString()),
          avgHoldingCost: parseFloat(holding.avgHoldingCost.toString()),
          // eachPrice:parseFloat(holding.eachPrice.toString()),
          // transactions: holding.transactions.map((transaction) => ({
          //   ...transaction,
          //   quantity: parseFloat(transaction.quantity.toString()),
          //   purchaseValue: parseFloat(transaction.purchaseValue.toString()),
          //   eachPrice: parseFloat(transaction.eachPrice.toString())
          // })),
        }));
=======
                const parsedHoldings = holdingsData.map((holding) => ({
                    ...holding,
                    totalQuantity: parseFloat(holding.totalQuantity.toString()),
                    totalPurchaseValue: parseFloat(holding.totalPurchaseValue.toString()),
                    avgHoldingCost: parseFloat(holding.avgHoldingCost.toString()),

                }));
>>>>>>> 5f0af07c85d37f66b2e1445b556374c4168bb971

        // Calculate total holding cost
        const totalCost = parsedHoldings.reduce(
          (acc: number, holding: Holding) => acc + holding.totalPurchaseValue,
          0
        );
        setTotalHoldingCost(totalCost);
        setHoldings(parsedHoldings);
        setFilteredHoldings(parsedHoldings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Apply filter logic when the user clicks the "Filter" button
  const applyFilters = () => {
    let filteredData = holdings;

    if (selectedSector) {
      filteredData = filteredData.filter((holding) => {
        const script = scripts.find((s) => s.name === holding.scriptName);
        return script?.sector === selectedSector;
      });
    }

    if (selectedParentCompany) {
      filteredData = filteredData.filter((holding) => {
        const script = scripts.find((s) => s.name === holding.scriptName);
        return script?.parent_companies === selectedParentCompany;
      });
    }

    setFilteredHoldings(filteredData);
    setIsFilterOpen(false);
  };

  // Clear the filter
  const clearFilters = () => {
    setSelectedSector("");
    setSelectedParentCompany("");
    setFilteredHoldings(holdings); // Reset to all holdings
  };

  // Group holdings by sector and sum totalPurchaseValue
  const groupedHoldingsBySector = holdings.reduce((acc, holding) => {
    const script = scripts.find((s) => s.name === holding.scriptName);
    if (script) {
      if (!acc[script.sector]) {
        acc[script.sector] = {
          sector: script.sector,
          totalPurchaseValue: 0,
        };
      }
      acc[script.sector].totalPurchaseValue += holding.totalPurchaseValue;
    }
    return acc;
  }, {} as Record<string, { sector: string; totalPurchaseValue: number }>);

  const sectorArray = Object.values(groupedHoldingsBySector);

<<<<<<< HEAD
  // Calculate percentage holding for each sector
  const sectorWithPercentages = sectorArray.map((sector) => ({
    sector: sector.sector,
    percentageHolding: (
      (sector.totalPurchaseValue / totalHoldingCost) *
      100
    ).toFixed(1),
  }));

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="particulars">
          {/* Tabs List */}
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="particulars">Particulars Page</TabsTrigger>
            <TabsTrigger value="sector">Sector Page</TabsTrigger>
          </TabsList>
=======
>>>>>>> 5f0af07c85d37f66b2e1445b556374c4168bb971

          {/* Particulars Page */}
          <TabsContent value="particulars">
            {/* Filter UI */}
            {/* <div className="flex justify-end space-x-4 mb-4">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Sectors">All Sectors</SelectItem>
                  {scripts.map((script) => (
                    <SelectItem key={script.sector} value={script.sector}>
                      {script.sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedParentCompany}
                onValueChange={setSelectedParentCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Parent Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All parent Companies">All Parent Companies</SelectItem>
                  {scripts.map((script) => (
                    <SelectItem
                      key={script.parent_companies}
                      value={script.parent_companies}
                    >
                      {script.parent_companies}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={applyFilters}>Filter</Button>
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filter
              </Button>
            </div> */}
            <div className="flex justify-end mb-4">
              <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filter Options</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Select
                      value={selectedSector}
                      onValueChange={setSelectedSector}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Sectors">All Sectors</SelectItem>
                        {Array.from(
                          new Set(scripts.map((script) => script.sector))
                        ).map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedParentCompany}
                      onValueChange={setSelectedParentCompany}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Parent Company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All parent Companies">
                          All Parent Companies
                        </SelectItem>
                        {Array.from(
                          new Set(
                            scripts.map((script) => script.parent_companies)
                          )
                        ).map((parent_companies) => (
                          <SelectItem key={parent_companies} value={parent_companies}>
                            {parent_companies}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={clearFilters}>
                      Reset
                    </Button>
                    <Button onClick={applyFilters}>Apply Filters</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="overflow-x-auto sm:overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Script Name</TableHead>
                    <TableHead>Total Holding Quantity</TableHead>
                    <TableHead>Average Cost</TableHead>
                    <TableHead>Total Holding Cost</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Parent Company</TableHead>
                    <TableHead>% Holding</TableHead>
                  </TableRow>
                </TableHeader>

<<<<<<< HEAD
                <TableBody>
                  {filteredHoldings.map((holding) => {
                    const script = scripts.find(
                      (s) => s.name === holding.scriptName
                    );
                    const percentageHolding = holding
                      ? (
                          (holding.totalPurchaseValue / totalHoldingCost) *
                          100
                        ).toFixed(1)
                      : 0;
=======
    const currentSectors = sectorWithPercentages.slice(indexOfFirstSectors, indexOfLastSectors);
>>>>>>> 5f0af07c85d37f66b2e1445b556374c4168bb971

                    return (
                      <TableRow key={holding.scriptName}>
                        <TableCell>{holding.scriptName}</TableCell>
                        <TableCell>{holding?.totalQuantity ?? ""}</TableCell>
                        <TableCell>
                          ₹{holding?.avgHoldingCost.toFixed(2) ?? ""}
                        </TableCell>
                        <TableCell>
                          ₹{holding?.totalPurchaseValue.toLocaleString() ?? ""}
                        </TableCell>
                        <TableCell>{script?.sector}</TableCell>
                        <TableCell>{script?.parent_companies}</TableCell>
                        <TableCell>{percentageHolding}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={3}>Total Holding</TableCell>
                    <TableCell>₹{totalHoldingCost.toLocaleString()}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>100</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Sector Page */}
          <TabsContent value="sector">
            <div className="overflow-x-auto sm:overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sector Name</TableHead>
                    <TableHead className="text-right">Holding %</TableHead>
                  </TableRow>
                </TableHeader>

<<<<<<< HEAD
                <TableBody>
                  {sectorWithPercentages.map((sector, index) => (
                    <TableRow key={index}>
                      <TableCell>{sector.sector}</TableCell>
                      <TableCell className="text-right">
                        {sector.percentageHolding}%
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
=======
            <CardContent>
                <Tabs defaultValue="particulars">
                    {/* Tabs List */}
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="particulars">Particulars Page</TabsTrigger>
                        <TabsTrigger value="sector">Sector Page</TabsTrigger>
                    </TabsList>

                    {/* Particulars Page */}
                    <TabsContent value="particulars">
                        <div className="overflow-x-auto sm:overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Script Name</TableHead>
                                        <TableHead>Total Holding Quantity</TableHead>
                                        <TableHead>Average Cost</TableHead>
                                        <TableHead>Total Holding Cost</TableHead>
                                        <TableHead>Sector</TableHead>
                                        <TableHead>Parent Company</TableHead>
                                        <TableHead>% Holding</TableHead>
                                    </TableRow>
                                </TableHeader>


                                <TableBody>
                                    {currentParticulars.map((script) => {
                                        const holding = holdings.find(h => h.scriptName === script.name);

                                        const percentageHolding = holding
                                            ? ((holding.totalPurchaseValue / totalHoldingCost) * 100).toFixed(1)
                                            : 0;

                                        return (
                                            <TableRow key={script.id}>
                                                <TableCell>{script.name}</TableCell>
                                                <TableCell>{holding?.totalQuantity ?? ''}</TableCell>
                                                <TableCell>₹{holding?.avgHoldingCost.toFixed(2) ?? ''}</TableCell>
                                                <TableCell>₹{holding?.totalPurchaseValue.toLocaleString() ?? ''}</TableCell>
                                                <TableCell>{script.sector}</TableCell>
                                                <TableCell>{script.parent_companies}</TableCell>
                                                <TableCell>{percentageHolding}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {/* <TableRow>
                                        <TableCell colSpan={3}>Total Holding</TableCell>
                                        <TableCell>₹{totalHoldingCost.toLocaleString()}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>100</TableCell>
                                    </TableRow> */}
                                </TableBody>
                            </Table>

                            {/* Pagination controls */}
                            <Pagination>
                                <PaginationPrevious
                                    onClick={() => handleParticularPageChange(particularCurrentPage - 1)}
                                // disabled={currentPage === 1}
                                />

                                <PaginationContent>
                                    {Array.from({ length: particularTotalPages }, (_, index) => {
                                        const page = index + 1;
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => handleParticularPageChange(page)}
                                                    isActive={particularCurrentPage === page}
                                                    // Apply disabled styles if the link is inactive
                                                    className={particularCurrentPage === page ? '' : 'pointer-events-none opacity-50'}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}
                                </PaginationContent>

                                <PaginationNext
                                    onClick={() => handleParticularPageChange(particularCurrentPage + 1)}
                                // disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Total Investment</h2>
                                <p className="text-2xl font-bold">
                                    ₹{totalHoldingCost.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Sector Page */}
                    <TabsContent value="sector">
                        <div className="overflow-x-auto sm:overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sector Name</TableHead>
                                        <TableHead className="text-right">Holding %</TableHead>
                                    </TableRow>
                                </TableHeader>



                                <TableBody>
                                    {currentSectors.map((sector, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{sector.sector}</TableCell>
                                            <TableCell className="text-right">{sector.percentageHolding}%</TableCell>
                                        </TableRow>
                                    ))}
                                    {/* <TableRow>
                                        <TableCell>Total</TableCell>
                                        <TableCell className="text-right">100%</TableCell>
                                    </TableRow> */}
                                </TableBody>
                            </Table>
                            {/* Pagination controls */}
                            <Pagination>
                                <PaginationPrevious
                                    onClick={() => handleSectorPageChange(sectorCurrentPage - 1)}
                                // disabled={currentPage === 1}
                                />

                                <PaginationContent>
                                    {Array.from({ length: sectorTotalPages }, (_, index) => {
                                        const page = index + 1;
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => handleSectorPageChange(page)}
                                                    isActive={sectorCurrentPage === page}
                                                    // Apply disabled styles if the link is inactive
                                                    className={sectorCurrentPage === page ? '' : 'pointer-events-none opacity-50'}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}
                                </PaginationContent>

                                <PaginationNext
                                    onClick={() => handleSectorPageChange(sectorCurrentPage + 1)}
                                // disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Total</h2>
                                <p className="text-2xl font-bold">
                                    100%
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
>>>>>>> 5f0af07c85d37f66b2e1445b556374c4168bb971
}
