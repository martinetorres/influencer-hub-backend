import { graphQLClient } from '../wordpress.api-client';
import { GET_POST_BY_SLUG, GET_POSTS, GET_SLUGS } from '../queries/wordpress-posts.queries';
import { PostCategory } from 'src/posts/entities/post.entity';

type WordpressPostCategory = {
  categoryId: string;
  name: string;
}

type WordpressPostCategories = {
  nodes: WordpressPostCategory[];
}

type WordpressPostNode = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  content?: string;
  author?: {
    node: {
      name: string;
    }
  };
  categories: WordpressPostCategories;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
};

type PaginatedPostsResponse = {
  posts: {
    nodes: WordpressPostNode[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

type PostBySlugResponse = {
  post: WordpressPostNode;
};

type SlugResponse = {
  posts: {
    nodes: Array<{ slug: string }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

const fetchPaginatedPosts = async (variables: { first: number; after?: string | null }) => {
    const data = await graphQLClient.request<PaginatedPostsResponse>(GET_POSTS, variables);
    return data.posts.nodes.map((node) => ({
        id: node.id,
        title: node.title,
        excerpt: node.excerpt,
        categories: node.categories.nodes.map(cat => ({
          categoryId: cat.categoryId,
          name: cat.name
        })),
        authorName: node.author?.node.name,
        slug: node.slug,
        date: node.date,
        featuredImage: node.featuredImage?.node?.sourceUrl,
    }));
};

const fetchPostBySlug = async (slug: string) => {
  const data = await graphQLClient.request<PostBySlugResponse>(GET_POST_BY_SLUG, { slug });
  return {
    id: data.post.id,
    title: data.post.title,
    slug: data.post.slug,
    content: data.post.content,
    featuredImage: data.post.featuredImage?.node?.sourceUrl,
    date: data.post.date,
    authorName: data.post.author?.node.name,
    categories: data.post.categories.nodes.map(cat => ({
      categoryId: cat.categoryId,
      name: cat.name
    })),
  };
};

const SLUGS_BATCH_SIZE = 50;

const fetchAllSlugs = async (batchSize: number = SLUGS_BATCH_SIZE) => {
  let hasNextPage = true;
  let after: string | null = null;
  const allSlugs: Array<{ slug: string }> = [];

  while (hasNextPage) {
    const variables = { first: batchSize, after };
    const data = await graphQLClient.request<SlugResponse>(GET_SLUGS, variables);

    allSlugs.push(...data.posts.nodes);
    hasNextPage = data.posts.pageInfo.hasNextPage;
    after = data.posts.pageInfo.endCursor;
  }

  return allSlugs;
};

export const wordpressPostRepository = {
  fetchPaginatedPosts,
  fetchPostBySlug,
  fetchAllSlugs,
};
