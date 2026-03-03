import { useState, useEffect } from 'react';

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    products: OrderItem[];
    totalAmount: number;
    status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
    createdDate: string;
}

const INITIAL_ORDERS: Order[] = [
    {
        id: 'DH001',
        customerName: 'Nguyễn Văn A',
        phone: '0912345678',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        products: [
            { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
        ],
        totalAmount: 25000000,
        status: 'Chờ xử lý',
        createdDate: new Date().toISOString().split('T')[0]
    }
];

export default () => {
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('orders');
        return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    });

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (order: Omit<Order, 'id' | 'createdDate'>) => {
        const newId = `DH${String(orders.length + 1).padStart(3, '0')}`;
        const newOrder: Order = {
            ...order,
            id: newId,
            createdDate: new Date().toISOString().split('T')[0]
        };
        setOrders([...orders, newOrder]);
        return newId;
    };

    const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const deleteOrder = (orderId: string) => {
        setOrders(orders.filter(order => order.id !== orderId));
    };

    const getOrderById = (orderId: string): Order | undefined => {
        return orders.find(order => order.id === orderId);
    };

    const getOrdersByStatus = (status: Order['status']): Order[] => {
        return orders.filter(order => order.status === status);
    };

    const searchOrders = (searchText: string): Order[] => {
        if (!searchText) return orders;
        const lowerText = searchText.toLowerCase();
        return orders.filter(order =>
            order.id.toLowerCase().includes(lowerText) ||
            order.customerName.toLowerCase().includes(lowerText)
        );
    };

    return {
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        getOrderById,
        getOrdersByStatus,
        searchOrders
    };
};
