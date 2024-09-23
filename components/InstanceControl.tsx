"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Ban } from "lucide-react";
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

//TODO save tenant data in a database?
const tenants = [
  {
    id: "aws tenant fireflies 4ee3446990-bb00-343400-bc3b",
    name: "Fireflies Tenant",
  },
  {
    id: "aws tenant dragonfly 5ff4557001-cc11-454511-cd4c",
    name: "Dragonfly Tenant",
  },
];

type Instance = { id: string; status: keyof typeof statusColors };
type InstancesByTenant = { [key: string]: Instance[] };

const instancesByTenant: InstancesByTenant = {
  "aws tenant fireflies 4ee3446990-bb00-343400-bc3b": [
    { id: "0000001A", status: "running" },
    { id: "0000002B", status: "running" },
    { id: "0000003C", status: "paused" },
  ],
  "aws tenant dragonfly 5ff4557001-cc11-454511-cd4c": [
    { id: "0000111B", status: "resuming" },
    { id: "0000222C", status: "running" },
    { id: "0000333D", status: "paused" },
  ],
};

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
  const [tenantId, setTenantId] = useState("");
  const [instances, setInstances] = useState<Instance[]>([]);
  const [instanceId, setInstanceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertType>(null);

  useEffect(() => {
    if (tenantId) {
      setInstances(instancesByTenant[tenantId] || []);
      setInstanceId("");
      setSelectedInstance(null);
    }
  }, [tenantId]);

  const showAlert = (
    title: string,
    description: string,
    variant: "default" | "destructive" | "warning" = "default"
  ) => {
    setAlert({ title, description, variant });
    setTimeout(() => setAlert(null), 5000); // hide alert after 5 seconds
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instanceId) {
      showAlert("Error", "Please select an instance", "destructive");
      return;
    }

    const selectedInstanceData = instances.find(
      (instance) => instance.id === instanceId
    );
    if (!selectedInstanceData) {
      showAlert("Error", "Invalid instance selected", "destructive");
      return;
    }

    if (selectedInstanceData.status === "resuming") {
      showAlert(
        "State Transition Not Allowed",
        "The instance is currently resuming. Please wait for the process to complete.",
        "warning"
      );
      return;
    }

    const action =
      selectedInstanceData.status === "running" ? "pause" : "resume";

    setIsLoading(true);
    setResponse(null);
    try {
      const response = await fetch(
        `https://api.neo4j.io/v1/instances/${instanceId}/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //TODO: authentication headers here - read from dotenv
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data);
      showAlert("Success", `Instance ${instanceId} is now ${action}ing.`);
    } catch (error) {
      console.error("Error:", error);
      showAlert(
        "Error",
        `Failed to ${action} instance. Please try again.`,
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstanceSelect = (instance: Instance) => {
    setSelectedInstance(instance.id === selectedInstance ? null : instance.id);
    setInstanceId(instance.id === selectedInstance ? "" : instance.id);
  };

  const getActionButtonText = (status: string) => {
    switch (status) {
      case "running":
        return "Pause Instance";
      case "paused":
        return "Resume Instance";
      case "resuming":
        return (
          <>
            <Ban className="mr-2 h-4 w-4 text-red-500" />
            Instance Resuming
          </>
        );
      default:
        return "Select Instance";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-card rounded-lg bg-gray-800 text-white-100">
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
            <div className="space-y-2">
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
            </div>
            {tenantId && (
              <div className="space-y-2">
                <Label htmlFor="instanceSelect">Select Instance</Label>
                <div className="space-y-2">
                  {instances.map((instance) => (
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
                        <span
                          className={`font-medium ${
                            statusColors[instance.status]
                          }`}
                        >
                          ({instance.status})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                getActionButtonText(
                  instances.find((i) => i.id === instanceId)?.status || ""
                )
              )}
            </Button>
          </form>
        </div>
        <Card className="bg-gray-800 text-white-100">
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            {response ? (
              <pre className="text-sm overflow-auto max-h-[300px] p-2 bg-muted rounded">
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
