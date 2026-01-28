import type { Order } from '@/models/dontry';
import { getProductById, updateProductQuantity } from '@/services/QuanLySanPham';

export const getAllOrders = async (): Promise<Order[]> => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
    const orders = await getAllOrders();
    return orders.find(o => o.id === id);
};

export const createOrder = async (order: Omit<Order, 'id' | 'createdDate'>): Promise<Order> => {
    const orders = await getAllOrders();
    const orderCount = orders.length + 1;
    const newOrder: Order = {
        ...order,
        id: `DH${String(orderCount).padStart(3, '0')}`,
        createdDate: new Date().toISOString().split('T')[0]
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder;
};

export const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<Order | undefined> => {
    const orders = await getAllOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        if (newStatus === 'Hoàn thành' && order.status !== 'Hoàn thành') {
            for (const item of order.products) {
                const product = await getProductById(item.productId);
                if (product) {
                    await updateProductQuantity(item.productId, product.quantity - item.quantity);
                }
            }
        }
        
        if (newStatus === 'Đã hủy' && order.status === 'Hoàn thành') {
            for (const item of order.products) {
                const product = await getProductById(item.productId);
                if (product) {
                    await updateProductQuantity(item.productId, product.quantity + item.quantity);
                }
            }
        }
        
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        return order;
    }
    
    return undefined;
};

export const deleteOrder = async (id: string): Promise<void> => {
    const orders = await getAllOrders();
    const filtered = orders.filter(o => o.id !== id);
    localStorage.setItem('orders', JSON.stringify(filtered));
};

export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
    const orders = await getAllOrders();
    return orders.filter(o => o.status === status);
};

export const searchOrders = async (keyword: string): Promise<Order[]> => {
    const orders = await getAllOrders();
    const lowerKeyword = keyword.toLowerCase();
    return orders.filter(o =>
        o.id.toLowerCase().includes(lowerKeyword) ||
        o.customerName.toLowerCase().includes(lowerKeyword)
    );
};

export const filterOrdersByDateRange = async (startDate: string, endDate: string): Promise<Order[]> => {
    const orders = await getAllOrders();
    return orders.filter(o =>
        o.createdDate >= startDate && o.createdDate <= endDate
    );
};

export const calculateRevenue = async (): Promise<number> => {
    const completedOrders = await getOrdersByStatus('Hoàn thành');
    return completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
};

export const validateOrder = async (order: Omit<Order, 'id' | 'createdDate'>): Promise<{ valid: boolean; errors: string[] }> => {
    const errors: string[] = [];

    if (!order.customerName?.trim()) {
        errors.push('Tên khách hàng không được để trống');
    }

    if (!order.phone?.trim()) {
        errors.push('Số điện thoại không được để trống');
    } else if (!/^\d{10,11}$/.test(order.phone.replace(/\D/g, ''))) {
        errors.push('Số điện thoại phải từ 10-11 số');
    }

    if (!order.address?.trim()) {
        errors.push('Địa chỉ không được để trống');
    }

    if (!order.products || order.products.length === 0) {
        errors.push('Phải chọn ít nhất một sản phẩm');
    } else {
        for (const item of order.products) {
            const product = await getProductById(item.productId);
            if (product && item.quantity > product.quantity) {
                errors.push(`Số lượng "${item.productName}" không được vượt quá ${product.quantity}`);
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
};
