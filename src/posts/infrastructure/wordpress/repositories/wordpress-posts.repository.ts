import { graphQLClient } from '../wordpress.api-client';
import { GET_POST_BY_SLUG, GET_POSTS, GET_SLUGS } from '../queries/wordpress-posts.queries';

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
  modified: string;
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
    const posts = data.posts.nodes.map((node) => ({
        id: node.id,
        title: node.title,
        excerpt: node.excerpt,
        categories: node.categories.nodes.map(cat => ({
          categoryId: cat.categoryId,
          name: cat.name
        })),
        authorName: node.author?.node.name,
        slug: node.slug,
        date: node.modified,
        featuredImage: node.featuredImage?.node?.sourceUrl,
    }));
    return {
      posts,
      pageInfo: {
        hasNextPage: data.posts.pageInfo.hasNextPage,
        endCursor: data.posts.pageInfo.endCursor
      }
    }
};

const fetchPostBySlug = async (slug: string) => {
  const data = await graphQLClient.request<PostBySlugResponse>(GET_POST_BY_SLUG, { slug });
  return {
    id: data.post.id,
    title: data.post.title,
    slug: data.post.slug,
    content: data.post.content,
    featuredImage: data.post.featuredImage?.node?.sourceUrl,
    date: data.post.modified,
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
