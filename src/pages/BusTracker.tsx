
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import BusTrackerHeader from "@/components/bus/BusTrackerHeader";
import BusEntryLogging from "@/components/bus/BusEntryLogging";
import BusDetailsDashboard from "@/components/bus/BusDetailsDashboard";
import UpcomingDepartures from "@/components/bus/UpcomingDepartures";
import ExportTools from "@/components/bus/ExportTools";
import { Helmet } from "react-helmet";
import axios from "axios";
import { API_BASE_URL } from "@/components/Constants";

const BusTracker = () => {

  const [busesData, setBusesData] = useState([])
  const [destinationsData, setDestinationsData] = useState([])
  const [upcomingTripsData, setUpcomingTripsData] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bus_tracker/buses/`);
        const response1 = await axios.get(`${API_BASE_URL}/bus_tracker/routes/`);
        setBusesData(response.data)
        setDestinationsData(response1.data.map((record) => record.end_point))
      } catch (error) {
        console.error('Error fetching faculty:', error.response?.data || error.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (busesData.length > 0) {
      const now = new Date();
      const nextHour = new Date(now.getTime() + 605678 * 60 * 1000); // 60 minutes

      const filteredTrips = busesData.filter(bus => {
        if (bus.next_trip && bus.next_trip.departure_time) {
          const departureTime = new Date(bus.next_trip.departure_time);
          return departureTime >= now && departureTime <= nextHour;
        }
        return false;
      });

      setUpcomingTripsData(filteredTrips);
    }
  }, [busesData]);

  return (
    <Layout>
      <Helmet>
        <title>Bus Entry/Exit Tracker - Campus Guardian</title>
        <meta
          name="description"
          content="Track campus transportation in real-time with GPS and automated license plate recognition."
        />
      </Helmet>

      <div className="space-y-8">
        <BusTrackerHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BusEntryLogging />
            <BusDetailsDashboard destinationsData={destinationsData} busesData={busesData} />
          </div>
          <div className="space-y-6">
            <UpcomingDepartures upcomingTripsData={upcomingTripsData} />
            <ExportTools />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusTracker;
