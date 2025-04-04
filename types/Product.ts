/**
 * Product option interface
 */
export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

/**
 * Product modifier interface
 */
export interface ProductModifier {
  id: string;
  name: string;
  value: string;
}

/**
 * Product metafield interface
 */
export interface ProductMetafield {
  id: string;
  key: string;
  value: string;
}

/**
 * Product channel interface
 */
export interface ProductChannel {
  id: string;
  name: string;
  enabled: boolean;
}

/**
 * Inventory metafield interface
 */
export interface InventoryMetafield {
  id: string;
  key: string;
  value: string;
}

/**
 * Inventory modifier interface
 */
export interface InventoryModifier {
  id: string;
  name: string;
  value: string;
}

/**
 * Product interface based on the products table schema
 */
export interface Product {
  id: number;
  storeid: string;
  name: string;
  f1: string | null; // image url/ Thumbnail image card
  f2: string | null; // image url/ Thumbnail image card
  f3: string | null; // image url/ Thumbnail image card
  f4: string | null; // image url/ Thumbnail image card
  f5: string | null; // image url/ Thumbnail image card
  type: string | null;
  category: string | null;
  collection: string | null;
  unit: string | null;
  price: number | null;
  stock: number | null;
  vendor: string | null;
  brand: string | null;
  options: ProductOption[] | null;
  modifiers: ProductModifier[] | null;
  metafields: ProductMetafield[] | null;
  channels: ProductChannel[] | null;
  notes: string | null; // Description/notes
}

/**
 * Inventory interface based on the inventory table schema
 */
export interface Inventory {
  id: number;
  product_id: number;
  name: string | null;
  f: string | null; // image url/ Thumbnail image card
  sku: string | null;
  barcode: string | null;
  available: number | null;
  committed: number | null;
  instock: number | null;
  price: number | null;
  compare: number | null;
  cost: number | null;
  metafields: InventoryMetafield[] | null;
  modifiers: InventoryModifier[] | null;
  location: string | null;
}
