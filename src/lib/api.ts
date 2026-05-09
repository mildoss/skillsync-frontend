import { VacanciesResponse, Vacancy } from "@/types/vacancies";
import { Dictionaries } from "@/types/dictionaries";
import { User, UsersResponse } from "@/types/users";
import { CompaniesResponse, CompanyDetail } from "@/types/companies";
import { getAuthHeaders } from "@/lib/server-utils";
import { Application } from "@/types/application";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const fetchJson = async <T>(url: string, retries = 2): Promise<T> => {
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
    }

    const data: unknown = await res.json();

    return data as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (retries > 0) {
      console.warn(`⚠️ Request failed: ${message}. Retrying in 500ms...`);
      await delay(500);
      return fetchJson<T>(url, retries - 1);
    }

    console.error(`❌ Final fetch error for ${url}:`, message);
    throw new Error(`Failed after retries: ${message}`);
  }
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

export const getMe = async (): Promise<User | null> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/users/me`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export const getMyApplications = async (): Promise<Application[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/applications/my`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

export const getMyVacancies = async (): Promise<Vacancy[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/vacancies/my`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

export const getVacancyApplications = async (vacancyId: string): Promise<Application[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/applications/vacancy/${vacancyId}`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};