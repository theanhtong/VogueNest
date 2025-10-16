import { products } from "./mock/products.js";
import { users } from "./mock/users.js";

const read = (name) => {
  try {
    const raw = localStorage.getItem(name);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const write = (name, data) => localStorage.setItem(name, JSON.stringify(data));

const ensureId = (items) =>
  items.map((it, idx) => ({ ...it, id: typeof it.id === "number" ? it.id : idx + 1 }));

const localBackend = {
  init(force = false) {
    if (force || !read("users")) write("users", ensureId(users));
    if (force || !read("products")) write("products", ensureId(products));
  },

  getAll(collection) {
    const data = read(collection);
    return Array.isArray(data) ? data : [];
  },

  getById(collection, id) {
    return this.getAll(collection).find((it) => it.id === id) || null;
  },

  create(collection, payload) {
    const items = this.getAll(collection);
    const id = items.reduce((m, i) => Math.max(m, i.id || 0), 0) + 1;
    const item = { ...payload, id };
    items.push(item);
    write(collection, items);
    return item;
  },

  update(collection, id, patch) {
    const items = this.getAll(collection);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...patch };
    write(collection, items);
    return items[idx];
  },

  remove(collection, id) {
    const items = this.getAll(collection).filter((i) => i.id !== id);
    write(collection, items);
    return true;
  },

  resetAll() {
    this.init(true);
  },

  dump() {
    return {
      products: read("products"),
      users: read("users"),
    };
  },
};

export default localBackend;
