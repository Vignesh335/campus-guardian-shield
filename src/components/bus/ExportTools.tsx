import React, { useEffect, useState } from "react";
import { FileText, Download, Share2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "../Constants";
import axios from "axios";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ExportTools = () => {
  const { toast } = useToast();
  const [exportType, setExportType] = useState("busLogs");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [busLogs, setBusLogs] = useState([]);
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (date) {
      fetchBusLogs(date);
    }
  }, [date]);

  const fetchBusLogs = async (date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bus_tracker/gpslogs/?date=${format(date, "yyyy-MM-dd")}`);
      setBusLogs(response.data);
    } catch (error) {
      console.error("Error fetching bus logs:", error.response?.data || error.message);
    }
  };

  const handleExport = () => {
    const typeLabel =
      exportType === "busLogs"
        ? "Bus Entry/Exit Logs"
        : exportType === "schedule"
          ? "Bus Schedule"
          : "Departure Sheet";

    toast({
      title: "Export Started",
      description: `${typeLabel} will be exported as ${exportFormat.toUpperCase()} shortly.`,
      variant: "default",
    });

    console.log(exportFormat)
    // Call the respective export function based on the selected format
    if (exportFormat === "pdf") {
      exportAsPDF();
    } else if (exportFormat === "excel") {
      exportAsExcel();
    }
  };

  const exportAsPDF = () => {
    // Define the content for the PDF
    const docDefinition = {
      content: [
        { text: "Bus Entry/Exit Logs", style: "header" },
        { text: `Date: ${format(date, "PPP")}`, style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "*", "auto"],
            body: [
              ["Bus", "Latitude", "Longitude", "Timestamp"],
              ...busLogs.map((log) => [
                log.bus?.name || "N/A",
                log.latitude,
                log.longitude,
                format(new Date(log.timestamp), "PPpp"),
              ]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: "center" },
        subheader: { fontSize: 14, italics: true, margin: [0, 10] },
      },
    };

    // pdfMake.createPdf(docDefinition).download("bus_entry_exit_logs.pdf");
  };
  const sanitizeSheetName = (name) => {
    // Replace invalid characters with "_"
    return name.replace(/[\\\/\?\*\[\]:]/g, "_");
  };
  
  const exportAsExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Bus Model', 'Plate Number', 'Capacity', 'Driver', 'Driver License'],
      [busLogs[0].bus.model, busLogs[0].bus.plate_number, busLogs[0].bus.capacity, busLogs[0].bus.driver.name, busLogs[0].bus.driver.license_no],
      ['Route', 'Start Point', 'End Point', 'Departure Time', 'Arrival Time'],
      [busLogs[0].bus.last_trip.route.name, busLogs[0].bus.last_trip.route.start_point, busLogs[0].bus.last_trip.route.end_point, busLogs[0].bus.last_trip.departure_time, busLogs[0].bus.last_trip.arrival_time],
      ['Stop Name', 'Arrival Time', 'Status'],
      ...busLogs[0].bus.last_trip.stop_times.map((stop) => [
        stop.stop_name,
        stop.arrival_time,
        stop.stop_status,
      ]),
      ['Log Timestamp', 'Latitude', 'Longitude', 'Log Type'],
      [busLogs[0].timestamp, busLogs[0].latitude, busLogs[0].longitude, busLogs[0].log_type],
    ]);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bus Logs Report');
    XLSX.writeFile(wb, 'bus_logs_report.xlsx');
  };
  
  
  const handleShare = () => {
    toast({
      title: "Share Links Generated",
      description: "Secure link has been copied to clipboard and can be shared with authorized personnel.",
      variant: "default",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export & Reports
        </CardTitle>
        <CardDescription>Generate and share bus reports and schedules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="busLogs">Bus Entry/Exit Logs</SelectItem>
                  <SelectItem value="schedule">Bus Schedule</SelectItem>
                  <SelectItem value="departureSheet">Departure Sheet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Format</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleExport} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export {exportFormat.toUpperCase()}
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportTools;
