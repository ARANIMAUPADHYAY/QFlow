export type ServiceCategory =
  | "healthcare"
  | "banking"
  | "government"
  | "salon"
  | "education"
  | "customer-service";

export type ServiceStatus = "open" | "busy" | "closed";

export interface ServiceOffering {
  id: string;
  name: string;
  description: string;
  hours: string;
  averageServiceMinutes: number;
  queueLength: number;
  status: ServiceStatus;
}

export interface ServiceCentre {
  id: string;
  name: string;
  category: ServiceCategory;
  area: string;
  address: string;
  summary: string;
  openHours: string;
  services: ServiceOffering[];
}

export const categoryLabels: Record<ServiceCategory, string> = {
  healthcare: "Healthcare",
  banking: "Banks",
  government: "Government",
  salon: "Salons",
  education: "Education",
  "customer-service": "Customer service",
};
