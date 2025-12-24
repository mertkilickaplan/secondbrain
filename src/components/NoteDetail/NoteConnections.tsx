import React from "react";
import { Badge } from "@/components/ui";

interface Edge {
  id: string;
  source: string | { id: string };
  target: string | { id: string };
  similarity: number;
  explanation: string;
}

interface Node {
  id: string;
  title: string;
}

interface NoteConnectionsProps {
  nodeId: string;
  edges: Edge[];
  allNodes: Node[];
  canUseAI: boolean;
}

const NoteConnections: React.FC<NoteConnectionsProps> = ({ nodeId, edges, allNodes, canUseAI }) => {
  // Don't show connections for users without AI access
  if (!canUseAI) {
    return null;
  }

  const relatedEdges = edges.filter((e) => e.source === nodeId || e.target === nodeId);

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-2">
        Connections
        <Badge variant="default" size="sm">
          {relatedEdges.length}
        </Badge>
      </h3>

      <div className="space-y-3">
        {relatedEdges.length === 0 ? (
          <p className="text-xs text-muted-foreground">No connections yet.</p>
        ) : (
          relatedEdges.map((edge) => {
            const isSource = edge.source === nodeId;
            const otherId = isSource ? edge.target : edge.source;
            // Note: react-force-graph transforms source/target to objects, so handle both ID or object
            const otherIdString = typeof otherId === "object" ? otherId.id : otherId;

            const otherNode = allNodes.find((n) => n.id === otherIdString);
            if (!otherNode) return null;

            return (
              <div
                key={edge.id}
                className="group border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
              >
                <div className="font-medium text-sm mb-1">{otherNode.title}</div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {edge.explanation}
                </p>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground/50">
                  <span>Similarity: {Math.round(edge.similarity * 100)}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NoteConnections;
