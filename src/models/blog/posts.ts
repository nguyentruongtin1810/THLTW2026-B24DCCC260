/**
 * Blog Post Model
 */

declare namespace BlogPost {
  interface Post {
    id: string;
    title: string;
    slug: string;
    content: string; // Markdown content
    excerpt: string; // Short summary
    author: string;
    avatar: string; // Cover image URL
    tags: string[]; // Array of tag IDs or names
    status: 'draft' | 'published'; // Draft or Published
    viewCount: number;
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
  }

  interface CreatePostInput {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    avatar: string;
    tags: string[];
    status: 'draft' | 'published';
  }

  interface UpdatePostInput extends Partial<CreatePostInput> {
    id: string;
  }

  interface PostQuery {
    keyword?: string;
    tags?: string[];
    status?: 'draft' | 'published';
    page?: number;
    pageSize?: number;
  }
}

export default BlogPost;
