"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
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
    // Color mapping based on status
    const nodeColor = (node: any) => {
        if (node.status === "processing") return "#9ca3af"; // Gray-400
        if (node.status === "error") return "#ef4444"; // Red-500
        return "#8b5cf6"; // Violet-500
    };

    const myData = useMemo(() => {
        // Clone to avoid mutation by the graph library
        return {
            nodes: data.nodes.map(n => ({ ...n })),
            links: data.links.map(l => ({ ...l }))
        }
    }, [data]);

    return (
        <div className="w-full h-full bg-background">
            <ForceGraph2D
                graphData={myData}
                nodeLabel={(node: any) => {
                    let label = node.title || "Untitled";
                    if (node.status === "processing") label += " (...)";
                    if (node.status === "error") label += " (!)";
                    return label;
                }}
                nodeColor={nodeColor}
                nodeRelSize={6}
                linkColor={() => "rgba(139, 92, 246, 0.3)"} // Primary color with opacity
                backgroundColor="rgba(0,0,0,0)" // Transparent to let parent bg show
                onNodeClick={onNodeClick}
                d3VelocityDecay={0.1} // Simulates friction
                cooldownTicks={100}
                onEngineStop={() => { }} // Optional: do something when stable
            />
        </div>
    );
}
