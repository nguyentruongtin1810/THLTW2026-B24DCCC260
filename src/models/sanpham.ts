import { useState, useEffect } from 'react';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

const INITIAL_PRODUCTS: Product[] = [
    { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
    { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
    { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
    { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
    { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
    { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

export default () => {
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    });
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        setProducts([...products, { ...product, id: newId }]);
        setModalVisible(false);
        setEditingProduct(undefined);
    };

    const updateProduct = (product: Product) => {
        setProducts(products.map(p => p.id === product.id ? product : p));
        setModalVisible(false);
        setEditingProduct(undefined);
    };

    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const getProductById = (id: number): Product | undefined => {
        return products.find(p => p.id === id);
    };

    const getFilteredProducts = () => {
        if (!searchText) return products;
        return products.filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    return {
        products,
        modalVisible,
        setModalVisible,
        editingProduct,
        setEditingProduct,
        searchText,
        setSearchText,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getFilteredProducts
    };
};