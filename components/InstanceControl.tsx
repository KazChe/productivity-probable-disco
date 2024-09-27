"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Ban, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Buffer } from "buffer";

type Instance = {
  lastUpdated: string;
  cdc_enrichment_mode: string;
  cloud_provider: string;
  connection_url: string | null;
  id: string;
  memory: string;
  metrics_integration_url: string;
  name: string;
  region: string;
  secondaries_count: number;
  status: string;
  storage: string;
  tenant_id: string;
  type: string;
};

type InstancesByTenant = { [key: string]: Instance[] };

const statusColors = {
  running: "text-green-500",
  paused: "text-yellow-500",
  resuming: "text-blue-500",
};

// Update the AlertType to include "warning"
type AlertType = {
  title: string;
  description: string;
  variant: "default" | "destructive" | "warning";
} | null;

export default function InstanceControl() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [action, setAction] = useState<"pause" | "resume">("pause");
  const [alert, setAlert] = useState<AlertType>(null);
  const [selectedInstanceDetails, setSelectedInstanceDetails] =
    useState<any>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [pulsingInstanceId, setPulsingInstanceId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchInstances();
  }, []);

  useEffect(() => {
    if (pulsingInstanceId) {
      const timer = setTimeout(() => {
        setPulsingInstanceId(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pulsingInstanceId]);

  const fetchInstances = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/neo4j-proxy");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      //   console.log("Data received:", data);

      setInstances(data.instances || []);
    } catch (error) {
      console.error("Error fetching instances:", error);
      setError("Failed to fetch instances. Please try again.");
      setInstances([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!selectedInstance) {
      setAlert({
        title: "Invalid Selection",
        description: "Please select an instance.",
        variant: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/aura-instance-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId: selectedInstance,
          action: action, // Use the current action state
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data);
      setAlert({
        title: "Action Successful",
        description: `Instance ${selectedInstance} is being ${action}d.`,
        variant: "default",
      });
      // Optionally, refresh the instances list after action
      //   fetchInstances();
      setInstances(
        instances.map((instance) =>
          instance.id === instanceId
            ? {
                ...instance,
                status: data.data.status,
                lastUpdated: new Date().toISOString(),
              }
            : instance
        )
      );
    } catch (error) {
      console.error("Error performing action:", error);
      setAlert({
        title: "Action Failed",
        description: `Failed to ${action} the instance. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [tenantId, setTenantId] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [selectedInstance, setSelectedInstance] = useState("");
  const [response, setResponse] = useState(null);

  const handleInstanceSelect = (instance: Instance) => {
    setSelectedInstance(instance.id);
    setInstanceId(instance.id);
    // Set the action based on the current status of the instance
    setAction(instance.status === "running" ? "pause" : "resume");
  };

  const getActionButtonText = (instanceId: string) => {
    const instance = Array.isArray(instances)
      ? instances.find((i) => i.id === instanceId)
      : null;

    if (!instance) return "Select an Instance";

    switch (instance.status) {
      case "running":
        return "Pause Instance";
      case "paused":
        return "Resume Instance";
      default:
        return "Select an Instance";
    }
  };

  const fetchInstanceDetails = async (instanceId: string) => {
    setIsLoading(true);
    setPulsingInstanceId(instanceId);
    try {
      const response = await fetch(
        `/api/aura-instance-details?instanceId=${instanceId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched instance details:", data.data.status); // Add this line
      setSelectedInstanceDetails(data);

      setInstances(
        instances.map((instance) =>
          instance.id === instanceId
            ? {
                ...instance,
                status: data.data.status,
                lastUpdated: new Date().toISOString(),
              }
            : instance
        )
      );
    } catch (error) {
      console.error("Error fetching instance details:", error);
      setAlert({
        title: "Fetch Failed",
        description: "Failed to fetch instance details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-100 mx-auto p-6 bg-card rounded-lg bg-gray-800 text-white-100">
      <h1 className="text-2xl font-bold text-center mb-4">
        Neo4j Aura Instance Control
      </h1>
      {alert && (
        <Alert variant={alert.variant} className="mb-4">
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <div className="space-y-2">
              <Label htmlFor="tenantSelect">Select Tenant ID</Label>
              <Select value={tenantId} onValueChange={setTenantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            {/* {tenantId && ( we will need to add this back in) */}
            <div className="space-y-2">
              <Label htmlFor="instanceSelect">Select Instance</Label>
              <div className="space-y-2">
                {instances && instances.length > 0 ? (
                  instances.map((instance) => (
                    <div
                      key={instance.id}
                      className="flex items-center space-x-2 border-b border-gray-700 pb-2"
                    >
                      <Checkbox
                        className="border-white-100"
                        id={instance.id}
                        checked={selectedInstance === instance.id}
                        onCheckedChange={() => handleInstanceSelect(instance)}
                      />
                      <Label
                        htmlFor={instance.id}
                        className="flex items-center space-x-2"
                      >
                        <span>{instance.id}</span>
                        <span className="font-medium">({instance.name})</span>
                        <span
                          className={`text-sm font-medium transition-all duration-300 ${
                            pulsingInstanceId === instance.id
                              ? "text-blue-400 scale-110"
                              : "text-white"
                          }`}
                        >
                          updated: {instance.lastUpdated || "N/A"}
                        </span>
                        <span
                          className={`font-medium ${
                            statusColors[instance.status] || ""
                          }`}
                        >
                          {instance.status}
                        </span>
                        <span className="text-sm text-gray-400">
                          {instance.memory} | {instance.storage} |{" "}
                          {instance.region}
                        </span>
                        <RefreshCw
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => fetchInstanceDetails(instance.id)}
                        />
                      </Label>
                    </div>
                  ))
                ) : (
                  <p>Loading instances...</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instanceId">Instance ID</Label>
              <Input
                id="instanceId"
                value={instanceId}
                readOnly
                className="bg-gray-700"
                placeholder="Selected instance ID will appear here"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                !instanceId ||
                instances.find((i) => i.id === instanceId)?.status ===
                  "resuming"
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                getActionButtonText(instanceId)
              )}
            </Button>
          </form>
        </div>
        <Card className="bg-gray-800 text-white-100 ">
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedInstanceDetails ? (
              <pre className="text-sm overflow-auto max-h-[300px] p-2 rounded">
                {JSON.stringify(selectedInstanceDetails, null, 2)}
              </pre>
            ) : response ? (
              <pre className="text-sm overflow-auto max-h-[300px] p-2 rounded">
                {JSON.stringify(response, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">No response yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
