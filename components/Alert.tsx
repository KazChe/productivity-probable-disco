import React from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertType = {
  title: string;
  description: string;
  variant: "default" | "failure" | "success" | "warning";
};

const getAlertStyle = (variant: AlertType["variant"]) => {
  switch (variant) {
    case "success":
      return "bg-green-100 border-green-400 text-green-700";
    case "failure":
      return "bg-red-100 border-red-400 text-red-700";
    case "warning":
      return "bg-yellow-100 border-yellow-400 text-yellow-700";
    default:
      return "bg-blue-100 border-blue-400 text-blue-700";
  }
};

const getIcon = (variant: AlertType["variant"]) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-5 w-5" />;
    case "failure":
      return <XCircle className="h-5 w-5" />;
    case "warning":
      return <AlertCircle className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

interface AlertProps {
  alert: AlertType;
}

export const Alert: React.FC<AlertProps> = ({ alert }) => {
  return (
    <div className="fixed top-4 left-1/5 z-50 max-w-sm w-full">
      <div
        className={cn("border-l-4 p-4 rounded-r", getAlertStyle(alert.variant))}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">{getIcon(alert.variant)}</div>
          <div>
            <p className="font-bold">{alert.title}</p>
            <p className="text-sm">{alert.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};