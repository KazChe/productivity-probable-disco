"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Ban, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Buffer } from "buffer";
import {
  InstanceTableComponent,
  Instance as TableInstance,
} from "./InstanceTable";
import { cn } from "@/lib/utils"; // Make sure you have this utility function
import { Alert, AlertType } from "./Alert";

// Update the existing Instance type to match the one from InstanceTable
type Instance = TableInstance;

type InstancesByTenant = { [key: string]: Instance[] };

const statusColors = {
  running: "text-green-500",
  paused: "text-yellow-500",
  resuming: "text-blue-500",
  pausing: "text-red-500",
};

// Update the AlertType to include a 'variant' property
type AlertType = {
  title: string;
  description: string;
  variant: "default" | "destructive" | "success" | "warning";
} | null;

const getAlertStyle = (variant: AlertType["variant"]) => {
  switch (variant) {
    case "success":
      return "bg-green-100 border-green-400 text-green-700";
    case "destructive":
      return "bg-red-100 border-red-400 text-red-700";
    case "warning":
      return "bg-yellow-100 border-yellow-400 text-yellow-700";
    default:
      return "bg-blue-100 border-blue-400 text-blue-700";
  }
};

export default function InstanceControl() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [action, setAction] = useState<"pause" | "resume">("pause");
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [alertTimeout, setAlertTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedInstanceDetails, setSelectedInstanceDetails] =
    useState<any>(null);
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

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchInstances = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/neo4j-proxy");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInstances(data.instances || []);

      if (data.instances && data.instances.length > 0) {
        await Promise.all(
          data.instances.map((instance) => fetchInstanceDetails(instance.id))
        );
      }
    } catch (error) {
      console.error("Error fetching instances:", error);
      setError("Failed to fetch instances. Please try again.");
      setInstances([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstanceAction = async (
    instance: Instance,
    action: "pause" | "resume"
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/aura-instance-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId: instance.id,
          action: action,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAlert({
        title: "Action Successful",
        description: `Instance ${instance.id} is being ${action}d.`,
        variant: "success",
      });

      setInstances(
        instances.map((i) =>
          i.id === instance.id
            ? {
                ...i,
                status: action === "pause" ? "pausing" : "resuming",
                lastUpdated: new Date().toISOString(),
              }
            : i
        )
      );

      setTimeout(() => fetchInstanceDetails(instance.id), 5000);
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
      console.log("Fetched instance details:", data.data.status);
      setSelectedInstanceDetails(data);

      setInstances((prevInstances) =>
        prevInstances.map((instance) =>
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
      console.error(
        `Error fetching details for instance ${instanceId}:`,
        error
      );
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
    <div className="max-w-100 mx-auto p-6 bg-card rounded-lg bg-gray-800 text-white-100 relative">
      <h1 className="text-2xl font-bold text-center mb-4">
        Neo4j Aura Instance Control
      </h1>

      {alert && <Alert alert={alert} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[500px] overflow-hidden bg-gray-900"> {/* Added bg-gray-900 */}
          <InstanceTableComponent
            instances={instances}
            handleInstanceAction={handleInstanceAction}
            fetchInstanceDetails={fetchInstanceDetails}
            pulsingInstanceId={pulsingInstanceId}
            statusColors={statusColors}
            isLoading={isLoading}
          />
        </div>
        <div>
          <Card className="bg-gray-800 text-white-100">
            <CardHeader>
              <CardTitle>Instance Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedInstanceDetails ? (
                <pre className="text-xs overflow-auto max-h-[300px] p-2 rounded bg-teal-900">
                  {JSON.stringify(selectedInstanceDetails, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground">No instance selected</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
