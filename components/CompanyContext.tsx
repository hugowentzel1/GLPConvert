"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CompanyInfo, getCompanyFromUrl } from "@/lib/company";

interface CompanyContextType {
  company: CompanyInfo;
  updateCompany: (newCompany: CompanyInfo) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<CompanyInfo>({
    companyHandle: "your-company",
    companyName: "Your Company",
    companyDomain: "your-company.out.sunspire.app",
  });

  useEffect(() => {
    // Get company info from current URL
    const currentCompany = getCompanyFromUrl(window.location.href);
    setCompany(currentCompany);

    // Listen for URL changes
    const handleUrlChange = () => {
      const newCompany = getCompanyFromUrl(window.location.href);
      setCompany(newCompany);
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const updateCompany = (newCompany: CompanyInfo) => {
    setCompany(newCompany);
  };

  return (
    <CompanyContext.Provider value={{ company, updateCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
