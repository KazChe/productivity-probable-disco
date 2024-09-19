import { NextResponse } from "next/server"

export async function GET(req: Request) {
  return NextResponse.json({ message: data })
}

let data = {
  "insertId": "1goozer00yu9",
  "jsonPayload": {
    "message": "Killed process due to java.lang.OutOfMemoryError: Metaspace",
    "_p": "F"
  },
  "resource": {
    "type": "k8s_container",
    "labels": {
      "project_id": "aws-sardar-avacado",
      "pod_name": "kkxo-black-magic-623470909-0",
      "namespace_name": "default",
      "cluster_name": "stooges-barn-007",
      "location": "us-west-100",
      "container_name": "thatonedatabase"
    }
  },
  "timestamp": "2024-09-16T01:13:33.270963206Z",
  "severity": "INFO",
  "labels": {
    "k8s-pod/mode": "primary-mode",
    "k8s-pod/zone": "us-west-2b",
    "k8s-pod/podName": "kkxo-black-magic-623470909",
    "k8s-pod/role": "kkxo-instance",
    "k8s-pod/kkxo-full-version": "4.3.99-rc7",
    "k8s-pod/database-id": "z490p57z",
    "k8s-pod/statefulset.kubernetes.io/pod-name": "kkxo-black-magic-623470909-0",
    "k8s-pod/database-size": "16Gi",
    "k8s-pod/kkxo.io/core-index": "266",
    "k8s-pod/kkxo-major-version": "4",
    "k8s-pod/apps.kubernetes.io/pod-index": "0",
    "k8s-pod/host": "ip-00-000-00-00.us-west-200.compute.internal",
    "k8s-pod/sardar-level": "freeloader",
    "k8s-pod/controller-revision-hash": "kkxo-black-magic-623470909-0000000"
  },
  "logName": "projects/aws-sardar-avacado/logs/stdout",
  "receiveTimestamp": "2024-09-16T01:13:33.627213300Z"
}
