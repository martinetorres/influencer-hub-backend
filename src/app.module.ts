import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [PostsModule, SubscriptionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
