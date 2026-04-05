'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export const ExpandableText = ({ text, maxLength = 100, className }: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  if (text.length <= maxLength) {
    return <p className={cn("text-muted-foreground", className)}>{text}</p>;
  }

  return (
    <div className={className}>
      <p className={cn("text-muted-foreground", isExpanded ? "whitespace-pre-line" : "line-clamp-2")}>
        {text}
      </p>

      <button
        className="text-primary hover:text-primary-hover mt-2 cursor-pointer text-xs font-semibold hover:underline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? "Hide" : "Show more"}
      </button>
    </div>
  );
};