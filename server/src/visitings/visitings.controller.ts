import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Header,
  Res,
} from '@nestjs/common';
import { VisitingsService } from './visitings.service';
import { CreateVisitingDto } from './dto/create-visiting.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { Response } from 'express';

@Controller()
export class VisitingsController {
  constructor(private readonly visitingsService: VisitingsService) {}

  @Roles('curator', 'praepostor')
  @UseGuards(RolesGuard)
  @Post('/report')
  create(@Body() createVisitingDto: CreateVisitingDto) {
    return this.visitingsService.create(createVisitingDto);
  }

  @Roles('curator', 'praepostor')
  @UseGuards(RolesGuard)
  @Get('/report')
  getReport(@Body() body) {
    return this.visitingsService.getReport(body.userJwtData);
  }

  //получение файла таблицы сводки
  @Roles('curator', 'praepostor')
  @UseGuards(RolesGuard)
  @Get('/summary')
  @Header('Content-Type', 'text/xlsx')
  async getSummary(@Query() query: any, @Res() res: Response, @Body() body) {
    let data = await this.visitingsService.getSummary(
      body.userJwtData,
      query.month,
      query.year,
    );
    return res
      .set('Content-Disposition', `attachment; filename=example.xlsx`)
      .send(data);
  }
}
