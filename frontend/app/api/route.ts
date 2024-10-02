import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: data });
}

const data = {
  jsonPayload: {
    message: "Killed process due to java.lang.OutOfMemoryError: Metaspace",
    _p: "F",
  },
  resource: {
    type: "k8s_container",
    labels: {
      project_id: "aws-sardar-avacado",
      pod_name: "kkxo-black-magic-623470909-0",
    },
  },
  timestamp: "2024-09-16T01:13:33.270963206Z",
  severity: "INFO",
  labels: {
    "k8s-pod/kkxo-full-version": "4.3.99-rc7",
    "k8s-pod/database-id": "z490p57z",
  },
  logName: "projects/aws-sardar-avacado/logs/stdout",
  receiveTimestamp: "2024-09-16T01:13:33.627213300Z",
};
