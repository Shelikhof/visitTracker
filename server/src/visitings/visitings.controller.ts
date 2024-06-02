import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Header,
  Res,
  Param,
} from '@nestjs/common';
import { VisitingsService } from './visitings.service';
import { CreateVisitingDto } from './dto/create-visiting.dto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { Response } from 'express';
import { log } from 'console';

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
  @Get('/report/:id')
  getReport(@Param('id') id: string) {
    return this.visitingsService.getReport(id);
  }

  //получение файла таблицы сводки
  @Roles('curator', 'praepostor')
  @UseGuards(RolesGuard)
  @Get('/summary')
  @Header('Content-Type', 'text/xlsx')
  async getSummaryTable(
    @Query() query: any,
    @Res() res: Response,
    @Body() body,
  ) {
    let data = await this.visitingsService.generateSummaryTable(
      query.groupId,
      query.month,
      query.year,
      query.type,
    );
    return res
      .set('Content-Disposition', `attachment; filename=example.xlsx`)
      .send(data);
  }

  @Roles('curator', 'praepostor')
  @UseGuards(RolesGuard)
  @Get('/summaryData')
  getSummary(@Query() query: any, @Body() body) {
    return this.visitingsService.getSummary(
      query.groupId,
      query.month,
      query.year,
      query.type,
    );
  }
}
