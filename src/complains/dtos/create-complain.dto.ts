import { IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { Company } from "src/companies/interfaces/company.interface";
import { Locale } from "src/locales/interfaces/locale.interface";


export class CreateComplainDto {
  
  @IsNotEmpty()
  readonly title: string;
  
  readonly description: string;
  
  @IsNotEmptyObject()
  readonly locale: Locale;
  
  @IsNotEmptyObject()
  readonly company: Company;
}