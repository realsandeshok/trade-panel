import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch scripts data
                const scriptsResponse = await fetch('http://localhost:3000/scripts'); // Replace with your API endpoint
                const scriptsData = await scriptsResponse.json();
                setScripts(scriptsData);

                // Fetch holdings data
                const holdingsResponse = await fetch('http://localhost:3000/holdings'); // Replace with your API endpoint
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
                const totalCost = parsedHoldings.reduce((acc: number, holding: Holding) => acc + holding.totalPurchaseValue, 0);
                setTotalHoldingCost(totalCost);
                setHoldings(parsedHoldings);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Group holdings by scriptName and sum totalPurchaseValue and totalQuantity
    // const groupedHoldings = holdings.reduce((acc, holding) => {
    //     if (!acc[holding.scriptName]) {
    //         acc[holding.scriptName] = {
    //             ...holding,
    //             totalQuantity: holding.totalQuantity,
    //             totalPurchaseValue: holding.totalPurchaseValue,
    //         };
    //     } else {
    //         acc[holding.scriptName].totalQuantity += holding.totalQuantity;
    //         acc[holding.scriptName].totalPurchaseValue += holding.totalPurchaseValue;
    //     }

    //     return acc;
    // }, {} as Record<string, Holding>);

    // const groupedHoldingsArray = Object.values(groupedHoldings);


    // Group holdings by sector and sum totalPurchaseValue
    const groupedHoldingsBySector = holdings.reduce((acc, holding) => {
        const script = scripts.find(s => s.name === holding.scriptName);
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
    const sectorWithPercentages = sectorArray.map(sector => ({
        sector: sector.sector,
        percentageHolding: ((sector.totalPurchaseValue / totalHoldingCost) * 100).toFixed(1),
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
                                    {scripts.map((script) => {
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
                                            <TableCell className="text-right">{sector.percentageHolding}%</TableCell>
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
