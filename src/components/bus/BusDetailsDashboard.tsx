
import React, { useEffect, useState } from "react";
import { Calendar, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_BASE_URL } from "../Constants";
import axios from "axios";

// Sample data
const BUSES = [
  {
    id: 1,
    busNumber: "TS-01-1234",
    destination: "Karimnagar",
    departureTime: "17:15",
    driverName: "Rajesh Kumar",
    status: "onCampus",
    lastEntry: "08:30 AM",
    lastExit: "-"
  },
  {
    id: 2,
    busNumber: "TS-02-5678",
    destination: "Warangal",
    departureTime: "16:45",
    driverName: "Suresh Reddy",
    status: "scheduled",
    lastEntry: "07:45 AM",
    lastExit: "-"
  },
  {
    id: 3,
    busNumber: "TS-03-9012",
    destination: "Hyderabad",
    departureTime: "18:00",
    driverName: "Venkat Rao",
    status: "departed",
    lastEntry: "07:30 AM",
    lastExit: "16:15 PM"
  },
  {
    id: 4,
    busNumber: "TS-04-3456",
    destination: "Nizamabad",
    departureTime: "16:30",
    driverName: "Anil Kumar",
    status: "onCampus",
    lastEntry: "08:15 AM",
    lastExit: "-"
  },
  {
    id: 5,
    busNumber: "TS-05-7890",
    destination: "Adilabad",
    departureTime: "17:30",
    driverName: "Ravi Teja",
    status: "departed",
    lastEntry: "08:00 AM",
    lastExit: "17:05 PM"
  }
];

const BusDetailsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busesData, setBusesData] = useState([])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "onCampus":
        return <Badge className="bg-green-500">On Campus</Badge>;
      case "scheduled":
        return <Badge className="bg-orange-500">Scheduled</Badge>;
      case "departed":
        return <Badge className="bg-red-500">Departed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Filter buses based on search term and filters
  // const filteredBuses = BUSES.filter(bus => {
  const filteredBuses = busesData.filter(bus => {
    const matchesSearch =
      // bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // bus.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // bus.driverName.toLowerCase().includes(searchTerm.toLowerCase());
      bus.bus_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.driver.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDestination = destinationFilter === "all" || bus.destination === destinationFilter;
    const matchesStatus = statusFilter === "all" || bus.status === statusFilter;

    return matchesSearch && matchesDestination && matchesStatus;
  });

  // Get unique destinations for filter
  const destinations = Array.from(new Set(BUSES.map(bus => bus.destination)));

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bus_track/bus_data/`);
        setBusesData(response.data.buses)
      } catch (error) {
        console.error('Error fetching faculty:', error.response?.data || error.message);
      }
    })();
  }, []);

  console.log(new Date(busesData?.[0]?.locations?.filter((location) => location.status === 'On Campus')?.[0]?.timestamp).toLocaleString())

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Bus Details Dashboard
        </CardTitle>
        <CardDescription>
          View and filter all buses associated with the campus
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by bus number, destination, or driver..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-1 gap-2">
            <Select value={destinationFilter} onValueChange={setDestinationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {destinations.map(dest => (
                  <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {/* <SelectItem value="onCampus">On Campus</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="departed">Departed</SelectItem> */}
                <SelectItem value="On Campus">On Campus</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Departed">Departed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bus Number</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Entry</TableHead>
                <TableHead>Last Exit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuses.length > 0 ? (
                filteredBuses.map((bus) => (
                  <TableRow key={bus.id}>
                    {/* <TableCell className="font-medium">{bus.busNumber}</TableCell> */}
                    <TableCell className="font-medium">{bus.bus_number}</TableCell>
                    {/* <TableCell>{bus.destination}</TableCell> */}
                    <TableCell>{bus?.schedules?.[0]?.destination}</TableCell>
                    <TableCell>{bus?.schedules?.[0]?.departure}</TableCell>
                    <TableCell>{bus?.driver?.name}</TableCell>
                    <TableCell>{getStatusBadge(bus.status)}</TableCell>
                    <TableCell>{new Date(busesData?.[0]?.locations?.filter((location) => location.status === 'On Campus')?.[0]?.timestamp).toLocaleString()}</TableCell>
                    {/* <TableCell>{bus.lastExit}</TableCell> */}
                    <TableCell>{new Date(bus?.locations?.filter((location) => location.status === 'departed')?.[0]?.timeStamp).toLocaleString() !== 'Invalid Date' ? new Date(bus?.locations?.filter((location) => location.status === 'departed')?.[0]?.timeStamp).toLocaleString() : ''}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No buses found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusDetailsDashboard;
