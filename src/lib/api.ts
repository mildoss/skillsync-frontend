import { VacanciesResponse } from "@/types/vacancies";
import { Dictionaries } from "@/types/dictionaries";
import { UsersResponse } from "@/types/users";

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error: ${url}`);
  }

  return res.json();
};

export const getUsers = async (queryParams: URLSearchParams) =>
  fetchJson<UsersResponse>(`${process.env.BACKEND_URL}/users?${queryParams}`);

export const getVacancies = async (queryParams: URLSearchParams) =>
  fetchJson<VacanciesResponse>(`${process.env.BACKEND_URL}/vacancies?${queryParams}`);

export const getCategories = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/categories`);
export const getSkills = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/skills`);
export const getLanguages = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/languages`);
export const getDomains = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/domains`);