
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Steps, Step } from "@/components/visitor/Steps";
import VisitorFormPanel from "@/components/visitor/VisitorFormPanel";
import FacultyApprovalPanel from "@/components/visitor/FacultyApprovalPanel";
import { Camera, User, CheckCircle, XCircle, FileText, Bell, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "../Constants";
import axios from "axios";

// Mock faculty list
const FACULTY_LIST = [
  { id: 1, name: "Dr. James Wilson", department: "Computer Science" },
  { id: 2, name: "Prof. Sarah Chen", department: "Engineering" },
  { id: 3, name: "Dr. Robert Johnson", department: "Business" },
  { id: 4, name: "Prof. Emily Davis", department: "Arts & Humanities" },
  { id: 5, name: "Dr. Michael Brown", department: "Medicine" }
];

type VisitorData = {
  name: string;
  purpose: string;
  faculty: number;
  photoUrl: string;
  status?: "pending" | "approved" | "denied";
  timestamp?: string;
}

export default function VisitorDetectionFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [faceMatch, setFaceMatch] = useState<boolean | null>(null);
  const [facultyListData, setFacultyListData] = useState([])
  const [visitorData, setVisitorData] = useState<VisitorData>({
    name: "",
    purpose: "",
    faculty: 0,
    photoUrl: "/placeholder.svg"
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [approvalResponse, setApprovalResponse] = useState<"approved" | "denied" | null>(null);
  const [newVisitor, setNewVisitor] = useState<any>({})
  const { toast } = useToast();

  // Start face detection simulation when component mounts
  useEffect(() => {
    if (activeStep === 0) {
      simulateFaceDetection();
    }
  }, [activeStep]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/management/`);
        setFacultyListData(response.data)
      } catch (error) {
        console.error('Error fetching faculty:', error.response?.data || error.message);
      }
    })();
  }, []);

  // Function to simulate face detection
  const simulateFaceDetection = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      // Random result to demonstrate both flows
      const matched = Math.random() > 0.5;
      setFaceMatch(matched);

      if (matched) {
        toast({
          title: "Authorized Person",
          description: "Person identified as authorized. Entry allowed.",
          variant: "default",
        });
        // Reset to first step for demo purposes
        setTimeout(() => {
          resetFlow();
        }, 3000);
      } else {
        toast({
          title: "Unknown Person",
          description: "Unknown person detected. Collecting visitor information.",
          variant: "destructive",
        });
        setActiveStep(2); // Go to visitor info collection step
      }
    }, 2000);
  };

  // // Handle form submission
  // const handleVisitorFormSubmit = (data: VisitorData) => {
  //   setVisitorData({
  //     ...data,
  //     timestamp: new Date().toISOString(),
  //     status: "pending"
  //   });
  //   setActiveStep(3); // Go to faculty notification step
  // };
  const handleVisitorFormSubmit = async (formData: FormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/visitors/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Log the response
      console.log("Visitor created:", response.data);

      setNewVisitor(response.data)

      // Optionally return the response data if you want to use it elsewhere
      return response.data;
    } catch (error) {
      // Log any errors that occur during the request

      console.error("Error submitting form:", error);

      // You can return a failure status or null to indicate an error
      return null;
    }
  };

  // Handle faculty approval response
  const handleApprovalResponse = (response: "approved" | "denied") => {
    setApprovalResponse(response);
    setVisitorData(prev => ({
      ...prev,
      status: response
    }));
    setActiveStep(4); // Go to response simulation step

    // Show toast notification
    toast({
      title: response === "approved" ? "Entry Approved" : "Entry Denied",
      description: response === "approved"
        ? "Guard has been notified to allow visitor entry."
        : "Guard has been notified to deny visitor entry.",
      variant: response === "approved" ? "default" : "destructive",
    });

    // After showing the result, add to logs and reset
    setTimeout(() => {
      setActiveStep(5); // Go to audit step
    }, 2000);
  };

  // Reset the flow to start again
  const resetFlow = () => {
    setActiveStep(0);
    setFaceMatch(null);
    setVisitorData({
      name: "",
      purpose: "",
      faculty: 0,
      photoUrl: "/placeholder.svg"
    });
    setApprovalResponse(null);
    setIsCapturing(false);
  };

  return (
    <div className="space-y-6">
      <Steps activeStep={activeStep}>
        <Step
          icon={<Camera className="h-5 w-5" />}
          title="Live Face Capture"
          description="CCTV captures face of incoming visitor"
        >
          <div className="flex flex-col items-center justify-center p-4 gap-4">
            <div className={cn(
              "relative w-full max-w-md aspect-video bg-muted rounded-lg overflow-hidden border-2",
              isCapturing ? "border-yellow-500 animate-pulse" : "border-border"
            )}>
              <div className="absolute inset-0 flex items-center justify-center">
                {isCapturing ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                    <p className="mt-2 text-sm">Scanning face...</p>
                  </div>
                ) : (
                  faceMatch === null ? (
                    <Camera className="h-16 w-16 text-muted-foreground" />
                  ) : faceMatch ? (
                    <div className="text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                      <p className="mt-2 font-medium text-green-500">Person identified as authorized</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                      <p className="mt-2 font-medium text-red-500">Unknown person detected</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {!isCapturing && faceMatch === null && (
              <Button onClick={simulateFaceDetection}>
                Start Face Detection
              </Button>
            )}
          </div>
        </Step>

        <Step
          icon={<User className="h-5 w-5" />}
          title="AI Face Match Check"
          description="System matches face against database"
          status={faceMatch === null ? "pending" : faceMatch ? "complete" : "error"}
        >
          <div className="flex flex-col space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={cn("border-l-4", faceMatch ? "border-l-green-500" : "border-l-muted")}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={cn("h-5 w-5", faceMatch ? "text-green-500" : "text-muted")} />
                    <span className={cn(faceMatch ? "text-green-500 font-medium" : "text-muted-foreground")}>
                      Match Found - Authorized Entry
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className={cn("border-l-4", faceMatch === false ? "border-l-red-500" : "border-l-muted")}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className={cn("h-5 w-5", faceMatch === false ? "text-red-500" : "text-muted")} />
                    <span className={cn(faceMatch === false ? "text-red-500 font-medium" : "text-muted-foreground")}>
                      No Match - Proceed to Visitor Info
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Step>

        <Step
          icon={<FileText className="h-5 w-5" />}
          title="Visitor Info Collection"
          description="Collect details from the visitor"
        >
          <VisitorFormPanel
            // facultyList={FACULTY_LIST}
            facultyList={facultyListData}
            newVisitor={newVisitor}
            onSubmit={handleVisitorFormSubmit}
          />
        </Step>

        <Step
          icon={<Bell className="h-5 w-5" />}
          title="Faculty Notification"
          description="Faculty receives visitor request"
        >
          <FacultyApprovalPanel
            // visitor={visitorData}
            visitor={newVisitor}
            faculty={FACULTY_LIST.find(f => f.id === visitorData.faculty)}
            onResponse={handleApprovalResponse}
          />
        </Step>

        <Step
          icon={<Clock className="h-5 w-5" />}
          title="Faculty Response"
          description="Guard receives faculty response"
          status={approvalResponse === "approved" ? "complete" : approvalResponse === "denied" ? "error" : "pending"}
        >
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className={cn(
              "p-4 rounded-full",
              approvalResponse === "approved" ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
            )}>
              {approvalResponse === "approved" ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
            </div>

            <h3 className="text-xl font-bold text-center">
              {approvalResponse === "approved" ? "Entry Approved" : "Entry Denied"}
            </h3>

            <p className="text-center text-muted-foreground max-w-md">
              {approvalResponse === "approved"
                ? "The faculty member has approved this visitor. Guard has been notified to allow entry."
                : "The faculty member has denied this visitor. Guard has been notified to deny entry."}
            </p>
          </div>
        </Step>

        <Step
          icon={<FileText className="h-5 w-5" />}
          title="Audit & Reporting"
          description="Entry recorded in visitor logs"
        >
          <div className="flex flex-col space-y-4 p-4">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Photo</th>
                    <th className="px-4 py-3 text-left">Visitor Name</th>
                    <th className="px-4 py-3 text-left">Date/Time</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Faculty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                        <img
                          // src={visitorData.photoUrl || "/placeholder.svg"}
                          // alt={visitorData.name}
                          src={newVisitor.photoUrl || "/placeholder.svg"}
                          alt={newVisitor.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    {/* <td className="px-4 py-3 font-medium">{visitorData.name}</td> */}
                    <td className="px-4 py-3 font-medium">{newVisitor.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{
                      // visitorData.timestamp
                      //   ? new Date(visitorData.timestamp).toLocaleString()
                      //   : "-"
                      newVisitor.check_in
                        ? new Date(newVisitor.check_in).toLocaleString()
                        : "-"
                    }</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        // visitorData.status === "approved"
                        newVisitor.status === "APPROVED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          // : visitorData.status === "denied"
                          : newVisitor.status === "DENIED"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                      )}>
                        {/* {visitorData.status === "approved"
                          ? "Approved"
                          : visitorData.status === "denied"
                            ? "Denied"
                            : "Pending"} */}
                        {newVisitor.status === "APPROVED"
                          ? "Approved"
                          : newVisitor.status === "DENIED"
                            ? "Denied"
                            : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{
                      // FACULTY_LIST.find(f => f.id === visitorData.faculty)?.name || "-"
                      facultyListData.find(f => f.id === newVisitor.whom_to_meet)?.display_name || "-"
                    }</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <Button onClick={resetFlow}>
                Start New Detection
              </Button>
            </div>
          </div>
        </Step>
      </Steps>
    </div>
  );
}
