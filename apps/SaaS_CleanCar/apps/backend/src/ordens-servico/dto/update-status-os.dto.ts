import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusOS } from '@prisma/client';

export class UpdateStatusOsDto {
    @IsEnum(StatusOS)
    @IsNotEmpty()
    status: StatusOS;
}
