import type { Product } from '@/models/sanpham';

export const getAllProducts = async (): Promise<Product[]> => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
    const products = await getAllProducts();
    return products.find(p => p.id === id);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const products = await getAllProducts();
    const newProduct: Product = {
        ...product,
        id: Math.max(...products.map(p => p.id), 0) + 1
    };
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    return newProduct;
};

export const updateProduct = async (product: Product): Promise<Product> => {
    const products = await getAllProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
        products[index] = product;
        localStorage.setItem('products', JSON.stringify(products));
    }
    return product;
};

export const deleteProduct = async (id: number): Promise<void> => {
    const products = await getAllProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(filtered));
};

export const getCategories = async (): Promise<string[]> => {
    const products = await getAllProducts();
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories).sort();
};

export const updateProductQuantity = async (id: number, quantity: number): Promise<void> => {
    const product = await getProductById(id);
    if (product) {
        await updateProduct({ ...product, quantity });
    }
};

export const searchProducts = async (keyword: string): Promise<Product[]> => {
    const products = await getAllProducts();
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(lowerKeyword) ||
        p.category.toLowerCase().includes(lowerKeyword)
    );
};
