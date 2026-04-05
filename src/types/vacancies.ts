export type VacanciesResponse = {
  data: Vacancy[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  }
}

export type Vacancy = {
  id: string;
  title: string;
  description: string;
  domain: string | null;
  experience: string | null;
  isActive: boolean;
  type: string;
  location: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  company: {
    name: string;
    logoUrl: string | null;
    companyType: string;
  };
  currency: string;
  salaryMin: number | null;
  salaryMax: number | null;
  skills: {
    id: string;
    name: string;
    slug: string;
  }[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
};
