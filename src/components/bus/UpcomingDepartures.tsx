
import React from "react";
import { Clock, AlertTriangle, BellRing } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Sample upcoming departures data
const UPCOMING_DEPARTURES = [
  {
    id: 1,
    busNumber: "TS-01-1234",
    destination: "Karimnagar",
    scheduledTime: "17:15",
    status: "onCampus",
    lateBy: null
  },
  {
    id: 2,
    busNumber: "TS-02-5678",
    destination: "Warangal",
    scheduledTime: "16:45",
    status: "onCampus",
    lateBy: 10
  },
  {
    id: 4,
    busNumber: "TS-04-3456",
    destination: "Nizamabad",
    scheduledTime: "16:30",
    status: "onCampus",
    lateBy: 15
  }
];

const UpcomingDepartures = ({ upcomingTripsData }) => {
  const { toast } = useToast();

  const handleSendSmsAlert = (busNumber: string, destination: string) => {
    toast({
      title: "SMS Alert Sent",
      description: `Students notified about the delayed departure of ${busNumber} to ${destination}`,
      variant: "default",
    });
  };

  // Sort departures by time (earliest first)
  const sortedDepartures = [...UPCOMING_DEPARTURES].sort((a, b) => {
    const timeA = new Date(`2000/01/01 ${a.scheduledTime}`).getTime();
    const timeB = new Date(`2000/01/01 ${b.scheduledTime}`).getTime();
    return timeA - timeB;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Departures
        </CardTitle>
        <CardDescription>
          Buses scheduled to depart in the next 60 minutes
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-3">
          {/* {sortedDepartures.map((bus) => ( */}
          {upcomingTripsData.map((bus) => {
            // Get the scheduled departure time and format it
            const scheduledTime = new Date(bus.next_trip.departure_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            // Check for delays
            const lateStop = bus.next_trip.stop_times.find(stop => stop.late_by); // check if any stop has late_by
            const lateBy = lateStop?.late_by;

            return (
              <div key={bus.id} className="flex items-start p-3 rounded-lg hover:bg-muted">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{bus.next_trip.route.end_point}</span>
                    {lateBy && (
                      <span className="inline-flex items-center bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 rounded">
                        Delayed {lateBy}m
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                    <span>{`Bus #${bus.plate_number} (${bus.model})`}</span>
                    <span>•</span>
                    <span>Scheduled: {scheduledTime}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-xs">
                    <span className="inline-flex items-center gap-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Status: {bus.location_status === 'in_campus' ? 'Still on campus' : 'Out of campus'}
                    </span>
                  </div>
                </div>

                {lateBy && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    onClick={() => handleSendSmsAlert(`Bus #${bus.plate_number}`, bus.next_trip.route.end_point)}
                  >
                    <BellRing className="h-4 w-4" />
                    <span className="sr-only">Send SMS Alert</span>
                  </Button>
                )}
              </div>
            );
          })}

        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-start gap-2 w-full bg-muted/50 rounded-md p-3">
          <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Students will receive SMS notifications automatically for buses that depart early or are delayed by
            more than 10 minutes. Click the bell icon to send a manual notification.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UpcomingDepartures;
