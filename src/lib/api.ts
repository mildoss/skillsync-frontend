import { VacanciesResponse, Vacancy } from "@/types/vacancies";
import { Dictionaries } from "@/types/dictionaries";
import { User, UsersResponse } from "@/types/users";
import { CompaniesResponse, CompanyDetail } from "@/types/companies";

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error: ${url}`);
  }

  return res.json();
};

export const getUsers = async (queryParams: URLSearchParams) =>
  fetchJson<UsersResponse>(`${process.env.BACKEND_URL}/users?${queryParams}`);

export const getUser = async (id: string) =>
  fetchJson<User>(`${process.env.BACKEND_URL}/users/${id}`);

export const getVacancies = async (queryParams: URLSearchParams) =>
  fetchJson<VacanciesResponse>(`${process.env.BACKEND_URL}/vacancies?${queryParams}`);

export const getVacancy = async (id: string) =>
  fetchJson<Vacancy>(`${process.env.BACKEND_URL}/vacancies/${id}`);

export const getCompanies = async (queryParams: URLSearchParams) =>
  fetchJson<CompaniesResponse>(`${process.env.BACKEND_URL}/companies?${queryParams}`);

export const getCompany = async (idOrSlug: string) =>
  fetchJson<CompanyDetail>(`${process.env.BACKEND_URL}/companies/${idOrSlug}`);

export const getCategories = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/categories`);
export const getSkills = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/skills`);
export const getLanguages = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/languages`);
export const getDomains = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/domains`);