import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('slugs')
  getAllSlugs(
    @Query('amount', ParseIntPipe) amount?: string,
  ) {
    return this.postsService.getAllSlugs(amount ? parseInt(amount) : undefined);
  }

  @Get('')
  getPaginatedPosts(
    @Query('amount', ParseIntPipe) amount: string,
    @Query('after') after: string
  ) {
    return this.postsService.getPaginatedPosts(parseInt(amount), after);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }

}
