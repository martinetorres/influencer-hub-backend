import { gql } from 'graphql-request';

export const GET_POSTS = gql` 
    query Posts($first: Int!, $after: String) {
        posts(first: $first, after: $after) {
            nodes {
                id
                modified
                slug
                title
                excerpt
                author {
                    node {
                        name
                    }
                }
                featuredImage {
                    node {
                        srcSet
                        sourceUrl
                    }
                }
                categories {
                    nodes {
                        categoryId
                        name
                    }
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`;

export const GET_SLUGS =
    gql`query GetSlugs($first: Int!, $after: String) {
      posts(first: $first, after: $after) {
        nodes {
          slug
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }`;

export const GET_POST_BY_SLUG = gql`
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        slug
        content
        featuredImage {
            node {
                srcSet
                sourceUrl
            }
        }
        categories {
            nodes {
                categoryId
                name
            }
        }
        author {
            node {
                name
            }
        }
      }
    }
`