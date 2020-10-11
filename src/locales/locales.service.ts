import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLocaleDto } from './dtos/create-locale.dto';
import { UpdateLocaleDto } from './dtos/update-locale.dto';
import { Locale } from './interfaces/locale.interface';

@Injectable()
export class LocalesService {
  constructor(@InjectModel('Locale') private readonly localeModel: Model<Locale>) {}
  
  async createLocale(createLocaleDto: CreateLocaleDto) : Promise<Locale> {
    if(await this.localeModel.findOne({cityId: createLocaleDto.cityId})) {
      throw new BadRequestException('Locale already registered');
    }

    const locale = await new this.localeModel(createLocaleDto).save();
    
    if(!locale) {
      throw new InternalServerErrorException('Problem to create a Locale');
    }

    return locale;
  }

  async findLocaleByIdOrThrow(_id: string) : Promise<Locale> {
    const locale = this.localeModel.findById(_id);

    if(!locale) {
      throw new NotFoundException('Locale not found');
    }
    return locale;
  }

  async findLocaleByCityId(cityId: number) : Promise<Locale> {
    return this.localeModel.findOne({cityId});
  }

  async findAllLocales() : Promise<Array<Locale>> {
    return await this.localeModel.find();
  }

  async updateLocale(_id: string, updateLocaleDto: UpdateLocaleDto): Promise<void> {
    const localeById = await this.findLocaleByIdOrThrow(_id);
    const localeByCityId = await this.findLocaleByCityId(updateLocaleDto.cityId);

    if(localeByCityId && (localeByCityId._id.toString() != localeById._id.toString())) {
      throw new BadRequestException('This cityId is already being used by another locale');
    }

    await this.localeModel.findByIdAndUpdate(_id, updateLocaleDto);
  }

}
