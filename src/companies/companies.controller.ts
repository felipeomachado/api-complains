import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@Controller('api/v1/companies')
export class CompaniesController {

  constructor(private readonly companiesService: CompaniesService){}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createCompanyDto : CreateCompanyDto) {
    return await this.companiesService.createCompany(createCompanyDto);
  }

  @Get('/:_id')
  async findById(@Param() params) {
    return await this.companiesService.findCompanyByIdOrThrow(params._id)
  }

  @Get()
  async findAll() {
    return await this.companiesService.findAllCompanies();
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Param('_id') _id: string
    ) {
    await this.companiesService.updateCompany(_id, updateCompanyDto)
  }

}
