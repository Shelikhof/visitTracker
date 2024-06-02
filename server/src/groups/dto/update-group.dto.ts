import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}

export class EditGroupDto {
  name: string;
  students: {
    id: string;
    fullName: string;
    isIP: boolean;
  }[];
  praepostors: {
    id: string;
    fullName: string;
    username: string;
  }[];
  groupId: string;
  isBudget: boolean;
}
