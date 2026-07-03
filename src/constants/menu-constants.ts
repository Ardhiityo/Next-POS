export const HEADER_TABLE_MENU = [
  "No",
  "Name",
  "Category",
  "Price",
  "Availability",
  "Action",
];

export const INITIAL_CREATE_MENU_FORM = {
  name: "",
  description: "",
  price: 0,
  discount: 0,
  category: "",
  isAvailable: "true",
  image: "",
};

export const MENU_AVAILABILITIES = [
  {
    label: "Available",
    value: "true",
  },
  {
    label: "Not available",
    value: "false",
  },
];

export const MENU_CATEGORIES = [
  {
    label: "Beverages",
    value: "beverages",
  },
  {
    label: "Desserts",
    value: "desserts",
  },
  {
    label: "Mains",
    value: "mains",
  },
  {
    label: "Sides",
    value: "sides",
  },
];
