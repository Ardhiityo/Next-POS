export const HEADER_TABLE_ORDER = [
  "No",
  "Order id",
  "Customer name",
  "Table",
  "Status",
  "Action",
];

export const INITIAL_CREATE_ORDER_FORM = {
  customerName: "",
  tableId: "",
  status: "",
};

export const STATUS_ORDER_CREATE = [
  {
    label: "Process",
    value: "processed",
  },
  {
    label: "Reserved",
    value: "reserved",
  },
];
