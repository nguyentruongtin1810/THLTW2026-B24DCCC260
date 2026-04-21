import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Pagination, Space, Empty, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PostCard from '@/components/Blog/PostCard';
import { getPosts, getTags } from '@/services/blog';
import BlogPost from '@/models/blog/posts';
import BlogTag from '@/models/blog/tags';
import styles from './home.less';

const PAGE_SIZE = 9;

const BlogHome: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost.Post[]>([]);
  const [tags, setTags] = useState<BlogTag.Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  // Load tags on mount
  useEffect(() => {
    loadTags();
  }, []);

  // Load posts when filters change
  useEffect(() => {
    loadPosts(1);
  }, [selectedTags]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      loadPosts(1);
    }, 300);

    setSearchTimeout(timeout);
  }, [keyword]);

  const loadTags = async () => {
    try {
      const allTags = await getTags();
      setTags(allTags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const loadPosts = async (page: number) => {
    setLoading(true);
    try {
      const result = await getPosts({
        keyword: keyword || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        status: 'published',
        page,
        pageSize: PAGE_SIZE,
      });

      setPosts(result.data);
      setTotal(result.total);
      setCurrent(page);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleTagChange = (values: string[]) => {
    setSelectedTags(values);
    setCurrent(1);
  };

  const handlePageChange = (page: number) => {
    loadPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.blogHome}>
      <div className={styles.header}>
        <h1>Blog</h1>
        <p>Chia sẻ kiến thức và kinh nghiệm lập trình</p>
      </div>

      <div className={styles.filters}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input
            size="large"
            placeholder="Tìm kiếm bài viết..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />

          <div className={styles.tagFilter}>
            <span>Lọc theo thẻ:</span>
            <Select
              mode="multiple"
              placeholder="Chọn thẻ"
              style={{ width: '100%', maxWidth: 400 }}
              value={selectedTags}
              onChange={handleTagChange}
              options={tags.map((tag) => ({
                label: `${tag.name} (${tag.postCount || 0})`,
                value: tag.id,
              }))}
            />
          </div>
        </Space>
      </div>

      <Spin spinning={loading} size="large">
        {posts.length === 0 ? (
          <Empty description="Không tìm thấy bài viết" style={{ marginTop: 48 }} />
        ) : (
          <>
            <Row gutter={[24, 24]} className={styles.postsGrid}>
              {posts.map((post) => (
                <Col key={post.id} xs={24} sm={12} lg={8}>
                  <PostCard
                    post={post}
                    tags={tags}
                    onTagClick={(tagId) => {
                      if (!selectedTags.includes(tagId)) {
                        setSelectedTags([tagId]);
                      }
                    }}
                  />
                </Col>
              ))}
            </Row>

            {total > PAGE_SIZE && (
              <div className={styles.pagination}>
                <Pagination
                  current={current}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </Spin>
    </div>
  );
};

export default BlogHome;
