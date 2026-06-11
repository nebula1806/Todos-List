import { address } from "./address"

export const defaultUserData = {
  name: "Rahul Developer",
  email: "rahul.dev@example.com",
  phone: "+91 9876543210",
  billingAddress: {
    ...address,
    line1: "Flat 404, React Residency",
    line2: "JavaScript Avenue, Tech Park",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411001",
  },
  shippingAddress: {
    ...address,
    line1: "Ramdas Chowk",
    line2: "Near Elpro Mall",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411001",
  },
};

export const blankUser = {
  name: "",
  email: "",
  phone: "",
  billingAddress: { ...address },
  shippingAddress: { ...address },
};
