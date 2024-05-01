import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { EditGroupDto, UpdateGroupDto } from './dto/update-group.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { log } from 'console';
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  //создание группы
  @Post('/create')
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  //получение информации о группе для куратора (студенты, название старосты)
  @Roles('curator')
  @UseGuards(RolesGuard)
  @Get('/info')
  getInfo(@Body() body: any) {
    return this.groupsService.getInfo(body.userJwtData.id);
  }

  //изменение информации о группе для куратора
  @Roles('curator')
  @UseGuards(RolesGuard)
  @Patch('/edit')
  editGroup(@Body() dto: EditGroupDto) {
    return this.groupsService.editGroup(dto);
  }

  //получение групп
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.groupsService.findAll(query.page, query.limit, query.q);
  }

  //получение группы по id
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    log(id);
    return this.groupsService.findOne(id);
  }

  //изменение группы для админа
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  //удаление группы
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
