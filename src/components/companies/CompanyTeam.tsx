import { Employee } from "@/types/companies";
import Image from "next/image";

export const CompanyTeam = ({ employees }: { employees: Employee[] }) => {
  if (!employees || employees.length === 0) return null;

  return (
    <section className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-xl font-bold tracking-tight">Our Team</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {employees.map((person) => (
          <div key={person.id} className="flex flex-col">
            {person.avatarUrl ? (
              <Image
                src={person.avatarUrl}
                alt={person.name}
                width={64}
                height={64}
                className="mb-3 size-16 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="bg-muted mb-3 flex size-16 items-center justify-center rounded-full text-xl font-bold">
                {person.name[0]}
              </div>
            )}
            <p className="line-clamp-1 text-sm font-semibold">{person.name}</p>
            {person.position && (
              <p className="text-muted-foreground line-clamp-1 text-xs">{person.position}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};