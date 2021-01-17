import { BaseDto } from "./base.dto";

export interface UserDto extends BaseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  provider?: string;
}