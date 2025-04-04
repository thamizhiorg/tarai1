import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchInventoryForProduct, updateProduct, createProduct } from '@/services/TursoService';
import { Product, Inventory } from '@/types/Product';

type ProductContextType = {
  products: Product[];
  selectedProduct: Product | null;
  inventory: Inventory[];
  isLoading: boolean;
  error: Error | null;
  productsLoaded: boolean;
  loadProducts: () => Promise<Product[]>;
  selectProduct: (product: Product) => void;
  loadInventoryForProduct: (productId: number) => Promise<void>;
  updateProductDetails: (product: Product) => Promise<boolean>;
  createNewProduct: (productData: Omit<Product, 'id'>) => Promise<Product | null>;
  getNewProductTemplate: () => Omit<Product, 'id'>;
  refreshProducts: () => Promise<Product[]>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [productsLoaded, setProductsLoaded] = useState<boolean>(false);

  // Refresh products - always fetches from API
  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Refreshing products from API...');
      const productsData = await fetchProducts();
      console.log('Products refreshed:', productsData.length);
      setProducts(productsData);
      setProductsLoaded(true);
      return productsData;
    } catch (err) {
      console.error('Error refreshing products:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh products'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load products - uses cached data if available
  const loadProducts = useCallback(async () => {
    // If products are already loaded, return them without making an API call
    if (productsLoaded && products.length > 0 && !isLoading) {
      console.log('Using cached products:', products.length);
      return products;
    }

    // Otherwise, fetch from API
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading products from API...');
      const productsData = await fetchProducts();
      console.log('Products loaded:', productsData.length);
      setProducts(productsData);
      setProductsLoaded(true);
      return productsData;
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err : new Error('Failed to load products'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [products, productsLoaded, isLoading]);

  const selectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const loadInventoryForProduct = useCallback(async (productId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading inventory for product:', productId);
      const inventoryData = await fetchInventoryForProduct(productId);
      console.log('Inventory loaded:', inventoryData.length);
      setInventory(inventoryData);
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError(err instanceof Error ? err : new Error('Failed to load inventory'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load inventory when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      loadInventoryForProduct(selectedProduct.id);
    }
  }, [selectedProduct, loadInventoryForProduct]);

  // Update product details
  const updateProductDetails = useCallback(async (product: Product): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Updating product in context:', product);
      const success = await updateProduct(product);

      if (success) {
        // Update the product in the local state
        setProducts(prevProducts =>
          prevProducts.map(p => p.id === product.id ? product : p)
        );

        // Update selected product if it's the one being updated
        if (selectedProduct && selectedProduct.id === product.id) {
          setSelectedProduct(product);
        }

        // Ensure productsLoaded is true since we have updated products
        setProductsLoaded(true);

        console.log('Product updated successfully in context');
        return true;
      } else {
        throw new Error('Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product in context:', err);
      setError(err instanceof Error ? err : new Error('Failed to update product'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct]);

  // Create a new product
  const createNewProduct = useCallback(async (productData: Omit<Product, 'id'>): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Creating new product in context:', productData.name);
      const newProduct = await createProduct(productData);

      if (newProduct) {
        // Add the new product to the local state
        setProducts(prevProducts => [newProduct, ...prevProducts]);

        // Set it as the selected product
        setSelectedProduct(newProduct);

        // Ensure productsLoaded is true since we have updated products
        setProductsLoaded(true);

        console.log('Product created successfully in context');
        return newProduct;
      } else {
        throw new Error('Failed to create product');
      }
    } catch (err) {
      console.error('Error creating product in context:', err);
      setError(err instanceof Error ? err : new Error('Failed to create product'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get a template for a new product
  const getNewProductTemplate = useCallback((): Omit<Product, 'id'> => {
    return {
      storeid: 'S1',
      name: '',
      f1: null,
      f2: null,
      f3: null,
      f4: null,
      f5: null,
      type: '',
      category: '',
      collection: null,
      unit: 'pcs',
      price: 0,
      stock: 0,
      vendor: '',
      brand: '',
      options: {},
      modifiers: {},
      metafields: {},
      channels: {},
      notes: null
    };
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        selectedProduct,
        inventory,
        isLoading,
        error,
        productsLoaded,
        loadProducts,
        selectProduct,
        loadInventoryForProduct,
        updateProductDetails,
        createNewProduct,
        getNewProductTemplate,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
