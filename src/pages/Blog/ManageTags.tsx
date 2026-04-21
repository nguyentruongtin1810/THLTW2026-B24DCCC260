import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Form,
  Popconfirm,
  message,
  Drawer,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getTags, createTag, updateTag, deleteTag, tagNameExists } from '@/services/blog';
import BlogTag from '@/models/blog/tags';
import styles from './ManageTags.less';

const ManageTags: React.FC = () => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<BlogTag.Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      let allTags = await getTags();
      if (keyword) {
        allTags = allTags.filter((tag) =>
          tag.name.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      setTags(allTags);
    } catch (error) {
      message.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      loadTags();
    }, 300);
    setSearchTimeout(timeout);
  };

  const handleAddTag = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTag = (tag: BlogTag.Tag) => {
    setEditingId(tag.id);
    form.setFieldsValue({
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      color: tag.color,
    });
    setModalVisible(true);
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag(id);
      message.success('Tag deleted successfully');
      loadTags();
    } catch (error) {
      message.error('Failed to delete tag');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Check if name already exists
      if (!editingId) {
        const exists = await tagNameExists(values.name);
        if (exists) {
          message.error('Tag name already exists');
          return;
        }
      } else {
        const currentTag = tags.find((t) => t.id === editingId);
        if (currentTag && currentTag.name !== values.name) {
          const exists = await tagNameExists(values.name, editingId);
          if (exists) {
            message.error('Tag name already exists');
            return;
          }
        }
      }

      if (editingId) {
        await updateTag({
          id: editingId,
          ...values,
        });
        message.success('Tag updated successfully');
      } else {
        await createTag(values);
        message.success('Tag created successfully');
      }

      setModalVisible(false);
      loadTags();
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: BlogTag.Tag) => (
        <div className={styles.tagName}>
          {record.color && (
            <div
              className={styles.colorDot}
              style={{ backgroundColor: record.color }}
            />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 200,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <span>{text || '-'}</span>,
    },
    {
      title: 'Số bài viết',
      dataIndex: 'postCount',
      key: 'postCount',
      width: 120,
      render: (count: number) => <strong>{count || 0}</strong>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: BlogTag.Tag) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTag(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteTag(record.id)}
          >
            <span>Bạn có chắc muốn xóa thẻ này? Nó sẽ bị xóa khỏi tất cả các bài viết.</span>
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.manageTags}>
      <h1>Quản lý thẻ</h1>

      <div className={styles.toolbar}>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm thẻ"
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 200 }}
          />

          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTag}>
            Thêm thẻ mới
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={tags.map((tag) => ({ ...tag, key: tag.id }))}
        loading={loading}
        pagination={{
          pageSize: 20,
        }}
        scroll={{ x: 900 }}
      />

      <Drawer
        title={editingId ? 'Sửa thẻ' : 'Thêm thẻ mới'}
        placement="right"
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
        width={500}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            <Button type="primary" onClick={handleModalOk}>
              {editingId ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="Tên thẻ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
          >
            <Input placeholder="React" />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder="react" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả về thẻ này (tùy chọn)" />
          </Form.Item>

          <Form.Item label="Màu sắc" name="color">
            <Input type="color" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ManageTags;
