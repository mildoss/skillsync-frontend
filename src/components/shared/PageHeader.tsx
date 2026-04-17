import { Badge } from "@/components/ui/badge";
import { CustomAvatar } from "@/components/shared/CustomAvatar";

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
      <CustomAvatar imageUrl={imageUrl} fallbackText={fallbackLetter} size="lg" />

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
