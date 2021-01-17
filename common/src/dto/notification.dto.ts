import { BaseDto } from "./base.dto";

export enum NotificationType {
  Message = 0,
  Event = 1
}

export interface NotificationDto extends BaseDto {
  to?: string;
  payload?: any;
  type: NotificationType;
  category?: string;
  name: string;
}
