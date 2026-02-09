import { Controller, Get, Param, Patch, Sse, UseGuards, MessageEvent } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('stream')
  stream(@GetUser() user: User): Observable<MessageEvent> {
    return this.notificationService.subscribe(user.id);
  }

  @Get()
  async getNotifications(@GetUser() user: User) {
    const notifications = await this.notificationService.getNotifications(user.id);
    return { notifications };
  }

  @Patch('read-all')
  async markAllAsRead(@GetUser() user: User) {
    await this.notificationService.markAllAsRead(user.id);
    return { message: 'All marked as read' };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    await this.notificationService.markAsRead(id);
    return { message: 'Marked as read' };
  }
}
