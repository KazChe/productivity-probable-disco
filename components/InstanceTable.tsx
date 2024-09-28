"use client";

import React, { useState } from "react";
import { RefreshCw, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Instance {
  id: string;
  name: string;
  lastUpdated: string;
  status: string;
  memory: string;
  storage: string;
  region: string;
}

interface InstanceActionProps {
  instance: Instance;
  handleInstanceAction: (instance: Instance, action: "pause" | "resume") => void;
  fetchInstanceDetails: (id: string) => void;
}

// New component for instance actions
const InstanceActions: React.FC<InstanceActionProps> = React.memo(({ instance, handleInstanceAction, fetchInstanceDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAction = async (action: "pause" | "resume") => {
    setIsLoading(true);
    await handleInstanceAction(instance, action);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchInstanceDetails(instance.id);
    setTimeout(() => setIsRefreshing(false), 1000); // Keep spinning for 1 second after fetch
  };

  return (
    <div className="flex space-x-1"> {/* Reduced space between buttons */}
      <Button
        size="xs" // Changed from "sm" to "xs"
        variant="outline"
        onClick={() => handleAction(instance.status === "running" ? "pause" : "resume")}
        disabled={isLoading || ["resuming", "pausing"].includes(instance.status)}
        className="p-1" // Added padding to make the button slightly larger than the icon
      >
        {instance.status === "running" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
      </Button>
      <Button
        size="xs" // Changed from "sm" to "xs"
        variant="outline"
        onClick={handleRefresh}
        disabled={isLoading}
        className="p-1" // Added padding to make the button slightly larger than the icon
      >
        <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
});

InstanceActions.displayName = 'InstanceActions';

interface InstanceTableProps {
  instances: Instance[];
  handleInstanceAction: (instance: Instance, action: "pause" | "resume") => void;
  fetchInstanceDetails: (id: string) => void;
  pulsingInstanceId: string | null;
  statusColors: Record<string, string>;
}

export function InstanceTableComponent({
  instances,
  handleInstanceAction,
  fetchInstanceDetails,
  pulsingInstanceId,
  statusColors,
}: InstanceTableProps) {
  return (
    <div className="space-y-2 overflow-y-auto max-h-[400px]">
      <Label htmlFor="instanceSelect">Instances</Label>
      {instances && instances.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.map((instance) => (
              <TableRow key={instance.id}>
                <TableCell>{instance.id}</TableCell>
                <TableCell className="font-medium text-xs">
                  {instance.name}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-medium transition-all duration-300 ${
                      pulsingInstanceId === instance.id
                        ? "text-teal-400 scale-110"
                        : "text-white"
                    }`}
                  >
                    {instance.lastUpdated || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      statusColors[instance.status] || ""
                    }`}
                  >
                    {instance.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-gray-400">
                  {instance.memory} | {instance.storage} | {instance.region}
                </TableCell>
                <TableCell>
                  <InstanceActions
                    instance={instance}
                    handleInstanceAction={handleInstanceAction}
                    fetchInstanceDetails={fetchInstanceDetails}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Loading instances...</p>
      )}
    </div>
  );
}
