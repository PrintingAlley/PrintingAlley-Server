import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: '유저 정보',
    type: User,
  })
  user: User;
}
