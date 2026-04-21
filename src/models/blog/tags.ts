/**
 * Blog Tag Model
 */

declare namespace BlogTag {
  interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    postCount?: number; // Number of posts using this tag
  }

  interface CreateTagInput {
    name: string;
    slug: string;
    description?: string;
    color?: string;
  }

  interface UpdateTagInput extends Partial<CreateTagInput> {
    id: string;
  }
}

export default BlogTag;
