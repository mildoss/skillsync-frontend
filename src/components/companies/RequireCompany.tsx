"use client";

import { User } from "@/types/users";
import { ReactNode, useState } from "react";
import { ArrowLeft, Building, ListTodo, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateCompanyForm } from "@/components/companies/CreateCompanyForm";
import { JoinCompanyForm } from "@/components/companies/JoinCompanyForm";
import { MyJoinRequests } from "@/components/companies/MyJoinRequests";

type RequireCompanyProps = {
  user: User;
  children: ReactNode;
};

export const RequireCompany = ({ user, children }: RequireCompanyProps) => {
  const [view, setView] = useState<"select" | "create" | "join" | "requests">("select");

  if (user.role === "APPLICANT" || user.companyId) {
    return <>{children}</>;
  }

  if (view === "select") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="bg-primary/10 mb-6 rounded-full p-4">
          <Building className="text-primary size-10" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome to SkillSync Business
        </h2>
        <p className="text-muted-foreground mb-10 max-w-lg text-lg">
          To start posting vacancies and hiring candidates, you need to create a company profile or
          join an existing team.
        </p>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            onClick={() => setView("create")}
            className="hover:border-primary/50 group flex cursor-pointer flex-col items-center rounded-2xl border p-8 transition-colors"
          >
            <div className="bg-muted group-hover:bg-primary/10 mb-4 rounded-full p-4 transition-colors">
              <Building className="text-muted-foreground group-hover:text-primary size-8 transition-colors" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Create Company</h3>
            <p className="text-muted-foreground text-sm">
              I am a founder or the first HR on the platform.
            </p>
          </div>

          <div
            onClick={() => setView("join")}
            className="hover:border-primary/50 group flex cursor-pointer flex-col items-center rounded-2xl border p-8 transition-colors"
          >
            <div className="bg-muted group-hover:bg-primary/10 mb-4 rounded-full p-4 transition-colors">
              <Search className="text-muted-foreground group-hover:text-primary size-8 transition-colors" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Join Team</h3>
            <p className="text-muted-foreground text-sm">
              My company is already registered on SkillSync.
            </p>
          </div>

          {user.pendingCompanyIds && user.pendingCompanyIds.length > 0 && (
            <div
              onClick={() => setView("requests")}
              className="bg-primary/5 hover:border-primary/50 group flex cursor-pointer items-center justify-between rounded-2xl border px-6 py-4 transition-colors sm:col-span-2"
            >
              <div className="flex items-center gap-4">
                <div className="bg-background rounded-full p-2">
                  <ListTodo className="text-primary size-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-foreground font-bold">My Sent Requests</h3>
                  <p className="text-muted-foreground text-xs">
                    You have {user.pendingCompanyIds.length} pending request(s)
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="pointer-events-none">
                View Status
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === "create") {
    return (
      <ViewWrapper title="Register new company" onBack={() => setView("select")} maxWidth="max-w-xl">
        <CreateCompanyForm />
      </ViewWrapper>
    );
  }

  if (view === "join") {
    return (
      <ViewWrapper title="Find your company" onBack={() => setView("select")}>
        <JoinCompanyForm user={user} />
      </ViewWrapper>
    );
  }

  if (view === "requests") {
    return (
      <ViewWrapper title="My Join Requests" onBack={() => setView("select")}>
        <MyJoinRequests />
      </ViewWrapper>
    );
  }

  return null;
};


const ViewWrapper = ({
  title,
  onBack,
  maxWidth = "max-w-2xl",
  children,
  }: {
  title: string;
  onBack: () => void;
  maxWidth?: string;
  children: ReactNode;
}) => (
  <div className={`mx-auto ${maxWidth}`}>
    <Button variant="ghost" onClick={onBack} className="mb-6 -ml-4">
      <ArrowLeft className="mr-2 size-4" /> Back
    </Button>
    <h2 className="mb-6 text-2xl font-bold">{title}</h2>
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      {children}
    </div>
  </div>
);