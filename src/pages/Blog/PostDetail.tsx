import React, { useState, useEffect } from 'react';
import { Tag, Space, Button, Row, Col, Spin, Empty, Divider } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useParams, history } from 'umi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PostCard from '@/components/Blog/PostCard';
import { getPostBySlug, getRelatedPosts, incrementPostView, getTags } from '@/services/blog';
import BlogPost from '@/models/blog/posts';
import BlogTag from '@/models/blog/tags';
import styles from './PostDetail.less';

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost.Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost.Post[]>([]);
  const [tags, setTags] = useState<BlogTag.Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);

      // Load current post
      const currentPost = await getPostBySlug(slug!);
      if (!currentPost) {
        setPost(null);
        setLoading(false);
        return;
      }

      // Increment view count
      await incrementPostView(currentPost.id);

      // Reload post to get updated view count
      const updatedPost = await getPostBySlug(slug!);
      setPost(updatedPost || currentPost);

      // Load related posts
      const related = await getRelatedPosts(currentPost.id, 3);
      setRelatedPosts(related);

      // Load tags
      const allTags = await getTags();
      setTags(allTags);
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTagColor = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    return tag?.color || '#1890ff';
  };

  const getTagName = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    return tag?.name || tagId;
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />;
  }

  if (!post) {
    return (
      <div className={styles.notFound}>
        <Empty description="Bài viết không được tìm thấy" style={{ marginTop: 48 }} />
        <Button type="primary" onClick={() => history.push('/blog')} style={{ marginTop: 24 }}>
          Quay lại Blog
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.postDetail}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => history.push('/blog')}
          className={styles.backButton}
        >
          Quay lại
        </Button>
      </div>

      <article className={styles.article}>
        <div className={styles.cover}>
          <img src={post.avatar} alt={post.title} />
        </div>

        <div className={styles.content}>
          <h1>{post.title}</h1>

          <div className={styles.meta}>
            <Space size="large">
              <span>
                <CalendarOutlined /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </span>
              <span>
                <UserOutlined /> {post.author}
              </span>
              <span>
                <EyeOutlined /> {post.viewCount} lượt xem
              </span>
            </Space>
          </div>

          <div className={styles.tags}>
            {post.tags.map((tagId) => (
              <Tag key={tagId} color={getTagColor(tagId)}>
                {getTagName(tagId)}
              </Tag>
            ))}
          </div>

          <Divider />

          <div className={styles.markdownContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2>Bài viết liên quan</h2>
          <Row gutter={[24, 24]}>
            {relatedPosts.map((relPost) => (
              <Col key={relPost.id} xs={24} sm={12} lg={8}>
                <PostCard post={relPost} tags={tags} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default BlogPostDetail;
