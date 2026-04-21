import BlogTag from '@/models/blog/tags';
import { mockTags, mockPosts } from '../../../mock/blog';

/**
 * Blog Tags Service
 * Manages all tag-related operations (CRUD, etc.)
 */

const STORAGE_KEY = 'blog_tags';

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTags));
  }
};

// Helper to get all tags from storage
const getAllTags = (): BlogTag.Tag[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : mockTags;
};

// Helper to save tags to storage
const saveTags = (tags: BlogTag.Tag[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
};

// Helper to calculate post count for each tag
const updateTagPostCounts = (tags: BlogTag.Tag[]) => {
  const posts = localStorage.getItem('blog_posts')
    ? JSON.parse(localStorage.getItem('blog_posts')!)
    : mockPosts;

  return tags.map((tag) => ({
    ...tag,
    postCount: posts.filter((post: any) => post.tags.includes(tag.id))
      .length,
  }));
};

/**
 * Get all tags
 */
export const getTags = async () => {
  let tags = getAllTags();
  tags = updateTagPostCounts(tags);
  return tags.sort((a, b) => (b.postCount || 0) - (a.postCount || 0));
};

/**
 * Get a single tag by id
 */
export const getTagById = async (id: string) => {
  const tags = getAllTags();
  return tags.find((t) => t.id === id);
};

/**
 * Get tags by name (for search)
 */
export const searchTags = async (name: string) => {
  const tags = getAllTags();
  const keyword = name.toLowerCase();
  return tags.filter((t) => t.name.toLowerCase().includes(keyword));
};

/**
 * Create a new tag
 */
export const createTag = async (input: BlogTag.CreateTagInput) => {
  const tags = getAllTags();
  const newTag: BlogTag.Tag = {
    id: `tag-${Date.now()}`,
    ...input,
    postCount: 0,
  };

  tags.push(newTag);
  saveTags(tags);
  return newTag;
};

/**
 * Update a tag
 */
export const updateTag = async (input: BlogTag.UpdateTagInput) => {
  const tags = getAllTags();
  const index = tags.findIndex((t) => t.id === input.id);

  if (index === -1) {
    throw new Error('Tag not found');
  }

  const updated: BlogTag.Tag = {
    ...tags[index],
    ...input,
  };

  tags[index] = updated;
  saveTags(tags);
  return updated;
};

/**
 * Delete a tag
 */
export const deleteTag = async (id: string) => {
  const tags = getAllTags();
  const filtered = tags.filter((t) => t.id !== id);

  if (filtered.length === tags.length) {
    throw new Error('Tag not found');
  }

  // Remove tag from all posts
  const posts = localStorage.getItem('blog_posts')
    ? JSON.parse(localStorage.getItem('blog_posts')!)
    : mockPosts;

  const updatedPosts = posts.map((post: any) => ({
    ...post,
    tags: post.tags.filter((tagId: string) => tagId !== id),
  }));

  localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
  saveTags(filtered);

  return true;
};

/**
 * Check if tag name already exists
 */
export const tagNameExists = async (name: string, excludeId?: string) => {
  const tags = getAllTags();
  return tags.some(
    (t) => t.name.toLowerCase() === name.toLowerCase() && t.id !== excludeId
  );
};

/**
 * Get popular tags (with most posts)
 */
export const getPopularTags = async (limit: number = 10) => {
  let tags = getAllTags();
  tags = updateTagPostCounts(tags);
  return tags
    .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
    .slice(0, limit);
};

export default {
  getTags,
  getTagById,
  searchTags,
  createTag,
  updateTag,
  deleteTag,
  tagNameExists,
  getPopularTags,
};
