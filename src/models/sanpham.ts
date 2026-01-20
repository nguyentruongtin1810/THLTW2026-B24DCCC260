import {useState } from 'react';
interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}
export default () => {
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
        { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
        { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
        { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
        { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
    ]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();
    const [searchText, setSearchText] = useState<string>('');
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
        getFilteredProducts
    };
}