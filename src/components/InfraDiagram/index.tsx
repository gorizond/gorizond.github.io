import React, { useEffect, useMemo, useState } from "react";
import styles from "./InfraDiagram.module.css";
import { diagramData, DiagramEdge, DiagramNode } from "./diagramData";
import {
  buildElkLayout,
  ElkEdgeSection,
  ElkLayoutResult,
  ElkNodeResult,
} from "./layout";

const PADDING = 32;

const groupPalette: Record<string, { fill: string; stroke: string }> = {
  users: { fill: "#f4f6f9", stroke: "#2c3e50" },
  control: { fill: "#e8f1fb", stroke: "#2980b9" },
  "workspace-a": { fill: "#eefaf1", stroke: "#2ca24f" },
  "workspace-b": { fill: "#fff6e8", stroke: "#d68910" },
  iot: { fill: "#eef8f1", stroke: "#27ae60" },
};

const laneOrder = [
  "users",
  "platform",
  "workspace-a",
  "workspace-b",
  "devices-a",
  "devices-b",
];

const defaultGroup = { fill: "#f3f4f6", stroke: "#475569" };

const laneStyles: Record<
  string,
  { fill: string; stroke: string; label: string; textColor?: string }
> = {
  users: { fill: "#eceff1", stroke: "#cbd5e1", label: "Rancher Users" },
  platform: {
    fill: "#e6eaf2",
    stroke: "#c7d2fe",
    label: "Rancher & Fleet",
  },
  "workspace-a": {
    fill: "#eefaf1",
    stroke: "#a7f3d0",
    label: "Fleet Workspace A",
  },
  "workspace-b": {
    fill: "#f4eadf",
    stroke: "#f0ab68",
    label: "Fleet Workspace B",
  },
  "devices-a": {
    fill: "#eefaf1",
    stroke: "#a7f3d0",
    label: "User A Devices",
  },
  "devices-b": {
    fill: "#fff2e8",
    stroke: "#f6ad55",
    label: "User B Devices",
  },
};

const nodeMap = new Map<string, DiagramNode>(
  diagramData.nodes.map((n) => [n.id, n]),
);
const edgeMap = new Map<string, DiagramEdge>(
  diagramData.edges.map((e) => [e.id, e]),
);

const buildPathD = (section?: ElkEdgeSection): string => {
  if (!section) return "";
  const points = [
    section.startPoint,
    ...(section.bendPoints ?? []),
    section.endPoint,
  ].filter(Boolean) as { x: number; y: number }[];

  if (!points.length) return "";
  return points
    .map((point, index) => {
      const prefix = index === 0 ? "M" : "L";
      return `${prefix} ${point.x + PADDING} ${point.y + PADDING}`;
    })
    .join(" ");
};

const computeBounds = (layout: ElkLayoutResult | null) => {
  if (!layout) return { width: 400, height: 300 };

  let maxX = 0;
  let maxY = 0;

  layout.children?.forEach((child) => {
    const x = (child.x ?? 0) + (child.width ?? 0);
    const y = (child.y ?? 0) + (child.height ?? 0);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  layout.edges?.forEach((edge) => {
    edge.sections?.forEach((section) => {
      const pts = [
        section.startPoint,
        ...(section.bendPoints ?? []),
        section.endPoint,
      ].filter(Boolean) as { x: number; y: number }[];
      pts.forEach((pt) => {
        maxX = Math.max(maxX, pt.x);
        maxY = Math.max(maxY, pt.y);
      });
    });
  });

  return {
    width: (layout.width ?? maxX) + PADDING * 2,
    height: (layout.height ?? maxY) + PADDING * 2,
  };
};

const computeLaneBoxes = (
  layout: ElkLayoutResult | null,
  nodes: Map<string, DiagramNode>,
) => {
  const boxes: Record<
    string,
    { minX: number; minY: number; maxX: number; maxY: number }
  > = {};

  layout?.children?.forEach((child) => {
    const meta = nodes.get(child.id);
    if (!meta?.lane) return;
    const minX = (child.x ?? 0) + PADDING;
    const minY = (child.y ?? 0) + PADDING;
    const maxX = minX + (child.width ?? meta.width ?? 0);
    const maxY = minY + (child.height ?? meta.height ?? 0);
    const box = boxes[meta.lane] ?? {
      minX,
      minY,
      maxX,
      maxY,
    };
    boxes[meta.lane] = {
      minX: Math.min(box.minX, minX),
      minY: Math.min(box.minY, minY),
      maxX: Math.max(box.maxX, maxX),
      maxY: Math.max(box.maxY, maxY),
    };
  });

  // Ensure platform box covers workspaces and clusters
  const platformNodes = layout?.children?.filter((child) => {
    const meta = nodes.get(child.id);
    return (
      meta &&
      ["platform", "workspace-a", "workspace-b"].includes(meta.lane ?? "")
    );
  });

  if (platformNodes && platformNodes.length) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    platformNodes.forEach((child) => {
      const cx = (child.x ?? 0) + PADDING;
      const cy = (child.y ?? 0) + PADDING;
      const cmaxX = cx + (child.width ?? 0);
      const cmaxY = cy + (child.height ?? 0);
      minX = Math.min(minX, cx);
      minY = Math.min(minY, cy);
      maxX = Math.max(maxX, cmaxX);
      maxY = Math.max(maxY, cmaxY);
    });

    const pad = 40;
    boxes["platform"] = {
      minX: minX - pad,
      minY: minY - pad,
      maxX: maxX + pad,
      maxY: maxY + pad,
    };
  }

  // Align users lane width with platform lane for consistent band sizing.
  if (boxes["platform"] && boxes["users"]) {
    boxes["users"] = {
      minX: boxes["platform"].minX,
      maxX: boxes["platform"].maxX,
      minY: boxes["users"].minY,
      maxY: boxes["users"].maxY,
    };
  }

  return boxes;
};

const InfraDiagram: React.FC = () => {
  const [layout, setLayout] = useState<ElkLayoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [layoutTick, setLayoutTick] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    buildElkLayout(diagramData)
      .then((result) => {
        if (!cancelled) {
          setLayout(result);
        }
      })
      .catch((err) => {
        console.error("ELK layout failed", err);
        if (!cancelled) {
          setError("Не удалось отрисовать диаграмму");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [layoutTick]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(
        () => setLayoutTick((value) => value + 1),
        200,
      );
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  const { width, height } = useMemo(() => computeBounds(layout), [layout]);
  const laneBoxes = useMemo(() => computeLaneBoxes(layout, nodeMap), [layout]);

  if (error) {
    return <div className={styles.errorBox}>{error}</div>;
  }

  if (!layout) {
    return <div className={styles.placeholder}>Loading diagram…</div>;
  }

  const renderNode = (node: ElkNodeResult) => {
    const meta = nodeMap.get(node.id);
    const rectX = (node.x ?? 0) + PADDING;
    const rectY = (node.y ?? 0) + PADDING;
    const width = node.width ?? meta?.width ?? 140;
    const height = node.height ?? meta?.height ?? 70;

    const palette = meta?.group
      ? {
          fill:
            meta.fill ?? groupPalette[meta.group]?.fill ?? defaultGroup.fill,
          stroke:
            meta.stroke ??
            groupPalette[meta.group]?.stroke ??
            defaultGroup.stroke,
        }
      : defaultGroup;
    const isHovered = hoveredNode === node.id;

    const imageSize = Math.min(width, height) / 2.4;
    const imageX = rectX + width / 2 - imageSize / 2;
    const imageY = rectY + 10;

    return (
      <g
        key={node.id}
        className={styles.node}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <rect
          x={rectX}
          y={rectY}
          rx={12}
          ry={12}
          width={width}
          height={height}
          className={styles.nodeRect}
          fill={palette.fill}
          stroke={palette.stroke}
          strokeWidth={isHovered ? 3.5 : 2}
          style={{
            filter: isHovered
              ? "drop-shadow(0 6px 18px rgba(15,23,42,0.15))"
              : "drop-shadow(0 4px 10px rgba(15,23,42,0.08))",
          }}
        />
        {meta?.imageHref && (
          <image
            href={meta.imageHref}
            x={imageX}
            y={imageY}
            width={imageSize}
            height={imageSize}
            preserveAspectRatio="xMidYMid meet"
          />
        )}
        <text
          x={rectX + width / 2}
          y={rectY + height - 14}
          className={styles.nodeLabel}
          textAnchor="middle"
        >
          {meta?.label ?? node.id}
        </text>
      </g>
    );
  };

  const renderEdge = (edgeId: string, section?: ElkEdgeSection) => {
    const meta = edgeMap.get(edgeId);
    const pathD = buildPathD(section);
    if (!pathD) return null;
    const isHovered = hoveredEdge === edgeId;
    const isConnected = hoveredNode
      ? meta?.source === hoveredNode || meta?.target === hoveredNode
      : false;
    const stroke = meta?.color ?? "var(--ifm-color-primary)";

    return (
      <path
        key={edgeId}
        className={styles.edgePath}
        d={pathD}
        markerEnd="url(#arrow-head)"
        stroke={stroke}
        strokeWidth={isHovered || isConnected ? 5 : 3}
        strokeDasharray={meta?.style === "dashed" ? "8 5" : undefined}
        opacity={hoveredEdge && hoveredEdge !== edgeId ? 0.55 : 0.9}
        onMouseEnter={() => setHoveredEdge(edgeId)}
        onMouseLeave={() => setHoveredEdge(null)}
      />
    );
  };

  return (
    <svg
      className={styles.svg}
      role="img"
      aria-label="Gorizond platform diagram"
      viewBox={`0 0 ${Math.ceil(width)} ${Math.ceil(height)}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id="arrow-head"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon points="0 0, 10 5, 0 10" fill="#2c3e50" />
        </marker>
      </defs>

      <g>
        {laneOrder.map((lane) => {
          const box = laneBoxes[lane];
          const style = laneStyles[lane];
          if (!box || !style) return null;
          const lanePaddingMap: Record<string, number> = {
            users: 14,
            platform: 18,
          };
          const padding = lanePaddingMap[lane] ?? 24;
          return (
            <g key={lane}>
              <rect
                x={box.minX - padding}
                y={box.minY - padding}
                width={box.maxX - box.minX + padding * 2}
                height={box.maxY - box.minY + padding * 2}
                rx={14}
                ry={14}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={2}
                opacity={0.8}
              />
              <text
                x={box.minX - padding + 12}
                y={box.minY - padding + 22}
                className={styles.laneLabel}
                fill={style.textColor ?? "#0f172a"}
              >
                {style.label}
              </text>
            </g>
          );
        })}
        {layout.edges?.map((edge) =>
          edge.sections?.map((section, index) => (
            <React.Fragment key={`${edge.id}-${index}`}>
              {renderEdge(edge.id, section)}
            </React.Fragment>
          )),
        )}
        {layout.children?.map((node) => renderNode(node))}
      </g>
    </svg>
  );
};

export default InfraDiagram;
