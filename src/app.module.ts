import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesModule } from './companies/companies.module';
import { ComplainsModule } from './complains/complains.module';
import { LocalesModule } from './locales/locales.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:6t9VwUwqD89nriW@clusterreclameaqui.krwdl.mongodb.net/complains?retryWrites=true&w=majority',
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
    ),
    CompaniesModule,
    ComplainsModule,
    LocalesModule,
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
