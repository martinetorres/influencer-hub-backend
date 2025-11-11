import { Injectable } from '@nestjs/common';
import { wordpressPostRepository } from './infrastructure/wordpress/repositories/wordpress-posts.repository';

@Injectable()
export class PostsService {

  getPaginatedPosts(amount: number, after: string) {
    const posts = wordpressPostRepository.fetchPaginatedPosts(
      {first: amount, after: after}
    );
    return posts;
  }

  findOne(slug: string) {
    const post = wordpressPostRepository.fetchPostBySlug(slug);
    return post;
  }

  getAllSlugs(amount?: number) {
    const slugs = wordpressPostRepository.fetchAllSlugs(amount);
    return slugs;
  }
}
