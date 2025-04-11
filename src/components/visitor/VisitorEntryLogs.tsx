
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Search, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { API_BASE_URL } from "../Constants";

// Mock visitor data
const MOCK_VISITORS = [
  {
    id: 1,
    name: "John Smith",
    purpose: "Meeting with Professor",
    faculty: "Dr. James Wilson",
    department: "Computer Science",
    photoUrl: "https://source.unsplash.com/random/100x100/?man,portrait",
    status: "approved",
    timestamp: new Date(2025, 3, 8, 10, 15).toISOString()
  },
  {
    id: 2,
    name: "Maria Garcia",
    purpose: "Project Discussion",
    faculty: "Prof. Sarah Chen",
    department: "Engineering",
    photoUrl: "https://source.unsplash.com/random/100x100/?woman,portrait",
    status: "approved",
    timestamp: new Date(2025, 3, 8, 11, 30).toISOString()
  },
  {
    id: 3,
    name: "David Johnson",
    purpose: "Interview",
    faculty: "Dr. Robert Johnson",
    department: "Business",
    photoUrl: "https://source.unsplash.com/random/100x100/?man,portrait,2",
    status: "denied",
    timestamp: new Date(2025, 3, 8, 13, 45).toISOString()
  },
  {
    id: 4,
    name: "Sarah Williams",
    purpose: "Guest Lecture",
    faculty: "Prof. Emily Davis",
    department: "Arts & Humanities",
    photoUrl: "https://source.unsplash.com/random/100x100/?woman,portrait,2",
    status: "pending",
    timestamp: new Date(2025, 3, 8, 14, 0).toISOString()
  },
  {
    id: 5,
    name: "Michael Brown",
    purpose: "Research Collaboration",
    faculty: "Dr. Michael Brown",
    department: "Medicine",
    photoUrl: "https://source.unsplash.com/random/100x100/?man,portrait,3",
    status: "approved",
    timestamp: new Date(2025, 3, 7, 15, 30).toISOString()
  },
  {
    id: 6,
    name: "Jennifer Lee",
    purpose: "Administrative Meeting",
    faculty: "Dr. James Wilson",
    department: "Computer Science",
    photoUrl: "https://source.unsplash.com/random/100x100/?woman,portrait,3",
    status: "approved",
    timestamp: new Date(2025, 3, 7, 16, 15).toISOString()
  },
  {
    id: 7,
    name: "Robert Martinez",
    purpose: "Campus Tour",
    faculty: "Prof. Sarah Chen",
    department: "Engineering",
    photoUrl: "https://source.unsplash.com/random/100x100/?man,portrait,4",
    status: "approved",
    timestamp: new Date(2025, 3, 6, 9, 0).toISOString()
  },
  {
    id: 8,
    name: "Elizabeth Taylor",
    purpose: "Service Installation",
    faculty: "Dr. Robert Johnson",
    department: "Business",
    photoUrl: "https://source.unsplash.com/random/100x100/?woman,portrait,4",
    status: "denied",
    timestamp: new Date(2025, 3, 6, 11, 0).toISOString()
  },
];

export default function VisitorEntryLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/visitors/`);
        setData(response.data)
      } catch (error) {
        console.error('Error fetching logs:', error.response?.data || error.message);
      }
    })();
  }, []);

  // Filter the visitors based on search query and status filter
  // const filteredVisitors = MOCK_VISITORS.filter(visitor => {
  const filteredVisitors = data.filter((visitor: any) => {
    const matchesSearch =
      // visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // visitor.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // visitor.purpose.toLowerCase().includes(searchQuery.toLowerCase());
      (visitor.name && visitor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (visitor.whom_to_meet && visitor.whom_to_meet.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (visitor.purpose && visitor.purpose.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      visitor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search visitors, faculty..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {/* <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="denied">Denied</SelectItem> */}
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="DENIED">Denied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableCaption>A list of all visitor entries to the campus.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Photo</TableHead>
              <TableHead>Visitor Name</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell>
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                      <img
                        // src={visitor.photoUrl}
                        src={visitor.photo}
                        alt={visitor.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell>{visitor.purpose}</TableCell>
                  <TableCell>
                    <div>
                      {/* <div>{visitor.faculty}</div> */}
                      <div>{visitor.whom_to_meet}</div>
                      <div className="text-xs text-muted-foreground">{visitor.department}</div>
                    </div>
                  </TableCell>
                  {/* <TableCell>{new Date(visitor.timestamp).toLocaleString()}</TableCell> */}
                  <TableCell>{new Date(visitor.check_in).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "flex items-center gap-1",
                        // visitor.status === "approved" && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
                        // visitor.status === "denied" && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
                        // visitor.status === "pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                        visitor.status === "APPROVED" && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
                        visitor.status === "DENIED" && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
                        visitor.status === "PENDING" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                      )}
                    >
                      {/* {visitor.status === "approved" ? ( */}
                      {visitor.status === "APPROVED" ? (
                        <CheckCircle className="h-3 w-3" />
                        // ) : visitor.status === "denied" ? (
                      ) : visitor.status === "DENIED" ? (
                        <XCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      <span className="capitalize">{visitor.status}</span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No visitor entries found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
