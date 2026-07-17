"use client"

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { applyNodeChanges, NodeChange, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Order, Table } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DialogCreateOrderDineIn from "./dialog-create-order-dine-in";
import { useMutation } from "@tanstack/react-query";
import { UpdateOrder } from "@/types/order";
import { updateOrder } from "@/actions/order/update-order";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { updateTablePosition } from "@/actions/table/update-table-position";
import { UserContext } from "@/context/user-context";
import { Role } from "@/constants/user-constant";

type NodeProps = {
  data: {
    label: string;
    capacity: number;
    status: string;
    tableId: string;
    order: {
      id: string;
      orderId: string;
      customerName: string;
      status: string;
      paymentToken: string | null;
      createdAt: Date;
      tableId: string | null;
    } | undefined
    refetch: () => void
  };
};

type TableMapProps = {
  tables: Table[] | undefined,
  orders: Order[] | undefined,
  refetch: () => void
}

type Node = NodeChange<{
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    tableId: string;
    status: string;
    capacity: number;
    order: {
      id: string;
      status: string;
      createdAt: Date;
      orderId: string;
      customerName: string;
      paymentToken: string | null;
      tableId: string | null;
    } | undefined;
    refetch: () => void;
  };
  type: string;
}>[];

export function TableNode(props: NodeProps) {
  const [open, setOpen] = useState(false);
  const { data } = props;
  const user = useContext(UserContext);
  const [isPendingProcess, setIsPendingProcess] = useState(false);
  const [isPendingCancelled, setIsPendingCancelled] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ["update-order"],
    mutationFn: async ({ order, status }: UpdateOrder) => {
      const response = await updateOrder({ order, status });
      if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        data.refetch();
        toast.success("Order updated successfully");
      }
    },
    onSettled: () => {
      setIsPendingCancelled(false);
      setIsPendingProcess(false);
    }
  });

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
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="font-semibold">{data.label}</div>
        <div className="text-muted-foreground">Capacity : {data.capacity}</div>
        <div className="text-muted-foreground">
          Status : <span className="capitalize">{data.status}</span>
        </div>
        {data.order && (
          data.order.status === 'reserved' && user?.role != Role.KITCHEN ? (
            <>
              <div className="text-muted-foreground">Order Id : {data.order.orderId}</div>
              <div className="text-muted-foreground">Customer : {data.order.customerName}</div>
              <div className="flex gap-2 mt-2">
                <Button variant="destructive" className="flex-1"
                  disabled={isPendingCancelled}
                  onClick={() => {
                    setIsPendingCancelled(true)
                    mutate({ order: data.order!, status: 'cancelled' })
                  }}>
                  {isPendingCancelled ? <Loader2Icon className="animate-spin" /> : 'Cancel'}
                </Button>
                <Button className="flex-1"
                  disabled={isPendingProcess}
                  onClick={() => {
                    setIsPendingProcess(true)
                    mutate({ order: data.order!, status: 'process' })
                  }}>
                  {isPendingProcess ? <Loader2Icon className="animate-spin" /> : 'Process'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-muted-foreground">Order Id : {data.order.orderId}</div>
              <div className="text-muted-foreground">Customer : {data.order.customerName}</div>
              <Button asChild className="mt-2">
                <Link href={`/orders/${data.order.orderId}`}>View Order Detail</Link>
              </Button>
            </>
          )
        )}
        {!data.order && user?.role != Role.KITCHEN && (
          <>
            <Button className="w-full mt-2" onClick={() => setOpen(true)}>Create Order</Button>
            <DialogCreateOrderDineIn
              refetch={data.refetch}
              open={open}
              setOpen={setOpen}
              table={open ? { id: data.tableId, name: data.label } : null}
            />
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

const TableMap = (props: TableMapProps) => {
  const { tables, orders, refetch } = props
  const { resolvedTheme } = useTheme();

  const nodeTypes = {
    tableNode: TableNode,
  };

  const initialNodes = useMemo(() => {
    return (tables ?? []).map((table) => ({
      id: table.id,
      position: { x: table.positionX, y: table.positionY },
      data: {
        label: table.name,
        tableId: table.id,
        status: table.status,
        capacity: table.capacity,
        order: orders?.find(order => order.tableId === table.id),
        refetch,
      },
      type: "tableNode",
    }));
  }, [tables, orders, refetch]);

  const { mutate: updateTable } = useMutation({
    mutationKey: ["update-order"],
    mutationFn: async ({ tableId, positionX, positionY }: { tableId: string, positionX: number, positionY: number }) => {
      const response = await updateTablePosition({ tableId, positionX, positionY });
      if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Table position updated successfully");
      }
      return response;
    },
  });

  const [nodes, setNodes] = useState(initialNodes);

  useEffect(() => {
    setNodes(initialNodes);
  }, [tables, initialNodes])

  const onNodesChange = useCallback(
    (changes: Node) => {
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot))
      changes.forEach((change) => {
        if (change.type === 'position' && change?.dragging === false) {
          if (change.position?.x && change.position.y) {
            updateTable({ tableId: change.id, positionX: change?.position.x, positionY: change?.position.y })
          }
        }
      });
    },
    [updateTable],
  );

  return (
    <div className="w-[full] h-[80vh] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        proOptions={{ hideAttribution: true }}
        colorMode={(resolvedTheme ?? "system") as "light" | "dark" | "system"}
      />
    </div>
  );
};

export default TableMap;
