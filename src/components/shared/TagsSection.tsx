import { Badge } from "@/components/ui/badge";

type TagsSectionProps = {
  title: string;
  tags: { id: string; name: string }[];
};

export const TagsSection = ({ title, tags }: TagsSectionProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="px-3 py-1 text-sm">
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};
