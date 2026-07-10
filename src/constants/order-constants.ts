export const HEADER_TABLE_ORDER = [
  "No",
  "Order id",
  "Customer name",
  "Table",
  "Status",
  "Action",
];

export const INITIAL_CREATE_ORDER_DINE_IN_FORM = {
  customerName: "",
  tableId: "",
  status: "",
};

export const INITIAL_CREATE_ORDER_TAKEAWAY_FORM = {
  customerName: "",
};

export const STATUS_ORDER_CREATE = [
  {
    label: "Process",
    value: "process",
  },
  {
    label: "Reserved",
    value: "reserved",
  },
];
