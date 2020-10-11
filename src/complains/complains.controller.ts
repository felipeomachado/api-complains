import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ComplainsService } from './complains.service';
import { CreateComplainDto } from './dtos/create-complain.dto';
import { QueryComplainDto } from './dtos/query-complain.dto';
import { UpdateComplainDto } from './dtos/update-complain.dto';

@Controller('api/v1/complains')
export class ComplainsController {

  constructor(private readonly complainsService: ComplainsService){}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createComplainDto : CreateComplainDto) {
    return await this.complainsService.createComplain(createComplainDto);
  }

  @Get()
  async find(@Query() queryComplainDto: QueryComplainDto) {
    return await this.complainsService.findComplains(queryComplainDto);
  }

  @Get('/count')
  async count(@Query() queryComplainDto: QueryComplainDto) {
    return await this.complainsService.countComplainsQuery(queryComplainDto);
  }

  @Get('/:_id')
  async findById(@Param() params) {
    return await this.complainsService.findComplainByIdOrThrow(params._id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updateComplainDto: UpdateComplainDto,
    @Param('_id') _id: string
    ) {
    await this.complainsService.updateComplain(_id, updateComplainDto);
  }
}
