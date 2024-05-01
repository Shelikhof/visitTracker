import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitingDto } from './create-visiting.dto';

export class UpdateVisitingDto extends PartialType(CreateVisitingDto) {}
