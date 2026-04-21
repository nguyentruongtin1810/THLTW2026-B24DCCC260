import React from 'react';
import { Card, Space, Row, Col, Avatar, Button, Divider } from 'antd';
import {
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  MailOutlined,
} from '@ant-design/icons';
import styles from './About.less';

const BlogAbout: React.FC = () => {
  return (
    <div className={styles.about}>
      <div className={styles.header}>
        <h1>Về tôi</h1>
      </div>

      <div className={styles.content}>
        <Card>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={8} className={styles.avatarSection}>
              <Avatar
                size={200}
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                className={styles.avatar}
              />
              <h2>Nguyễn Văn A</h2>
              <p className={styles.title}>Full Stack Developer</p>

              <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                <Button
                  block
                  icon={<MailOutlined />}
                  onClick={() => (window.location.href = 'mailto:example@gmail.com')}
                >
                  Email
                </Button>
                <Button block icon={<GithubOutlined />} onClick={() => window.open('#')}>
                  GitHub
                </Button>
                <Button block icon={<LinkedinOutlined />} onClick={() => window.open('#')}>
                  LinkedIn
                </Button>
                <Button block icon={<TwitterOutlined />} onClick={() => window.open('#')}>
                  Twitter
                </Button>
              </Space>
            </Col>

            <Col xs={24} sm={16} className={styles.bioSection}>
              <h3>Tiểu sử</h3>
              <p>
                Xin chào! Tôi là một lập trình viên Full Stack với kinh nghiệm hơn 5 năm trong phát
                triển ứng dụng web. Tôi yêu thích việc giải quyết các vấn đề phức tạp và tìm hiểu
                các công nghệ mới.
              </p>
              <p>
                Tôi chuyên về React, TypeScript, Node.js và các công nghệ web hiện đại khác. Ngoài
                lập trình, tôi cũng yêu thích viết blog để chia sẻ kiến thức và kinh nghiệm của mình
                với cộng đồng.
              </p>

              <Divider />

              <h3>Kỹ năng</h3>
              <div className={styles.skills}>
                <div className={styles.skillCategory}>
                  <h4>Frontend</h4>
                  <ul>
                    <li>React.js</li>
                    <li>TypeScript</li>
                    <li>Ant Design</li>
                    <li>TailwindCSS</li>
                    <li>Next.js</li>
                  </ul>
                </div>

                <div className={styles.skillCategory}>
                  <h4>Backend</h4>
                  <ul>
                    <li>Node.js</li>
                    <li>Express.js</li>
                    <li>MongoDB</li>
                    <li>PostgreSQL</li>
                    <li>RESTful API</li>
                  </ul>
                </div>

                <div className={styles.skillCategory}>
                  <h4>DevOps & Tools</h4>
                  <ul>
                    <li>Docker</li>
                    <li>Git</li>
                    <li>CI/CD</li>
                    <li>AWS</li>
                    <li>Linux</li>
                  </ul>
                </div>
              </div>

              <Divider />

              <h3>Kinh nghiệm</h3>
              <div className={styles.experience}>
                <div className={styles.item}>
                  <h4>Senior Frontend Developer</h4>
                  <p className={styles.company}>TechCorp Vietnam - 2021 - Hiện tại</p>
                  <p>
                    Lãnh đạo team frontend, xây dựng các ứng dụng web lớn với React và TypeScript.
                    Cải thiện performance của ứng dụng giúp tăng 40% tốc độ tải.
                  </p>
                </div>

                <div className={styles.item}>
                  <h4>Full Stack Developer</h4>
                  <p className={styles.company}>StartUp XYZ - 2019 - 2021</p>
                  <p>
                    Phát triển ứng dụng full stack, quản lý database, triển khai trên cloud.
                    Tham gia vào toàn bộ quy trình phát triển sản phẩm.
                  </p>
                </div>

                <div className={styles.item}>
                  <h4>Junior Developer</h4>
                  <p className={styles.company}>Web Agency - 2018 - 2019</p>
                  <p>
                    Bắt đầu sự nghiệp lập trình, xây dựng các website tĩnh và động cho khách hàng.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default BlogAbout;
