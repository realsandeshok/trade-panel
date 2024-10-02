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
import { FilterIcon } from "lucide-react";

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

        // Fetch holdings data
        const holdingsResponse = await fetch("http://localhost:3000/holdings"); // Replace with your API endpoint
        const holdingsData: Holding[] = await holdingsResponse.json();

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
}
