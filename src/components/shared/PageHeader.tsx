import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  fallbackLetter: string;
  badges?: (string | null | undefined)[];
};

export const PageHeader = ({
  title,
  subtitle,
  imageUrl,
  fallbackLetter,
  badges = [],
}: PageHeaderProps) => {
  const validBadges = badges.filter(Boolean) ;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="size-20 shrink-0 rounded-xl object-cover shadow-sm sm:size-24"
        />
      ) : (
        <div className="bg-muted-foreground flex size-20 shrink-0 items-center justify-center rounded-xl text-3xl font-bold text-white shadow-sm sm:size-24 sm:text-4xl">
          {fallbackLetter.toUpperCase()}
        </div>
      )}

      <div className="flex flex-col pt-1">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>

        {subtitle && <p className="text-muted-foreground mt-2 text-lg font-medium">{subtitle}</p>}
        
        {validBadges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {validBadges.map((badge, idx) => (
              <Badge key={idx} variant="secondary" className="px-3 py-1 font-medium">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
