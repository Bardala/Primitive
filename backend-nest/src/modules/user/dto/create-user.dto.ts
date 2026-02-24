import { RegisterDto } from 'src/modules/auth/dto/register.dto';

export class CreateUserDto extends RegisterDto {
  readonly id!: string;
  timestamp!: number;
  declare password: string; // Hashed password
}
