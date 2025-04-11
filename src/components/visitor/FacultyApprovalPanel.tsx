
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { API_BASE_URL } from "../Constants";

interface Faculty {
  id: number;
  name: string;
  department: string;
}

interface VisitorData {
  // name: string;
  // purpose: string;
  // faculty: number;
  // photoUrl: string;
  // status?: "pending" | "approved" | "denied";
  // timestamp?: string;
  id: string;
  name: string;
  purpose: string;
  whom_to_meet: number;
  photo: string;
  status?: "pending" | "approved" | "denied";
  timestamp?: string;
}

interface FacultyApprovalPanelProps {
  visitor: VisitorData;
  faculty?: Faculty;
  onResponse: (response: "approved" | "denied") => void;
}

export default function FacultyApprovalPanel({
  visitor,
  faculty,
  onResponse
}: FacultyApprovalPanelProps) {
  const [loading, setLoading] = useState(false);
  const [simulationState, setSimulationState] = useState<"waiting" | "receiving" | "received">("waiting");

  // Simulate the faculty reviewing the notification
  const simulateFacultyReview = async () => {
    try {
      if (visitor.id && visitor.whom_to_meet) {
        setSimulationState("receiving");
        const response = await axios.post(`${API_BASE_URL}/notifications/create/`, {
          "management_id": visitor.whom_to_meet,
          "visitor_id": visitor.id,
          "title": `${visitor.name} came to visit you`,
          "message": `${visitor.purpose}`
        });

        // Log the response
        console.log("Visitor created:", response.data);

        if (response.data?.status === "Notification created and email sent")

          setSimulationState("received");
        return response.data;
      }
    } catch (error) {
      // Log any errors that occur during the request
      console.error("Error submitting form:", error);

      // You can return a failure status or null to indicate an error
      return null;
    }

    // // Simulate network delay
    // setTimeout(() => {
    //   setSimulationState("received");
    // }, 2000);
  };

  // Handle approval click
  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/visitors/${visitor.id}/update_status/`, {
        "status": "APPROVED",
        "denial_reason": "APPROVED"
      });

      // Log the response
      onResponse("approved");
      return response.data;
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    finally {
      setLoading(false);
    }
  };

  // Handle denial click
  const handleDeny = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/visitors/${visitor.id}/update_status/`, {
        "status": "DENIED",
        "denial_reason": "No available appointment slot"
      });

      onResponse("denied");
      return response.data;
    } catch (error) {
      console.error("Error submitting form:", error);

    }
    finally {

      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Faculty Notification</h3>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                <span>Notification sent to:</span>
                <div className="font-bold mt-1">{faculty?.name || "Unknown Faculty"}</div>
                <div className="text-sm text-muted-foreground">{faculty?.department || "Unknown Department"}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  simulationState === "waiting" ? "bg-yellow-500" :
                    simulationState === "receiving" ? "bg-blue-500 animate-pulse" :
                      "bg-green-500"
                )}></div>
                <span>
                  {simulationState === "waiting" ? "Waiting for faculty to view..." :
                    simulationState === "receiving" ? "Faculty reviewing notification..." :
                      "Faculty has seen the notification"}
                </span>
              </div>

              {simulationState === "waiting" && (
                <Button
                  onClick={simulateFacultyReview}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Simulate Faculty Viewing
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="text-sm font-medium mb-2">In a real system:</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>Faculty would receive a push notification on their phone/device</li>
              <li>Email notification with visitor details would be sent</li>
              <li>SMS alert for urgent approval requests</li>
              <li>Visitor photo would be verified with ID proof</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Faculty View</h3>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Visitor Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
                  <img
                    src={visitor.photo || "/placeholder.svg"}
                    alt={visitor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">{visitor.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Purpose of Visit:</h4>
                <p className="text-sm p-2 bg-muted rounded-md">{visitor.purpose}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
              <Button
                onClick={handleApprove}
                disabled={simulationState !== "received" || loading}
                className="flex-1"
                size="sm"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={handleDeny}
                variant="outline"
                disabled={simulationState !== "received" || loading}
                className="flex-1"
                size="sm"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Deny
              </Button>
            </CardFooter>
          </Card>

          <div className="rounded-lg border p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-500" />
            <div className="text-sm">
              <p className="font-medium">Pending Response</p>
              <p className="text-muted-foreground">
                {simulationState === "received" ?
                  "Faculty is reviewing your request..." :
                  "Waiting for faculty to view notification..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
