import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateComplainDto } from './dtos/create-complain.dto';
import { QueryComplainDto } from './dtos/query-complain.dto';
import { UpdateComplainDto } from './dtos/update-complain.dto';
import { Complain } from './interfaces/complain.interface';

@Injectable()
export class ComplainsService {
  constructor(@InjectModel('Complain') private readonly complainModel: Model<Complain>) {}

  async createComplain(createComplainDto: CreateComplainDto): Promise<Complain> {
    const complainSaved = await new this.complainModel(createComplainDto).save();
    
    if(!complainSaved) {
      throw new InternalServerErrorException('Problem to create a complain');
    }
    return complainSaved;
  }

  async findComplainByIdOrThrow(_id: string) : Promise<Complain> {
    const complain = this.complainModel.findById(_id); 

    if(!complain) {
      throw new NotFoundException('Complain not found');
    }
    return complain;
  }

  async findComplains(queryComplainDto: QueryComplainDto) : Promise<Array<Complain>> {
    /* need fix this, searching the solution... 
       query in nested document is not working
       ex: complainModel.find({'company._id': queryComplainDto.companyId})
    */
    const complainsFound = await this.complainModel.find();
    
    let complainsResult = complainsFound;
    
    if(queryComplainDto){
      if(queryComplainDto.cityId) {    
        complainsResult = complainsResult.filter(f => f.locale._id.toString() === queryComplainDto.cityId);
      }

      if(queryComplainDto.companyId) {
        complainsResult = complainsResult.filter(f => f.company._id.toString() === queryComplainDto.companyId);
      }
    }
    return complainsResult;
  }

  async countComplainsQuery(queryComplainDto: QueryComplainDto) : Promise<number> {
    return (await this.findComplains(queryComplainDto)).length;
  }

  async updateComplain(_id: string, updateComplainDto: UpdateComplainDto): Promise<void> {
    await this.complainModel.findByIdAndUpdate(_id, updateComplainDto);
  }
  
}
