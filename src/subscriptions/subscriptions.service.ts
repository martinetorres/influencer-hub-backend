import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { API } from '../posts/infrastructure/wordpress/wordpress.api-client';
import { SubscribeDto } from './dto/subscribe.dto';

type SubscribeResponse = {
  success?: boolean;
  message?: string;
};

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  async subscribe(payload: SubscribeDto): Promise<SubscribeResponse> {
    try {
      const response = await fetch(API.ENDPOINTS.SUBSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as SubscribeResponse;

      if (!response.ok || data.success === false) {
        throw new HttpException(
          data?.message ?? 'Failed to subscribe user',
          response.status || HttpStatus.BAD_GATEWAY,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Error) {
        this.logger.error('Unexpected error while subscribing user', error.stack);
      } else {
        this.logger.error('Unexpected error while subscribing user');
      }

      throw new HttpException('Unexpected error while subscribing user', HttpStatus.BAD_GATEWAY);
    }
  }
}
