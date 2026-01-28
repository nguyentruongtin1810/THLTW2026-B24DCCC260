import {
    Table,
    Button,
    Modal,
    Popconfirm,
    Space,
    Input,
} from 'antd';
import { useModel } from 'umi';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import FormProduct from './Form';
import { useMemo } from 'react';
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}
const QuanLySanPham: React.FC = () => {
    const {
        modalVisible,
        setModalVisible,
        editingProduct,
        setEditingProduct,
        searchText,
        setSearchText,
        deleteProduct,
        getFilteredProducts,
    } = useModel('sanpham');
    const filteredProducts = useMemo(() => getFilteredProducts(), [searchText]);
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Tên sản phẩm',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: 'Giá bán',
            key: 'price',
            dataIndex: 'price',
        },
        {
            title: 'Số lượng tồn kho',
            key: 'quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_: any, record: Product) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingProduct(record);
                            setModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                        onConfirm={() => deleteProduct(record.id)}
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];
    return (
        <div style={{ padding: '20px' }}>
            {}
            <div style={{ marginBottom: '20px' }}>
                <h1>Quản lý Sản phẩm</h1>
            </div>

            {}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'space-between' }}>
                <Input.Search
                    placeholder='Tìm kiếm theo tên sản phẩm...'
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}  
                    allowClear                                        
                />

                <Button
                    type='primary'
                    onClick={() => {
                        setEditingProduct(undefined);   
                        setModalVisible(true);          
                    }}
                >
                    + Thêm sản phẩm
                </Button>
            </div>

            {}
            <Table
                columns={columns}
                dataSource={filteredProducts}      
                rowKey='id'                         
                pagination={{
                    pageSize: 10,                     
                    showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
                }}
            />

            {}
            <Modal
                title={editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                visible={modalVisible}
                footer={null}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingProduct(undefined);
                }}
                destroyOnClose
            >
                <FormProduct />
            </Modal>
        </div>
    );
};


export default QuanLySanPham;
