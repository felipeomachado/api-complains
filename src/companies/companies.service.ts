import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { Company } from './interfaces/company.interface';

@Injectable()
export class CompaniesService {

  constructor(@InjectModel('Company') private readonly companyModel: Model<Company>) {}

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    if(await this.findCompanyByName(createCompanyDto.name)) {
      throw new BadRequestException('Company already registered');
    } 

    const companySaved = await new this.companyModel(createCompanyDto).save();
    
    if(!companySaved) {
      throw new InternalServerErrorException('Problem to create a company');
    }
    return companySaved;
  }

  async findCompanyByName(name: string): Promise<Company> {
    return await this.companyModel.findOne({ name });
  }

  async findCompanyByIdOrThrow(_id: string) : Promise<Company> {
    const company = await this.companyModel.findOne({ _id });

    if(!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async findAllCompanies() : Promise<Company[]> {
    return await this.companyModel.find();
  }

  async updateCompany(_id: string, updateCompanyDto: UpdateCompanyDto): Promise<void> {
    const companyById = await this.findCompanyByIdOrThrow(_id);
    const companyByName = await this.findCompanyByName(updateCompanyDto.name);

    if(companyByName && (companyById._id.toString() != companyByName._id.toString())) {
      throw new BadRequestException('This name is already being used by another company');

    }

    await this.companyModel.findByIdAndUpdate(_id, updateCompanyDto);
  }
}
