import axios from "axios";

// Use relative path for proxying in production via Nginx
const api = axios.create({
  baseURL: "/api",
});

export const getStores = (lat, lng, max_distance_km) =>
  api.get("/stores", { params: { lat, lng, max_distance_km } }).then((r) => r.data);

export const getBrands = (lat, lng, max_distance_km) =>
  api.get("/brands", { params: { lat, lng, max_distance_km } }).then((r) => r.data);

export const getProducts = (params) =>
  api.get("/products", { params }).then((r) => r.data);
