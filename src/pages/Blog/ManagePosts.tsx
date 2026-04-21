import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Form,
  Popconfirm,
  Tag,
  message,
  Drawer,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getPosts, createPost, updatePost, deletePost, getTags } from '@/services/blog';
import BlogPost from '@/models/blog/posts';
import BlogTag from '@/models/blog/tags';
import styles from './ManagePosts.less';

const ManagePosts: React.FC = () => {
  const [form] = Form.useForm();
  const [posts, setPosts] = useState<BlogPost.Post[]>([]);
  const [tags, setTags] = useState<BlogTag.Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'draft' | 'published' | undefined>();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    loadPosts();
    loadTags();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await getPosts({
        keyword: keyword || undefined,
        status: statusFilter,
        page: current,
        pageSize: 10,
      });
      setPosts(result.data);
    } catch (error) {
      message.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const allTags = await getTags();
      setTags(allTags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleSearch = useCallback(
    (value: string) => {
      setKeyword(value);
      setCurrent(1);
    },
    []
  );

  const handleStatusChange = (value: 'draft' | 'published' | undefined) => {
    setStatusFilter(value);
    setCurrent(1);
  };

  useEffect(() => {
    loadPosts();
  }, [keyword, statusFilter, current]);

  const handleAddPost = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditPost = async (post: BlogPost.Post) => {
    setEditingId(post.id);
    form.setFieldsValue({
      ...post,
    });
    setModalVisible(true);
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id);
      message.success('Post deleted successfully');
      loadPosts();
    } catch (error) {
      message.error('Failed to delete post');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingId) {
        await updatePost({
          id: editingId,
          ...values,
        });
        message.success('Post updated successfully');
      } else {
        await createPost(values);
        message.success('Post created successfully');
      }

      setModalVisible(false);
      loadPosts();
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string) => <span className={styles.title}>{text}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: 'draft' | 'published') => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? 'Đã đăng' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (tagIds: string[]) => (
        <Space size={[0, 8]} wrap>
          {tagIds.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return (
              <Tag key={tagId} color={tag?.color}>
                {tag?.name}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      render: (count: number) => <span>{count}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: BlogPost.Post) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPost(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeletePost(record.id)}
          >
            <span>Bạn có chắc muốn xóa bài viết này?</span>
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.managePosts}>
      <h1>Quản lý bài viết</h1>

      <div className={styles.toolbar}>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề"
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 200 }}
          />

          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 150 }}
            allowClear
            onChange={handleStatusChange}
            options={[
              { label: 'Đã đăng', value: 'published' },
              { label: 'Nháp', value: 'draft' },
            ]}
          />

          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPost}>
            Thêm bài viết
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={posts.map((post) => ({ ...post, key: post.id }))}
        loading={loading}
        pagination={{
          current,
          pageSize: 10,
          onChange: (page) => setCurrent(page),
        }}
        scroll={{ x: 1200 }}
      />

      <Drawer
        title={editingId ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        placement="right"
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
        width={600}
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
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder="bat-dau-voi-react-hooks" />
          </Form.Item>

          <Form.Item
            label="Tóm tắt"
            name="excerpt"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập tóm tắt bài viết" />
          </Form.Item>

          <Form.Item
            label="Nội dung (Markdown)"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea rows={8} placeholder="Nhập nội dung bài viết (hỗ trợ Markdown)" />
          </Form.Item>

          <Form.Item
            label="Ảnh đại diện (URL)"
            name="avatar"
            rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            label="Thẻ"
            name="tags"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thẻ' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn thẻ"
              options={tags.map((tag) => ({
                label: tag.name,
                value: tag.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            initialValue="draft"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: 'Nháp', value: 'draft' },
                { label: 'Đã đăng', value: 'published' },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ManagePosts;
