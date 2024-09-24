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

export function Analytics() {
  // const [data, setData] = useState([]);
  // const [totalHoldingCost, setTotalHoldingCost] = useState(0);

  ////1 if error

  // // Fetch data from backend
  // useEffect(() => {
  //   // Assuming your API call here
  //   fetch('/api/holdings') // Replace with your API endpoint
  //     .then(response => response.json())
  //     .then(data => {
  //       setData(data);
  //       // Calculate the total holding cost
  //       const total = data.reduce((sum, item) => sum + item.totalCost, 0);
  //       setTotalHoldingCost(total);
  //     });
  // }, []);

  ////2
  // useEffect(() => {
  //   fetch('/api/holdings') // Replace with your API endpoint
  //     .then(response => response.json())
  //     .then(fetchedData => {
  //       setData(fetchedData);

  //       // Safely calculate the total holding cost
  //       const total = fetchedData.reduce((sum, item) => {
  //         // If totalCost is undefined or null, treat it as 0
  //         const cost = item.totalCost ? item.totalCost : 0;
  //         return sum + cost;
  //       }, 0);

  //       setTotalHoldingCost(total);
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

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
                  <TableRow>
                    <TableCell>Rallis India</TableCell>
                    <TableCell>180</TableCell>
                    <TableCell>306</TableCell>
                    <TableCell>55,134</TableCell>
                    <TableCell>Agro Chemicals</TableCell>
                    <TableCell>Tata</TableCell>
                    <TableCell>9.2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sumitomo Chemicals</TableCell>
                    <TableCell>180</TableCell>
                    <TableCell>292</TableCell>
                    <TableCell>52,632</TableCell>
                    <TableCell>Agro Chemicals</TableCell>
                    <TableCell>MNC</TableCell>
                    <TableCell>8.7</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ashok Leyland</TableCell>
                    <TableCell>180</TableCell>
                    <TableCell>101</TableCell>
                    <TableCell>18,090</TableCell>
                    <TableCell>Auto</TableCell>
                    <TableCell>Other</TableCell>
                    <TableCell>3.0</TableCell>
                  </TableRow>

                  {/* {data.map((item, index) => {
              // Calculate % holding for each item
              const percentageHolding = ((item.totalCost / totalHoldingCost) * 100).toFixed(1);

              return (
                <TableRow key={index}>
                  <TableCell>{item.scriptName}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.avgCost}</TableCell>
                  <TableCell className="text-right">{item.totalCost.toLocaleString()}</TableCell>
                  <TableCell>{item.sector}</TableCell>
                  <TableCell>{item.parentCompany}</TableCell>
                  <TableCell className="text-right">{percentageHolding}</TableCell>
                </TableRow>
              );
            })} */}

                  <TableRow>
                    <TableCell colSpan={3}>Total Holding</TableCell>
                    <TableCell>$ 6,01,583</TableCell>

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
                  <TableRow>
                    <TableCell>Agro Chemicals</TableCell>
                    <TableCell className="text-right">18</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Auto</TableCell>
                    <TableCell className="text-right">47</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Auto Ancillary</TableCell>
                    <TableCell className="text-right">35</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">100</TableCell>
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
