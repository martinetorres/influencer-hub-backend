import { Body, Controller, Post } from '@nestjs/common';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscribe')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  subscribe(@Body() payload: SubscribeDto) {
    return this.subscriptionsService.subscribe(payload);
  }
}
