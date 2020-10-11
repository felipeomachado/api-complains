import { Document } from "mongoose";
import { Company } from "src/companies/interfaces/company.interface";
import { Locale } from "src/locales/interfaces/locale.interface";

export interface Complain extends Document {
  readonly _id: string;
  title: string;
  description: string;
  locale: Locale;
  company: Company;
}

