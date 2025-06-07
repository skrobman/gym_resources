import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ProfileDto } from './profile.dto';

export class ChangeProfileDto extends PartialType(
    OmitType(ProfileDto, ['name', 'surname', 'gender'] as const)
) {}
