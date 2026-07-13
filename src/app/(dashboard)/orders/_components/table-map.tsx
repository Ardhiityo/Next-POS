import { useMemo } from "react";
import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Table } from "@/generated/prisma/client";

type NodeProps = {
  data: {
    label: string;
    capacity: number;
    status: string;
  };
};

export function TableNode({ data }: NodeProps) {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "rounded-lg h-16 outline-dashed outline-2 outline-offset-2 flex justify-center items-center",
            {
              "w-32": data.capacity >= 1,
              "w-36": data.capacity >= 5,
              "w-44": data.capacity >= 10,
              "outline-green-600": data.status === "available",
              "outline-red-600 animate-pulse": data.status === "unavailable",
              "outline-sky-600 animate-pulse": data.status === "reserved",
            },
          )}
        >
          {data.label}
          {/* */}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="font-semibold">{data.label}</div>
        <div className="text-muted-foreground">Capacity: {data.capacity}</div>
        <div className="text-muted-foreground">
          Status : <span className="capitalize">{data.status}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

const TableMap = ({ tables }: { tables: Table[] | undefined }) => {
  const nodeTypes = {
    tableNode: TableNode,
  };

  const nodes = useMemo(() => {
    return (tables ?? []).map((node) => ({
      id: node.id,
      position: { x: node.positionX, y: node.positionY },
      data: {
        label: node.name,
        table: node.name,
        status: node.status,
        capacity: node.capacity,
      },
      type: "tableNode",
    }));
  }, [tables]);

  const { resolvedTheme } = useTheme();

  return (
    <div className="w-[full] h-[80vh] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        colorMode={(resolvedTheme ?? "system") as "light" | "dark" | "system"}
      />
    </div>
  );
};

export default TableMap;
