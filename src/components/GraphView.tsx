"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useCallback, useState } from "react";

// Dynamic import for NoSSR
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

interface GraphData {
    nodes: any[];
    links: any[];
}

interface GraphViewProps {
    data: GraphData;
    onNodeClick: (node: any) => void;
}

export default function GraphView({ data, onNodeClick }: GraphViewProps) {
    const graphRef = useRef<any>(null);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    // Custom node rendering - minimalist with icons
    const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.title || "Untitled";
        const fontSize = 12 / globalScale;
        const nodeRadius = 6;

        // Determine colors based on status
        let nodeColor = "#8b5cf6"; // Violet-500

        if (node.status === "processing") {
            nodeColor = "#9ca3af";
        } else if (node.status === "error") {
            nodeColor = "#ef4444";
        } else if (node.id === hoveredNode) {
            nodeColor = "#a78bfa";
        }

        // Draw main node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Draw subtle border
        ctx.strokeStyle = node.id === hoveredNode ? "#ffffff" : "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1 / globalScale;
        ctx.stroke();

        // Draw small icon
        ctx.fillStyle = "#ffffff";
        ctx.font = `${8 / globalScale}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const icon = node.type === "url" ? "🔗" : "📝";
        ctx.fillText(icon, node.x, node.y);

        // Draw label (always visible but subtle)
        ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const labelY = node.y + nodeRadius + fontSize + 4 / globalScale;

        // Draw label text
        ctx.fillStyle = node.id === hoveredNode ? "#ffffff" : "rgba(255, 255, 255, 0.7)";
        ctx.fillText(label, node.x, labelY);

        // Status indicator (minimal)
        if (node.status === "processing") {
            ctx.fillStyle = "#fbbf24";
            ctx.fillText("•", node.x + ctx.measureText(label).width / 2 + 6 / globalScale, labelY);
        } else if (node.status === "error") {
            ctx.fillStyle = "#ef4444";
            ctx.fillText("•", node.x + ctx.measureText(label).width / 2 + 6 / globalScale, labelY);
        }
    }, [hoveredNode]);

    // Edge color - subtle and clean
    const linkColor = useCallback((link: any) => {
        const sourceId = typeof link.source === "object" ? link.source.id : link.source;
        const targetId = typeof link.target === "object" ? link.target.id : link.target;

        if (hoveredNode && (sourceId === hoveredNode || targetId === hoveredNode)) {
            return "rgba(139, 92, 246, 0.6)";
        }
        return "rgba(139, 92, 246, 0.2)";
    }, [hoveredNode]);

    // Edge width based on similarity
    const linkWidth = useCallback((link: any) => {
        const baseWidth = (link.similarity || 0.5) * 2;
        const sourceId = typeof link.source === "object" ? link.source.id : link.source;
        const targetId = typeof link.target === "object" ? link.target.id : link.target;

        if (hoveredNode && (sourceId === hoveredNode || targetId === hoveredNode)) {
            return baseWidth + 0.5;
        }
        return Math.max(0.3, baseWidth);
    }, [hoveredNode]);

    const myData = useMemo(() => {
        return {
            nodes: data.nodes.map(n => ({ ...n })),
            links: data.links.map(l => ({ ...l }))
        }
    }, [data]);

    const handleZoomIn = () => {
        if (graphRef.current) {
            const currentZoom = graphRef.current.zoom();
            graphRef.current.zoom(currentZoom * 1.5, 300);
        }
    };

    const handleZoomOut = () => {
        if (graphRef.current) {
            const currentZoom = graphRef.current.zoom();
            graphRef.current.zoom(currentZoom / 1.5, 300);
        }
    };

    const handleCenter = () => {
        if (graphRef.current) {
            graphRef.current.zoomToFit(400);
        }
    };

    return (
        <div className="w-full h-full bg-background relative">
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
                <button
                    onClick={handleZoomIn}
                    className="p-2 bg-card/80 backdrop-blur-md border border-border rounded-lg hover:bg-muted transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center text-lg"
                    aria-label="Zoom in"
                >
                    +
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-2 bg-card/80 backdrop-blur-md border border-border rounded-lg hover:bg-muted transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center text-lg"
                    aria-label="Zoom out"
                >
                    −
                </button>
                <button
                    onClick={handleCenter}
                    className="p-2 bg-card/80 backdrop-blur-md border border-border rounded-lg hover:bg-muted transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center text-xs"
                    aria-label="Center view"
                >
                    ⌖
                </button>
            </div>

            <ForceGraph2D
                ref={graphRef}
                graphData={myData}
                nodeCanvasObject={nodeCanvasObject}
                nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
                    ctx.fill();
                }}
                linkColor={linkColor}
                linkWidth={linkWidth}
                linkDirectionalParticles={0}
                backgroundColor="rgba(0,0,0,0)"
                onNodeClick={onNodeClick}
                onNodeHover={(node: any) => setHoveredNode(node?.id || null)}
                d3VelocityDecay={0.15}
                cooldownTicks={100}
                enableNodeDrag={true}
                enableZoomInteraction={true}
                enablePanInteraction={true}
            />
        </div>
    );
}

