import type { DiagramData, DiagramNode } from "./diagramData";

export interface ElkPoint {
  x: number;
  y: number;
}

export interface ElkNodeResult {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface ElkEdgeSection {
  id?: string;
  startPoint?: ElkPoint;
  endPoint?: ElkPoint;
  bendPoints?: ElkPoint[];
}

export interface ElkEdgeResult {
  id: string;
  sections?: ElkEdgeSection[];
}

export interface ElkLayoutResult {
  id: string;
  children?: ElkNodeResult[];
  edges?: ElkEdgeResult[];
  width?: number;
  height?: number;
}

const fixedPositions: Record<string, { x: number; y: number }> = {
  "user-a": { x: 240, y: 80 },
  "user-b": { x: 740, y: 80 },
  rancher: { x: 480, y: 260 },
  "fleet-controller": { x: 240, y: 460 },
  "gorizond-controller": { x: 740, y: 460 },
  "workspace-a": { x: 160, y: 640 },
  "workspace-b": { x: 860, y: 640 },
  "cluster-a1": { x: 100, y: 820 },
  "cluster-a2": { x: 420, y: 820 },
  "cluster-b1": { x: 820, y: 820 },
  "cluster-b2": { x: 1140, y: 820 },
  "iot-a1": { x: 130, y: 1120 },
  "iot-a2": { x: 450, y: 1120 },
  "iot-b1": { x: 850, y: 1120 },
  "iot-b2": { x: 1170, y: 1120 },
};

function findNode(
  nodes: ElkNodeResult[],
  id: string,
): ElkNodeResult | undefined {
  return nodes.find((n) => n.id === id);
}

function computeEdgeSections(
  nodes: ElkNodeResult[],
  data: DiagramData,
): ElkEdgeResult[] {
  return data.edges.map((edge) => {
    const src = findNode(nodes, edge.source);
    const tgt = findNode(nodes, edge.target);
    if (!src || !tgt) {
      return { id: edge.id, sections: [] };
    }

    const srcRightX = (src.x ?? 0) + (src.width ?? 0);
    const srcLeftX = src.x ?? 0;
    const srcCenterX = (src.x ?? 0) + (src.width ?? 0) / 2;
    const srcCenterY = (src.y ?? 0) + (src.height ?? 0) / 2;
    const srcBottomY = (src.y ?? 0) + (src.height ?? 0);

    const tgtLeftX = tgt.x ?? 0;
    const tgtRightX = (tgt.x ?? 0) + (tgt.width ?? 0);
    const tgtCenterX = (tgt.x ?? 0) + (tgt.width ?? 0) / 2;
    const tgtCenterY = (tgt.y ?? 0) + (tgt.height ?? 0) / 2;
    const tgtTopY = tgt.y ?? 0;

    // Users are on the same horizontal lane and feed Rancher from left/right sides.
    if (edge.id === "user-a-rancher" || edge.id === "user-b-rancher") {
      const targetTopX = edge.id === "user-a-rancher" ? tgtLeftX : tgtRightX;
      const targetTopY = tgtTopY;
      const anchorX =
        edge.id === "user-a-rancher" ? tgtLeftX - 16 : tgtRightX + 16;
      const anchorY = targetTopY - 12;
      const section: ElkEdgeSection = {
        startPoint: { x: srcCenterX, y: srcBottomY },
        bendPoints: [
          { x: srcCenterX, y: anchorY },
          { x: anchorX, y: anchorY },
        ],
        endPoint: { x: targetTopX, y: targetTopY },
      };
      return { id: edge.id, sections: [section] };
    }

    // Rancher -> controllers: exit side of Rancher, enter top of controllers.
    if (edge.id === "rancher-fleet") {
      const exitX = srcLeftX;
      const exitY = srcCenterY;
      const bendX = exitX - 60;
      const section: ElkEdgeSection = {
        startPoint: { x: exitX, y: exitY },
        bendPoints: [{ x: bendX, y: tgtTopY - 30 }],
        endPoint: { x: tgtCenterX, y: tgtTopY },
      };
      return { id: edge.id, sections: [section] };
    }
    if (edge.id === "rancher-gorizond") {
      const exitX = srcRightX;
      const exitY = srcCenterY;
      const bendX = exitX + 60;
      const section: ElkEdgeSection = {
        startPoint: { x: exitX, y: exitY },
        bendPoints: [{ x: bendX, y: tgtTopY - 30 }],
        endPoint: { x: tgtCenterX, y: tgtTopY },
      };
      return { id: edge.id, sections: [section] };
    }

    // Fleet controller -> workspace A: straight down from bottom center to top center.
    if (edge.id === "fleet-workspace-a") {
      const section: ElkEdgeSection = {
        startPoint: { x: srcCenterX, y: srcBottomY },
        endPoint: { x: tgtCenterX, y: tgtTopY },
      };
      return { id: edge.id, sections: [section] };
    }

    // Fleet controller -> workspace B: exit from right side, enter workspace from its left.
    if (edge.id === "fleet-workspace-b") {
      const midX = tgtLeftX - 60;
      const section: ElkEdgeSection = {
        startPoint: { x: srcRightX, y: srcCenterY },
        bendPoints: [{ x: midX, y: srcCenterY + 160 }],
        endPoint: { x: tgtLeftX, y: tgtCenterY },
      };
      return { id: edge.id, sections: [section] };
    }

    // Cluster controller -> clusters: exit left for A*, right for B*, keep dashed paths lateral then down.
    if (
      edge.id === "gorizond-cluster-a1" ||
      edge.id === "gorizond-cluster-a2" ||
      edge.id === "gorizond-cluster-b1" ||
      edge.id === "gorizond-cluster-b2"
    ) {
      const isA = edge.id.includes("-a");
      const exitX = isA ? srcLeftX : srcRightX;
      const lateral = isA ? exitX - 120 : exitX + 120;
      const section: ElkEdgeSection = {
        startPoint: { x: exitX, y: srcCenterY },
        bendPoints: [
          { x: lateral, y: srcCenterY },
          { x: lateral, y: tgtTopY - 40 },
        ],
        endPoint: { x: tgtCenterX, y: tgtTopY },
      };
      return { id: edge.id, sections: [section] };
    }

    // Cluster -> IoT should go straight downward from cluster to IoT top.
    if (
      edge.id === "cluster-a1-iot-a1" ||
      edge.id === "cluster-a2-iot-a2" ||
      edge.id === "cluster-b1-iot-b1" ||
      edge.id === "cluster-b2-iot-b2"
    ) {
      const section: ElkEdgeSection = {
        startPoint: { x: srcCenterX, y: srcBottomY },
        endPoint: { x: tgtCenterX, y: tgtTopY },
      };
      return { id: edge.id, sections: [section] };
    }

    const tgtAnchor = { x: tgtLeftX, y: tgtCenterY };
    const midX =
      srcRightX + Math.min(140, Math.max(80, (tgtAnchor.x - srcRightX) * 0.3));

    const section: ElkEdgeSection = {
      startPoint: { x: srcRightX, y: srcCenterY },
      bendPoints: [
        { x: midX, y: srcCenterY },
        { x: midX, y: tgtAnchor.y },
      ],
      endPoint: { x: tgtAnchor.x, y: tgtAnchor.y },
    };

    return { id: edge.id, sections: [section] };
  });
}

export async function buildElkLayout(
  data: DiagramData,
): Promise<ElkLayoutResult> {
  const children: ElkNodeResult[] = data.nodes.map((node) => ({
    id: node.id,
    width: node.width,
    height: node.height,
    x: fixedPositions[node.id]?.x ?? 0,
    y: fixedPositions[node.id]?.y ?? 0,
  }));

  const edges = computeEdgeSections(children, data);

  const width = 1500;
  const height = 1300;

  return { id: "custom", children, edges, width, height };
}
