import { ReactNode } from "react";

export const FilterSection = ({title, children}: {title: string, children: ReactNode}) => (
  <div className="space-y-3">
    <h4 className="text-sm font-medium leading-none">{title}</h4>
    {children}
  </div>
)