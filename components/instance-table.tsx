'use client'

import React from 'react'
import { RefreshCw } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Instance {
  id: string
  name: string
  lastUpdated: string
  status: string
  memory: string
  storage: string
  region: string
}

interface InstanceTableProps {
  instances: Instance[]
  selectedInstance: string | null
  handleInstanceSelect: (instance: Instance) => void
  fetchInstanceDetails: (id: string) => void
  pulsingInstanceId: string | null
  statusColors: Record<string, string>
}

export function InstanceTableComponent({
  instances,
  selectedInstance,
  handleInstanceSelect,
  fetchInstanceDetails,
  pulsingInstanceId,
  statusColors
}: InstanceTableProps) {
  return (
    <div className="space-y-2 overflow-y-auto max-h-[400px]">
      <Label htmlFor="instanceSelect">Select Instance</Label>
      {instances && instances.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.map((instance) => (
              <TableRow key={instance.id}>
                <TableCell>
                  <Checkbox
                    className="border-white-100"
                    id={instance.id}
                    checked={selectedInstance === instance.id}
                    onCheckedChange={() => handleInstanceSelect(instance)}
                  />
                </TableCell>
                <TableCell>{instance.id}</TableCell>
                <TableCell className="font-medium text-xs">{instance.name}</TableCell>
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
                  <RefreshCw
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => fetchInstanceDetails(instance.id)}
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
  )
}