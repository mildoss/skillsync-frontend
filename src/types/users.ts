import { PaginationMeta } from "@/types/global";

export type UsersResponse = {
  data: User[];
  meta: PaginationMeta;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "APPLICANT" | "EMPLOYER";
  companyId: string | null;
  companyRole: "OWNER" | "RECRUITER" | "VIEWER" | null;
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
  languages: {
    id: string;
    name: string;
    slug: string;
  }[];
  createdAt: string;
  updatedAt: string;
};