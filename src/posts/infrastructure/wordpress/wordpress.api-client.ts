import { GraphQLClient } from 'graphql-request';

const BASE_URL =
  process.env.WORDPRESS_API_URL ?? 'http://localhost/martonic.dev/wp-json/hubsly/v1';

export const API = {
  BASE_URL,
  GRAPHQL_URL: 'http://localhost/martonic.dev/graphql',
  ENDPOINTS: {
    SUBSCRIBE: `${BASE_URL}/subscribe`,
    POSTS: `${BASE_URL}/posts`,
  },
};

const graphQlEndpoint = API.GRAPHQL_URL;

export const graphQLClient = new GraphQLClient(graphQlEndpoint, {
  headers: {},
});
