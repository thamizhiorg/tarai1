import { Product, Inventory } from '@/types/Product';
// Using the built-in fetch API instead of node-fetch

const TURSO_API_URL = 'https://tar-tarframework.aws-eu-west-1.turso.io/v2/pipeline';
const TURSO_API_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDM1MDY1OTIsImlkIjoiYjI1ODNhYTctNTQwOS00OTAyLWIxMWUtMzBkZjk5N2Q0NjIzIiwicmlkIjoiZmEwOWEwOWUtMTk3YS00M2M0LThmMDUtOTlmZTk0ZDhiZThkIn0.sKQEQR4b34LIs6pVW791zI7havvVEoKk9jHk1AvrOvr6OntKqyLGv85ZjRdeX4naSChv_ggGIbHNJgzMYxcxAA';

/**
 * Execute a SQL query against the Turso database
 */
async function executeQuery(sql: string): Promise<any> {
  try {
    const response = await fetch(TURSO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TURSO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql
            }
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    // Check if we have results
    if (!data || !data.results || !data.results[0] || data.results[0].type !== 'ok') {
      throw new Error('Invalid API response structure');
    }

    // Return the result part of the response
    return data.results[0].response.result;
  } catch (error) {
    console.error('Error executing Turso query:', error);
    throw error;
  }
}

/**
 * Fetch all products from the database
 */
export async function fetchProducts(): Promise<Product[]> {
  const result = await executeQuery('SELECT * FROM products');

  if (!result || !result.rows || !Array.isArray(result.rows)) {
    console.error('Invalid result structure:', result);
    return [];
  }

  return result.rows.map((rowArray: any[]) => {
    // Each row is an array of column values with type information
    // Convert to an object for easier handling
    const row: Record<string, any> = {};

    // Map column values to object properties
    if (result.cols && Array.isArray(result.cols)) {
      result.cols.forEach((col, index) => {
        const colValue = rowArray[index];
        if (colValue && colValue.type !== 'null') {
          row[col.name] = colValue.value;
        } else {
          row[col.name] = null;
        }
      });
    }

    // Convert JSON strings to objects
    const options = row.options ? JSON.parse(row.options) : null;
    const modifiers = row.modifiers ? JSON.parse(row.modifiers) : null;
    const metafields = row.metafields ? JSON.parse(row.metafields) : null;
    const channels = row.channels ? JSON.parse(row.channels) : null;

    return {
      id: parseInt(row.id),
      storeid: row.storeid,
      name: row.name,
      f1: row.f1,
      f2: row.f2,
      f3: row.f3,
      f4: row.f4,
      f5: row.f5,
      type: row.type,
      category: row.category,
      collection: row.collection,
      unit: row.unit,
      price: typeof row.price === 'string' ? parseFloat(row.price) : row.price,
      stock: typeof row.stock === 'string' ? parseInt(row.stock) : row.stock,
      vendor: row.vendor,
      brand: row.brand,
      options,
      modifiers,
      metafields,
      channels
    };
  });
}

/**
 * Fetch inventory items for a specific product
 */
export async function fetchInventoryForProduct(productId: number): Promise<Inventory[]> {
  const result = await executeQuery(`SELECT * FROM inventory WHERE product_id = ${productId}`);

  if (!result || !result.rows || !Array.isArray(result.rows)) {
    console.error('Invalid result structure for inventory:', result);
    return [];
  }

  return result.rows.map((rowArray: any[]) => {
    // Each row is an array of column values with type information
    // Convert to an object for easier handling
    const row: Record<string, any> = {};

    // Map column values to object properties
    if (result.cols && Array.isArray(result.cols)) {
      result.cols.forEach((col, index) => {
        const colValue = rowArray[index];
        if (colValue && colValue.type !== 'null') {
          row[col.name] = colValue.value;
        } else {
          row[col.name] = null;
        }
      });
    }

    // Convert JSON strings to objects
    const metafields = row.metafields ? JSON.parse(row.metafields) : null;
    const modifiers = row.modifiers ? JSON.parse(row.modifiers) : null;

    return {
      id: parseInt(row.id),
      product_id: parseInt(row.product_id),
      name: row.name,
      f: row.f,
      sku: row.sku,
      barcode: row.barcode,
      available: typeof row.available === 'string' ? parseInt(row.available) : row.available,
      committed: typeof row.committed === 'string' ? parseInt(row.committed) : row.committed,
      instock: typeof row.instock === 'string' ? parseInt(row.instock) : row.instock,
      price: typeof row.price === 'string' ? parseFloat(row.price) : row.price,
      compare: typeof row.compare === 'string' ? parseFloat(row.compare) : row.compare,
      cost: typeof row.cost === 'string' ? parseFloat(row.cost) : row.cost,
      metafields,
      modifiers,
      location: row.location
    };
  });
}

/**
 * Fetch all inventory items
 */
export async function fetchAllInventory(): Promise<Inventory[]> {
  const result = await executeQuery('SELECT * FROM inventory');

  if (!result || !result.rows || !Array.isArray(result.rows)) {
    console.error('Invalid result structure for all inventory:', result);
    return [];
  }

  return result.rows.map((rowArray: any[]) => {
    // Each row is an array of column values with type information
    // Convert to an object for easier handling
    const row: Record<string, any> = {};

    // Map column values to object properties
    if (result.cols && Array.isArray(result.cols)) {
      result.cols.forEach((col, index) => {
        const colValue = rowArray[index];
        if (colValue && colValue.type !== 'null') {
          row[col.name] = colValue.value;
        } else {
          row[col.name] = null;
        }
      });
    }

    // Convert JSON strings to objects
    const metafields = row.metafields ? JSON.parse(row.metafields) : null;
    const modifiers = row.modifiers ? JSON.parse(row.modifiers) : null;

    return {
      id: parseInt(row.id),
      product_id: parseInt(row.product_id),
      name: row.name,
      f: row.f,
      sku: row.sku,
      barcode: row.barcode,
      available: typeof row.available === 'string' ? parseInt(row.available) : row.available,
      committed: typeof row.committed === 'string' ? parseInt(row.committed) : row.committed,
      instock: typeof row.instock === 'string' ? parseInt(row.instock) : row.instock,
      price: typeof row.price === 'string' ? parseFloat(row.price) : row.price,
      compare: typeof row.compare === 'string' ? parseFloat(row.compare) : row.compare,
      cost: typeof row.cost === 'string' ? parseFloat(row.cost) : row.cost,
      metafields,
      modifiers,
      location: row.location
    };
  });
}

/**
 * Update a product in the database
 */
export async function updateProduct(product: Product): Promise<boolean> {
  try {
    console.log('Updating product:', product.id);

    // Convert JSON objects to strings
    const options = product.options ? JSON.stringify(product.options) : null;
    const modifiers = product.modifiers ? JSON.stringify(product.modifiers) : null;
    const metafields = product.metafields ? JSON.stringify(product.metafields) : null;
    const channels = product.channels ? JSON.stringify(product.channels) : null;

    // Build the SQL query
    const sql = `
      UPDATE products
      SET
        name = '${product.name.replace(/'/g, "''")}',
        price = ${product.price || 0},
        stock = ${product.stock || 0},
        category = '${(product.category || '').replace(/'/g, "''")}',
        type = '${(product.type || '').replace(/'/g, "''")}',
        vendor = '${(product.vendor || '').replace(/'/g, "''")}',
        brand = '${(product.brand || '').replace(/'/g, "''")}'
      WHERE id = ${product.id}
    `;

    await executeQuery(sql);
    console.log('Product updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
}

/**
 * Create a new product in the database
 */
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    console.log('Creating new product:', product.name);

    // Convert JSON objects to strings
    const options = product.options ? JSON.stringify(product.options) : '{}';
    const modifiers = product.modifiers ? JSON.stringify(product.modifiers) : '{}';
    const metafields = product.metafields ? JSON.stringify(product.metafields) : '{}';
    const channels = product.channels ? JSON.stringify(product.channels) : '{}';

    // Build the SQL query
    const sql = `
      INSERT INTO products (
        storeid, name, price, stock, category, type, vendor, brand,
        options, modifiers, metafields, channels
      ) VALUES (
        'S1',
        '${product.name.replace(/'/g, "''")}',
        ${product.price || 0},
        ${product.stock || 0},
        '${(product.category || '').replace(/'/g, "''")}',
        '${(product.type || '').replace(/'/g, "''")}',
        '${(product.vendor || '').replace(/'/g, "''")}',
        '${(product.brand || '').replace(/'/g, "''")}',
        '${options}',
        '${modifiers}',
        '${metafields}',
        '${channels}'
      )
    `;

    // Execute the query
    await executeQuery(sql);

    // Get the last inserted ID
    const result = await executeQuery('SELECT last_insert_rowid() as id');
    if (!result || !result.rows || !Array.isArray(result.rows) || result.rows.length === 0) {
      throw new Error('Failed to get new product ID');
    }

    // Extract the ID from the result
    const row: Record<string, any> = {};
    if (result.cols && Array.isArray(result.cols)) {
      result.cols.forEach((col, index) => {
        const colValue = result.rows[0][index];
        if (colValue && colValue.type !== 'null') {
          row[col.name] = colValue.value;
        } else {
          row[col.name] = null;
        }
      });
    }

    const newId = parseInt(row.id);
    console.log('Product created successfully with ID:', newId);

    // Return the new product with its ID
    return {
      ...product,
      id: newId
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}
