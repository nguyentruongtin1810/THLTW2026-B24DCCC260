import BlogPost from '@/models/blog/posts';
import { mockPosts } from '../../../mock/blog';

/**
 * Blog Posts Service
 * Manages all post-related operations (CRUD, search, filter, etc.)
 */

const STORAGE_KEY = 'blog_posts';
const VIEWS_STORAGE_KEY = 'blog_post_views';

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPosts));
  }
};

// Helper to get all posts from storage
const getAllPosts = (): BlogPost.Post[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : mockPosts;
};

// Helper to save posts to storage
const savePosts = (posts: BlogPost.Post[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

// Helper to get view counts
const getViewCounts = (): Record<string, number> => {
  const data = localStorage.getItem(VIEWS_STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

// Helper to save view counts
const saveViewCounts = (counts: Record<string, number>) => {
  localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(counts));
};

/**
 * Get all posts with optional filtering
 */
export const getPosts = async (query?: BlogPost.PostQuery) => {
  const posts = getAllPosts();

  let filtered = [...posts];

  // Filter by status
  if (query?.status) {
    filtered = filtered.filter((p) => p.status === query.status);
  }

  // Filter by tags
  if (query?.tags && query.tags.length > 0) {
    filtered = filtered.filter((p) =>
      query.tags!.some((tag) => p.tags.includes(tag))
    );
  }

  // Filter by keyword (search in title and excerpt)
  if (query?.keyword) {
    const keyword = query.keyword.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.excerpt.toLowerCase().includes(keyword)
    );
  }

  // Sort by createdAt descending
  filtered.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Pagination
  const page = query?.page || 1;
  const pageSize = query?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
};

/**
 * Get a single post by id
 */
export const getPostById = async (id: string) => {
  const posts = getAllPosts();
  return posts.find((p) => p.id === id);
};

/**
 * Get a single post by slug
 */
export const getPostBySlug = async (slug: string) => {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
};

/**
 * Create a new post
 */
export const createPost = async (input: BlogPost.CreatePostInput) => {
  const posts = getAllPosts();
  const newPost: BlogPost.Post = {
    id: `post-${Date.now()}`,
    ...input,
    author: 'Anonymous',
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
};

/**
 * Update a post
 */
export const updatePost = async (input: BlogPost.UpdatePostInput) => {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.id === input.id);

  if (index === -1) {
    throw new Error('Post not found');
  }

  const updated: BlogPost.Post = {
    ...posts[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updated;
  savePosts(posts);
  return updated;
};

/**
 * Delete a post
 */
export const deletePost = async (id: string) => {
  const posts = getAllPosts();
  const filtered = posts.filter((p) => p.id !== id);

  if (filtered.length === posts.length) {
    throw new Error('Post not found');
  }

  savePosts(filtered);
  return true;
};

/**
 * Increment view count for a post
 */
export const incrementPostView = async (id: string) => {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    throw new Error('Post not found');
  }

  // Get current view counts
  const views = getViewCounts();
  views[id] = (views[id] || 0) + 1;
  saveViewCounts(views);

  // Update post view count
  post.viewCount = views[id];
  savePosts(posts);

  return post;
};

/**
 * Get related posts (same tags)
 */
export const getRelatedPosts = async (
  postId: string,
  limit: number = 3
) => {
  const posts = getAllPosts();
  const currentPost = posts.find((p) => p.id === postId);

  if (!currentPost) {
    return [];
  }

  const related = posts
    .filter(
      (p) =>
        p.id !== postId &&
        p.status === 'published' &&
        p.tags.some((tag) => currentPost.tags.includes(tag))
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);

  return related;
};

/**
 * Get all published posts
 */
export const getPublishedPosts = async () => {
  return getPosts({ status: 'published' });
};

/**
 * Get all draft posts
 */
export const getDraftPosts = async () => {
  return getPosts({ status: 'draft' });
};

/**
 * Search posts by keyword
 */
export const searchPosts = async (keyword: string) => {
  return getPosts({ keyword });
};

export default {
  getPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  incrementPostView,
  getRelatedPosts,
  getPublishedPosts,
  getDraftPosts,
  searchPosts,
};
