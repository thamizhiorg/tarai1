import { Product, Inventory } from '@/types/Product';
import { Alert } from 'react-native';
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
    // Parse JSON fields and ensure they're arrays
    let options = [];
    let modifiers = [];
    let metafields = [];
    let channels = [];

    try {
      if (row.options && row.options !== '{}') {
        const parsed = JSON.parse(row.options);
        options = Array.isArray(parsed) ? parsed : [];
      }

      if (row.modifiers && row.modifiers !== '{}') {
        const parsed = JSON.parse(row.modifiers);
        modifiers = Array.isArray(parsed) ? parsed : [];
      }

      if (row.metafields && row.metafields !== '{}') {
        const parsed = JSON.parse(row.metafields);
        metafields = Array.isArray(parsed) ? parsed : [];
      }

      if (row.channels && row.channels !== '{}') {
        const parsed = JSON.parse(row.channels);
        channels = Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error parsing JSON fields:', error);
    }

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
      channels,
      notes: row.notes
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
    // Parse JSON fields and ensure they're arrays
    let metafields = [];
    let modifiers = [];

    try {
      if (row.metafields && row.metafields !== '{}') {
        const parsed = JSON.parse(row.metafields);
        metafields = Array.isArray(parsed) ? parsed : [];
      }

      if (row.modifiers && row.modifiers !== '{}') {
        const parsed = JSON.parse(row.modifiers);
        modifiers = Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error parsing JSON fields:', error);
    }

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
        brand = '${(product.brand || '').replace(/'/g, "''")}',
        f1 = '${(product.f1 || '').replace(/'/g, "''")}',
        f2 = '${(product.f2 || '').replace(/'/g, "''")}',
        f3 = '${(product.f3 || '').replace(/'/g, "''")}',
        f4 = '${(product.f4 || '').replace(/'/g, "''")}',
        f5 = '${(product.f5 || '').replace(/'/g, "''")}',
        notes = '${(product.notes || '').replace(/'/g, "''")}'
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
        options, modifiers, metafields, channels, f1, f2, f3, f4, f5, notes
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
        '${channels}',
        '${(product.f1 || '').replace(/'/g, "''")}',
        '${(product.f2 || '').replace(/'/g, "''")}',
        '${(product.f3 || '').replace(/'/g, "''")}',
        '${(product.f4 || '').replace(/'/g, "''")}',
        '${(product.f5 || '').replace(/'/g, "''")}',
        '${(product.notes || '').replace(/'/g, "''")}'
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

/**
 * Create a new inventory item
 */
export async function createInventoryItem(item: Omit<Inventory, 'id'>): Promise<Inventory | null> {
  try {
    console.log('Creating new inventory item for product:', item.product_id);

    // Convert JSON objects to strings
    const metafields = item.metafields ? JSON.stringify(item.metafields) : '{}';
    const modifiers = item.modifiers ? JSON.stringify(item.modifiers) : '{}';

    // Calculate instock value if not provided
    const instock = item.instock ?? (item.available ?? 0) - (item.committed ?? 0);

    // Build the SQL query
    const sql = `
      INSERT INTO inventory (
        product_id, name, f, sku, barcode, available, committed, instock,
        price, compare, cost, metafields, modifiers, location
      ) VALUES (
        ${item.product_id},
        '${(item.name || '').replace(/'/g, "''")}',
        ${item.f ? `'${item.f.replace(/'/g, "''")}' ` : 'NULL'},
        '${(item.sku || '').replace(/'/g, "''")}',
        ${item.barcode ? `'${item.barcode.replace(/'/g, "''")}' ` : 'NULL'},
        ${item.available || 0},
        ${item.committed || 0},
        ${instock},
        ${item.price || 0},
        ${item.compare || 'NULL'},
        ${item.cost || 'NULL'},
        '${metafields}',
        '${modifiers}',
        ${item.location ? `'${item.location.replace(/'/g, "''")}' ` : 'NULL'}
      )
    `;

    // Execute the query
    await executeQuery(sql);

    // Get the last inserted ID
    const result = await executeQuery('SELECT last_insert_rowid() as id');
    if (!result || !result.rows || !Array.isArray(result.rows) || result.rows.length === 0) {
      throw new Error('Failed to get new inventory item ID');
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
    console.log('Inventory item created successfully with ID:', newId);

    // Return the new inventory item with its ID
    return {
      ...item,
      id: newId,
      instock
    } as Inventory;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return null;
  }
}

/**
 * Update an existing inventory item
 */
export async function updateInventoryItem(item: Inventory): Promise<boolean> {
  try {
    console.log('Updating inventory item:', item.id);

    // Convert JSON objects to strings
    const metafields = item.metafields ? JSON.stringify(item.metafields) : '{}';
    const modifiers = item.modifiers ? JSON.stringify(item.modifiers) : '{}';

    // Calculate instock value if not provided
    const instock = item.instock ?? (item.available ?? 0) - (item.committed ?? 0);

    // Build the SQL query
    const sql = `
      UPDATE inventory
      SET
        name = '${(item.name || '').replace(/'/g, "''")}',
        sku = '${(item.sku || '').replace(/'/g, "''")}',
        barcode = ${item.barcode ? `'${item.barcode.replace(/'/g, "''")}' ` : 'NULL'},
        available = ${item.available || 0},
        committed = ${item.committed || 0},
        instock = ${instock},
        price = ${item.price || 0},
        location = ${item.location ? `'${item.location.replace(/'/g, "''")}' ` : 'NULL'}
      WHERE id = ${item.id}
    `;

    await executeQuery(sql);
    console.log('Inventory item updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return false;
  }
}

/**
 * Delete an inventory item
 */
export async function deleteInventoryItem(itemId: number): Promise<boolean> {
  try {
    console.log('Deleting inventory item:', itemId);

    // Build the SQL query
    const sql = `DELETE FROM inventory WHERE id = ${itemId}`;

    await executeQuery(sql);
    console.log('Inventory item deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return false;
  }
}