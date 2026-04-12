import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export type MetaItem = {
  icon: ReactNode;
  label: string;
  value: string | ReactNode;
};

type StickyActionCardProps = {
  primaryText: string;
  primarySubtext?: string;
  actionButtonLabel: string;
  onActionClick?: () => void;
  metaItems?: MetaItem[];
};

export const StickyActionCard = ({
  primaryText,
  primarySubtext,
  actionButtonLabel,
  onActionClick,
  metaItems = [],
}: StickyActionCardProps) => {
  return (
    <div className="bg-card sticky top-24 rounded-xl border p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-success text-2xl font-bold tracking-tight">{primaryText}</h3>
        {primarySubtext && (
          <p className="text-muted-foreground mt-1 text-sm font-medium">{primarySubtext}</p>
        )}
      </div>

      <Button
        size="lg"
        className="w-full cursor-pointer text-base font-semibold"
        onClick={onActionClick}
      >
        {actionButtonLabel}
      </Button>

      {metaItems.length > 0 && (
        <div className="mt-6 space-y-4 border-t pt-6">
          {metaItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="text-muted-foreground mt-0.5 shrink-0">{item.icon}</div>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  {item.label}
                </span>
                <span className="text-foreground text-sm font-medium">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
