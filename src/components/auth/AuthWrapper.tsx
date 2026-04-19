import Link from "next/link";
import { ReactNode } from "react";

type AuthWrapperProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
};

export const AuthWrapper = ({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}: AuthWrapperProps) => {
  return (
    <div className="bg-card w-full max-w-md rounded-2xl border p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>
      </div>

      {children}

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">{footerText}</span>
        <Link href={footerLink} className="text-primary font-semibold hover:underline">
          {footerLinkText}
        </Link>
      </div>
    </div>
  );
};
