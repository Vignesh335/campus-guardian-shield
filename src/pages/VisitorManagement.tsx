
import { Helmet } from "react-helmet";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VisitorDetectionFlow from "@/components/visitor/VisitorDetectionFlow";
import VisitorEntryLogs from "@/components/visitor/VisitorEntryLogs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, ClipboardList, Users } from "lucide-react";

export default function VisitorManagement() {
  return (
    <>
      <Helmet>
        <title>Visitor Management System - Campus Guardian Shield</title>
        <meta name="description" content="Track and manage campus visitors with facial recognition, approval workflows, and comprehensive audit logs." />
      </Helmet>

      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Visitor Management System</h1>
            <p className="text-muted-foreground">
              Monitor, authorize, and track campus visitors through facial recognition and staff approval.
            </p>
          </div>

          <Tabs defaultValue="detection" className="space-y-4">
            <TabsList>
              <TabsTrigger value="detection" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>Visitor Detection</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>Entry Logs</span>
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Statistics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="detection" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Live Visitor Detection</CardTitle>
                  <CardDescription>
                    Process and authenticate incoming visitors through facial recognition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VisitorDetectionFlow />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Entry Logs</CardTitle>
                  <CardDescription>
                    Complete record of all visitor entries and approvals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VisitorEntryLogs />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Statistics</CardTitle>
                  <CardDescription>
                    Analytics and trends of campus visitor traffic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Visitor statistics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}
