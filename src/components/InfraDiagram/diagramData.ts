export type NodeId = string;

export interface DiagramNode {
  id: NodeId;
  label: string;
  width: number;
  height: number;
  imageHref?: string;
  group?: string;
  description?: string;
  lane?: string; // used for lane background grouping
  fill?: string;
  stroke?: string;
}

export interface DiagramEdge {
  id: string;
  source: NodeId;
  target: NodeId;
  label?: string;
  color?: string;
  style?: "solid" | "dashed";
}

export interface DiagramData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

// Example data that mirrors the original static gorizond-problem-map.svg
export const diagramData: DiagramData = {
  nodes: [
    {
      id: "user-a",
      label: "User A",
      width: 150,
      height: 90,
      imageHref: "/img/InfraDiagram/user.svg",
      group: "users",
      lane: "users",
      fill: "#eefaf1",
      stroke: "#2ca24f",
    },
    {
      id: "user-b",
      label: "User B",
      width: 150,
      height: 90,
      imageHref: "/img/InfraDiagram/user.svg",
      group: "users",
      lane: "users",
      fill: "#fff2e8",
      stroke: "#d9781f",
    },
    {
      id: "rancher",
      label: "Rancher UI",
      width: 240,
      height: 120,
      imageHref: "/img/InfraDiagram/rancher.svg",
      group: "control",
      lane: "platform",
    },
    {
      id: "fleet-controller",
      label: "Gorizond Fleet Controller",
      width: 240,
      height: 120,
      imageHref: "/img/logo.svg",
      group: "control",
      lane: "platform",
    },
    {
      id: "gorizond-controller",
      label: "Gorizond Cluster Controller",
      width: 240,
      height: 120,
      imageHref: "/img/logo.svg",
      group: "control",
      lane: "platform",
    },
    {
      id: "workspace-a",
      label: "Fleet Workspace A",
      width: 230,
      height: 110,
      imageHref: "/img/InfraDiagram/fleet.svg",
      group: "workspace-a",
      lane: "workspace-a",
      fill: "#eefaf1",
      stroke: "#2ca24f",
    },
    {
      id: "cluster-a1",
      label: "Gorizond Cluster A1",
      width: 260,
      height: 130,
      imageHref: "/img/InfraDiagram/k3s.svg",
      group: "workspace-a",
      lane: "workspace-a",
    },
    {
      id: "cluster-a2",
      label: "Gorizond Cluster A2",
      width: 260,
      height: 130,
      imageHref: "/img/InfraDiagram/k3s.svg",
      group: "workspace-a",
      lane: "workspace-a",
    },
    {
      id: "workspace-b",
      label: "Fleet Workspace B",
      width: 230,
      height: 110,
      imageHref: "/img/InfraDiagram/fleet.svg",
      group: "workspace-b",
      lane: "workspace-b",
    },
    {
      id: "cluster-b1",
      label: "Gorizond Cluster B1",
      width: 260,
      height: 130,
      imageHref: "/img/InfraDiagram/k3s.svg",
      group: "workspace-b",
      lane: "workspace-b",
    },
    {
      id: "cluster-b2",
      label: "Gorizond Cluster B2",
      width: 260,
      height: 130,
      imageHref: "/img/InfraDiagram/k3s.svg",
      group: "workspace-b",
      lane: "workspace-b",
    },
    {
      id: "iot-a1",
      label: "IoT Cluster A1",
      width: 200,
      height: 100,
      imageHref: "/img/InfraDiagram/iot.svg",
      group: "iot",
      lane: "devices-a",
    },
    {
      id: "iot-a2",
      label: "IoT Cluster A2",
      width: 200,
      height: 100,
      imageHref: "/img/InfraDiagram/iot.svg",
      group: "iot",
      lane: "devices-a",
    },
    {
      id: "iot-b1",
      label: "IoT Cluster B1",
      width: 200,
      height: 100,
      imageHref: "/img/InfraDiagram/iot.svg",
      group: "workspace-b",
      lane: "devices-b",
      fill: "#ffe7d3",
      stroke: "#d9781f",
    },
    {
      id: "iot-b2",
      label: "IoT Cluster B2",
      width: 200,
      height: 100,
      imageHref: "/img/InfraDiagram/iot.svg",
      group: "workspace-b",
      lane: "devices-b",
      fill: "#ffe7d3",
      stroke: "#d9781f",
    },
  ],
  edges: [
    {
      id: "user-a-rancher",
      source: "user-a",
      target: "rancher",
      color: "#2ca24f",
    },
    {
      id: "user-b-rancher",
      source: "user-b",
      target: "rancher",
      color: "#d9781f",
    },
    {
      id: "rancher-fleet",
      source: "rancher",
      target: "fleet-controller",
      color: "#2c7fb8",
    },
    {
      id: "rancher-gorizond",
      source: "rancher",
      target: "gorizond-controller",
      color: "#2c7fb8",
    },
    {
      id: "fleet-workspace-a",
      source: "fleet-controller",
      target: "workspace-a",
      color: "#2ca24f",
    },
    {
      id: "fleet-workspace-b",
      source: "fleet-controller",
      target: "workspace-b",
      color: "#d9781f",
    },
    {
      id: "gorizond-cluster-a1",
      source: "gorizond-controller",
      target: "cluster-a1",
      color: "#2ca24f",
      style: "dashed",
    },
    {
      id: "gorizond-cluster-a2",
      source: "gorizond-controller",
      target: "cluster-a2",
      color: "#2ca24f",
      style: "dashed",
    },
    {
      id: "gorizond-cluster-b1",
      source: "gorizond-controller",
      target: "cluster-b1",
      color: "#d9781f",
      style: "dashed",
    },
    {
      id: "gorizond-cluster-b2",
      source: "gorizond-controller",
      target: "cluster-b2",
      color: "#d9781f",
      style: "dashed",
    },
    {
      id: "cluster-a1-iot-a1",
      source: "cluster-a1",
      target: "iot-a1",
      color: "#2ca24f",
    },
    {
      id: "cluster-a2-iot-a2",
      source: "cluster-a2",
      target: "iot-a2",
      color: "#2ca24f",
    },
    {
      id: "cluster-b1-iot-b1",
      source: "cluster-b1",
      target: "iot-b1",
      color: "#d9781f",
    },
    {
      id: "cluster-b2-iot-b2",
      source: "cluster-b2",
      target: "iot-b2",
      color: "#d9781f",
    },
  ],
};
