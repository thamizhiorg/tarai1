/**
 * Product interface based on the products table schema
 */
export interface Product {
  id: number;
  storeid: string;
  name: string;
  f1: string | null;
  f2: string | null;
  f3: string | null;
  f4: string | null;
  f5: string | null;
  type: string | null;
  category: string | null;
  collection: string | null;
  unit: string | null;
  price: number | null;
  stock: number | null;
  vendor: string | null;
  brand: string | null;
  options: any | null;
  modifiers: any | null;
  metafields: any | null;
  channels: any | null;
}

/**
 * Inventory interface based on the inventory table schema
 */
export interface Inventory {
  id: number;
  product_id: number;
  name: string | null;
  f: string | null;
  sku: string | null;
  barcode: string | null;
  available: number | null;
  committed: number | null;
  instock: number | null;
  price: number | null;
  compare: number | null;
  cost: number | null;
  metafields: any | null;
  modifiers: any | null;
  location: string | null;
}
