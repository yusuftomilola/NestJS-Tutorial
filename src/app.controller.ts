import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsPublic } from './auth/decorators/public.decorator';

// @UseGuards(ThrottlerGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  @ApiOperation({
    summary: 'Homepage',
    description: 'The homepage of the application',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many get requests to the homepage. Kindly try again',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
