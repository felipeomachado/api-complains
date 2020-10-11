import { Module } from '@nestjs/common';
import { ComplainsService } from './complains.service';
import { ComplainsController } from './complains.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplainSchema } from './interfaces/complain.schema';
import { LocaleSchema } from 'src/locales/interfaces/locale.schema';
import { CompanySchema } from 'src/companies/interfaces/company.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'Complain', schema: ComplainSchema},
    {name: 'Company', schema: CompanySchema},
    {name: 'Locale', schema: LocaleSchema},
  ])],
  providers: [ComplainsService],
  controllers: [ComplainsController]
})
export class ComplainsModule {}
