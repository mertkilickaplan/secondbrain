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

    // Color mapping based on status
    const nodeColor = useCallback((node: any) => {
        if (node.status === "processing") return "#9ca3af"; // Gray-400
        if (node.status === "error") return "#ef4444"; // Red-500
        if (node.id === hoveredNode) return "#a78bfa"; // Lighter violet on hover
        return "#8b5cf6"; // Violet-500
    }, [hoveredNode]);

    // Edge color - highlight connected edges on hover
    const linkColor = useCallback((link: any) => {
        const sourceId = typeof link.source === "object" ? link.source.id : link.source;
        const targetId = typeof link.target === "object" ? link.target.id : link.target;

        if (hoveredNode && (sourceId === hoveredNode || targetId === hoveredNode)) {
            return "rgba(139, 92, 246, 0.8)"; // Brighter on hover
        }
        return "rgba(139, 92, 246, 0.3)";
    }, [hoveredNode]);

    // Edge width based on similarity
    const linkWidth = useCallback((link: any) => {
        const baseWidth = (link.similarity || 0.5) * 3; // 0-3 range
        const sourceId = typeof link.source === "object" ? link.source.id : link.source;
        const targetId = typeof link.target === "object" ? link.target.id : link.target;

        if (hoveredNode && (sourceId === hoveredNode || targetId === hoveredNode)) {
            return baseWidth + 1; // Thicker on hover
        }
        return Math.max(0.5, baseWidth);
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
                nodeLabel={(node: any) => {
                    let label = node.title || "Untitled";
                    if (node.status === "processing") label += " (...)";
                    if (node.status === "error") label += " (!)";
                    return label;
                }}
                nodeColor={nodeColor}
                nodeRelSize={6}
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

