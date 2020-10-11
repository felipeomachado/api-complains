import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateLocaleDto } from './dtos/create-locale.dto';
import { UpdateLocaleDto } from './dtos/update-locale.dto';
import { LocalesService } from './locales.service';

@Controller('api/v1/locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService){}


  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createLocaleDto : CreateLocaleDto) {
    return await this.localesService.createLocale(createLocaleDto);
  }

  @Get()
  async findAll() {
    return await this.localesService.findAllLocales();
  }

  @Get('/:_id')
  async findById(@Param() params) {
    return await this.localesService.findLocaleByIdOrThrow(params._id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updateLocaleDto: UpdateLocaleDto,
    @Param('_id') _id: string
    ) {
    await this.localesService.updateLocale(_id, updateLocaleDto);
  }
}
