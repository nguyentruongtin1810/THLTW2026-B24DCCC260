import React from 'react';
import { Card, Tag, Space } from 'antd';
import { EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import BlogPost from '@/models/blog/posts';
import BlogTag from '@/models/blog/tags';
import styles from './PostCard.less';

interface PostCardProps {
  post: BlogPost.Post;
  tags?: BlogTag.Tag[];
  onTagClick?: (tagId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, tags = [], onTagClick }) => {
  const getTagColor = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    return tag?.color || '#1890ff';
  };

  const getTagName = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    return tag?.name || tagId;
  };

  return (
    <Card
      hoverable
      className={styles.postCard}
      cover={<img alt={post.title} src={post.avatar} className={styles.cover} />}
    >
      <div className={styles.content}>
        <Link to={`/blog/post/${post.slug}`}>
          <h3 className={styles.title}>{post.title}</h3>
        </Link>

        <p className={styles.excerpt}>{post.excerpt}</p>

        <div className={styles.tags}>
          {post.tags.map((tagId) => (
            <Tag
              key={tagId}
              color={getTagColor(tagId)}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                onTagClick?.(tagId);
              }}
            >
              {getTagName(tagId)}
            </Tag>
          ))}
        </div>

        <div className={styles.meta}>
          <Space size="large">
            <span className={styles.metaItem}>
              <CalendarOutlined /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </span>
            <span className={styles.metaItem}>
              <UserOutlined /> {post.author}
            </span>
            <span className={styles.metaItem}>
              <EyeOutlined /> {post.viewCount}
            </span>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
