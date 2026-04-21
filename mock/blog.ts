import BlogPost from '@/models/blog/posts';
import BlogTag from '@/models/blog/tags';

/**
 * Mock data for blog tags
 */
export const mockTags: BlogTag.Tag[] = [
  {
    id: 'tag-1',
    name: 'React',
    slug: 'react',
    description: 'React.js framework',
    color: '#61dafb',
    postCount: 3,
  },
  {
    id: 'tag-2',
    name: 'TypeScript',
    slug: 'typescript',
    description: 'TypeScript programming language',
    color: '#3178c6',
    postCount: 4,
  },
  {
    id: 'tag-3',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Web development and frontend',
    color: '#f7df1e',
    postCount: 5,
  },
  {
    id: 'tag-4',
    name: 'JavaScript',
    slug: 'javascript',
    description: 'JavaScript language',
    color: '#f7df1e',
    postCount: 2,
  },
  {
    id: 'tag-5',
    name: 'Ant Design',
    slug: 'ant-design',
    description: 'Ant Design UI library',
    color: '#1890ff',
    postCount: 2,
  },
];

/**
 * Mock data for blog posts
 */
export const mockPosts: BlogPost.Post[] = [
  {
    id: 'post-1',
    title: 'Bắt đầu với React Hooks',
    slug: 'bat-dau-voi-react-hooks',
    content: `# Bắt đầu với React Hooks

React Hooks là một tính năng mạnh mẽ cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết một class.

## Hooks là gì?

Hooks là những hàm đặc biệt cho phép bạn "hook vào" các tính năng của React. Ví dụ:

- \`useState\` để thêm state vào functional components
- \`useEffect\` để thực hiện side effects
- \`useContext\` để sử dụng React Context

## Ví dụ sử dụng useState

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## Các quy tắc của Hooks

1. Chỉ gọi Hooks ở top level
2. Chỉ gọi Hooks từ React function components

Thêm thông tin tại [React Hooks Documentation](https://react.dev/reference/react)`,
    excerpt: 'Tìm hiểu về React Hooks, một tính năng mạnh mẽ trong React 16.8+',
    author: 'Nguyễn Văn A',
    avatar: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=500&fit=crop',
    tags: ['tag-1', 'tag-4'],
    status: 'published',
    viewCount: 245,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'post-2',
    title: 'TypeScript Best Practices',
    slug: 'typescript-best-practices',
    content: `# TypeScript Best Practices

TypeScript là một superset của JavaScript tạo thêm tính năng kiểu dữ liệu tĩnh. Dưới đây là một số best practices:

## 1. Sử dụng strict mode

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## 2. Tránh sử dụng \`any\`

Thay vì \`any\`, hãy sử dụng các union types hoặc generics cụ thể.

## 3. Sử dụng Interfaces cho objects

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}
\`\`\`

## 4. Sử dụng Enums cho constants

\`\`\`typescript
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}
\`\`\`

Theo dõi TypeScript Documentation để cập nhật mới nhất.`,
    excerpt: 'Các best practices khi viết code TypeScript',
    author: 'Nguyễn Văn B',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    tags: ['tag-2', 'tag-3'],
    status: 'published',
    viewCount: 512,
    createdAt: '2024-01-10T09:30:00Z',
    updatedAt: '2024-01-10T09:30:00Z',
  },
  {
    id: 'post-3',
    title: 'Ant Design Customization Guide',
    slug: 'ant-design-customization',
    content: `# Ant Design Customization Guide

Ant Design cung cấp nhiều cách để tùy chỉnh theme và style theo nhu cầu của bạn.

## Sử dụng ConfigProvider

\`\`\`jsx
import { ConfigProvider } from 'antd';

<ConfigProvider theme={{ token: { colorPrimary: '#ff0000' } }}>
  <App />
</ConfigProvider>
\`\`\`

## Tùy chỉnh CSS Variables

Bạn có thể override các CSS variables mà Ant Design cung cấp.

## Sử dụng LESS hoặc CSS

Ant Design cung cấp LESS variables để tùy chỉnh theme.`,
    excerpt: 'Hướng dẫn tùy chỉnh Ant Design theo ý muốn',
    author: 'Nguyễn Văn C',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    tags: ['tag-5', 'tag-3'],
    status: 'published',
    viewCount: 189,
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-05T14:20:00Z',
  },
  {
    id: 'post-4',
    title: 'Web Development Trends 2024',
    slug: 'web-development-trends-2024',
    content: `# Web Development Trends 2024

## 1. AI Integration

AI ngày càng được tích hợp vào web development với các công cụ như ChatGPT, Copilot...

## 2. Edge Computing

Edge computing giúp tăng tốc độ ứng dụng bằng cách xử lý gần user hơn.

## 3. WebAssembly

WebAssembly cho phép chạy code hiệu suất cao trong trình duyệt.

## 4. Performance First

Web vitals và performance optimization trở nên quan trọng hơn bao giờ hết.

## 5. Micro Frontends

Kiến trúc micro frontend giúp tổ chức các team độc lập hơn.`,
    excerpt: 'Các xu hướng lớn trong web development năm 2024',
    author: 'Nguyễn Văn D',
    avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop',
    tags: ['tag-3'],
    status: 'published',
    viewCount: 678,
    createdAt: '2024-01-01T08:15:00Z',
    updatedAt: '2024-01-01T08:15:00Z',
  },
  {
    id: 'post-5',
    title: 'React Patterns và Anti-patterns',
    slug: 'react-patterns-anti-patterns',
    content: `# React Patterns và Anti-patterns

## Tốt Patterns

### 1. Container/Presentational Pattern
Tách component logic từ presentation.

### 2. Render Props
Chia sẻ state và logic giữa các components.

### 3. Custom Hooks
Tái sử dụng state logic.

## Anti-patterns để tránh

### 1. Props Drilling
Tránh truyền props quá nhiều level.

### 2. Inline Functions
Tránh khai báo hàm inline trong render.

### 3. Direct State Mutation
Luôn immutable updates.`,
    excerpt: 'Các patterns tốt và anti-patterns trong React',
    author: 'Nguyễn Văn E',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    tags: ['tag-1', 'tag-4'],
    status: 'published',
    viewCount: 423,
    createdAt: '2023-12-28T11:45:00Z',
    updatedAt: '2023-12-28T11:45:00Z',
  },
  {
    id: 'post-6',
    title: 'Mastering JavaScript Async',
    slug: 'mastering-javascript-async',
    content: `# Mastering JavaScript Async

## Callbacks
Cách cũ để xử lý async code.

## Promises
Promise cung cấp cách tốt hơn.

## Async/Await
Async/await làm code async dễ đọc hơn.

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
\`\`\``,
    excerpt: 'Hiểu rõ về async programming trong JavaScript',
    author: 'Nguyễn Văn F',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    tags: ['tag-4'],
    status: 'published',
    viewCount: 534,
    createdAt: '2023-12-20T13:30:00Z',
    updatedAt: '2023-12-20T13:30:00Z',
  },
  {
    id: 'post-7',
    title: 'CSS Grid vs Flexbox',
    slug: 'css-grid-vs-flexbox',
    content: `# CSS Grid vs Flexbox

## Flexbox
Flexbox tốt cho layouts một chiều.

### Ví dụ:
\`\`\`css
.container {
  display: flex;
  gap: 10px;
}
\`\`\`

## CSS Grid
CSS Grid tốt cho layouts hai chiều.

### Ví dụ:
\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
\`\`\`

## Khi nào dùng cái nào?
- Dùng Flexbox cho menu, navigation
- Dùng CSS Grid cho page layouts`,
    excerpt: 'So sánh Flexbox và CSS Grid',
    author: 'Nguyễn Văn G',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    tags: ['tag-3'],
    status: 'published',
    viewCount: 289,
    createdAt: '2023-12-15T09:00:00Z',
    updatedAt: '2023-12-15T09:00:00Z',
  },
  {
    id: 'post-8',
    title: 'State Management Best Practices',
    slug: 'state-management-best-practices',
    content: `# State Management Best Practices

## Redux
Redux là một predictable state container.

## Context API
React Context API là một built-in solution.

## Zustand
Zustand là một lightweight state management library.

\`\`\`javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
\`\`\`

## Chọn cái nào?
- Nhỏ app: useState hoặc Context
- Trung bình: Zustand, Jotai
- Lớn: Redux, Recoil`,
    excerpt: 'Best practices trong state management',
    author: 'Nguyễn Văn H',
    avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop',
    tags: ['tag-1', 'tag-2'],
    status: 'published',
    viewCount: 401,
    createdAt: '2023-12-10T10:15:00Z',
    updatedAt: '2023-12-10T10:15:00Z',
  },
  {
    id: 'post-9',
    title: 'Testing React Components',
    slug: 'testing-react-components',
    content: `# Testing React Components

## Unit Testing

Kiểm tra individual functions.

## Component Testing

Kiểm tra rendering và interactions.

## Integration Testing

Kiểm tra các components hoạt động cùng nhau.

## Tools

- Jest: Test runner
- React Testing Library: Testing utilities
- Vitest: Fast unit test framework

\`\`\`javascript
import { render, screen } from '@testing-library/react';

test('renders greeting message', () => {
  render(<Greeting name="Alice" />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});
\`\`\``,
    excerpt: 'Hướng dẫn testing React components',
    author: 'Nguyễn Văn I',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    tags: ['tag-1', 'tag-2'],
    status: 'published',
    viewCount: 267,
    createdAt: '2023-12-05T14:45:00Z',
    updatedAt: '2023-12-05T14:45:00Z',
  },
  {
    id: 'post-10',
    title: 'Introduction to Next.js',
    slug: 'introduction-to-nextjs',
    content: `# Introduction to Next.js

Next.js là một React framework cho production.

## Tính năng

- SSR (Server-Side Rendering)
- SSG (Static Site Generation)
- API Routes
- Built-in optimization

## SSR Example

\`\`\`javascript
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}
\`\`\`

## SSG Example

\`\`\`javascript
export async function getStaticProps() {
  const posts = await getPosts();
  return { props: { posts }, revalidate: 3600 };
}
\`\`\``,
    excerpt: 'Giới thiệu about Next.js framework',
    author: 'Nguyễn Văn J',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    tags: ['tag-1'],
    status: 'draft',
    viewCount: 0,
    createdAt: '2023-12-01T11:20:00Z',
    updatedAt: '2023-12-01T11:20:00Z',
  },
  {
    id: 'post-11',
    title: 'Performance Optimization Tips',
    slug: 'performance-optimization-tips',
    content: `# Performance Optimization Tips

## Image Optimization
- Sử dụng responsive images
- Lazy loading
- Sử dụng modern formats (webp)

## Code Splitting
- Dynamic imports
- Route-based splitting
- Component-level splitting

## Caching Strategies
- Browser cache
- CDN cache
- Server-side cache

## Monitoring
- Core Web Vitals
- Performance metrics
- User experience metrics`,
    excerpt: 'Các mẹo tối ưu hóa hiệu suất web',
    author: 'Nguyễn Văn K',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    tags: ['tag-3'],
    status: 'draft',
    viewCount: 0,
    createdAt: '2023-11-25T09:30:00Z',
    updatedAt: '2023-11-25T09:30:00Z',
  },
];


