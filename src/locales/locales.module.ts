import { Module } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { LocalesController } from './locales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LocaleSchema } from './interfaces/locale.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'Locale', schema: LocaleSchema}
  ])],
  providers: [LocalesService],
  controllers: [LocalesController]
})
export class LocalesModule {}
