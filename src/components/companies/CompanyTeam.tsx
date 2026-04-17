import { Employee } from "@/types/companies";
import { CustomAvatar } from "@/components/shared/CustomAvatar";

export const CompanyTeam = ({ employees }: { employees: Employee[] }) => {
  if (!employees || employees.length === 0) return null;

  return (
    <section className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-xl font-bold tracking-tight">Our Team</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {employees.map((person) => (
          <div key={person.id} className="flex flex-col">
            <CustomAvatar
              className="mb-3 rounded-full"
              imageUrl={person.avatarUrl}
              fallbackText={person.name}
              size="md"
            />
            <p className="mt-2 line-clamp-1 text-sm font-semibold">{person.name}</p>
            {person.position && (
              <p className="text-muted-foreground line-clamp-1 text-xs">{person.position}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};