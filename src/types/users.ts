import { PaginationMeta } from "@/types/global";

export type UsersResponse = {
  data: User[];
  meta: PaginationMeta;
};

export type User = {
  id: string;
  name: string;
  about: string | null;
  avatarUrl: string | null;
  position: string | null;
  experience: number | null;
  workFormats: string[];
  employmentTypes: string[];
  location: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  company: {
    name: string;
    logoUrl: string | null;
    companyType: string;
  } | null;
  skills: {
    id: string;
    name: string;
    slug: string;
  }[];
  languages: string[] | null;
  createdAt: string;
  updatedAt: string;
}