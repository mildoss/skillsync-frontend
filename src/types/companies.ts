import { PaginationMeta } from "@/types/global";

export type CompaniesResponse = {
  data: Companies[];
  meta: PaginationMeta;
};

export type Companies = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  companyType: string;
  _count: {
    vacancies: number;
    employees: number;
  }
}