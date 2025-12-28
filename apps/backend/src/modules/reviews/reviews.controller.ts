import { Controller, Post, Body, Get, Param, Delete, UseGuards, Headers, BadRequestException, Logger } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';
import { AdminGuard } from '../admin/guards/admin.guard';
import { getUserIdFromEmail } from '../../common/utils/get-user-id';
import { PrismaService } from '../../prisma.service';

@Controller('reviews')
@UseGuards(RateLimitGuard, CsrfGuard)
export class ReviewsController {
  private readonly logger = new Logger(ReviewsController.name);

  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @RateLimit({ limit: 5, window: 3600 }) // 5 reviews per hour
  async createReview(
    @Body() body: { planId: string; userName: string; rating: number; comment: string },
    @Headers('x-user-email') userEmail: string | undefined,
  ) {
    if (!userEmail) {
      throw new BadRequestException('User email required');
    }

    const userId = await getUserIdFromEmail(this.prisma, userEmail);
    if (!userId) {
      throw new BadRequestException('User not found');
    }

    return this.reviewsService.createReview({
      planId: body.planId,
      userId,
      userName: body.userName,
      rating: body.rating,
      comment: body.comment,
    });
  }

  @Get('plan/:planId')
  async getReviewsByPlan(@Param('planId') planId: string) {
    return this.reviewsService.getReviewsByPlanId(planId);
  }

  @Get('all')
  async getAllReviews() {
    return this.reviewsService.getAllReviews();
  }
}

@Controller('admin/reviews')
@UseGuards(RateLimitGuard, CsrfGuard, AdminGuard)
export class AdminReviewsController {
  private readonly logger = new Logger(AdminReviewsController.name);

  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getAllReviews() {
    return this.reviewsService.getAllReviews();
  }

  @Delete(':id')
  @RateLimit({ limit: 20, window: 60 })
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}

