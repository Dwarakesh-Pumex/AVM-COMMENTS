/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Customers } from "./customers";
import type { Sites } from "./sites";

export interface FilterResponse {
  status: number;
  message: string;
  data: {
    customers: string[];
    sites: string[];
    categories: string[];
    reporters: string[];
    priorities: number[] | null;
    status: string[];
    dispatched: boolean[];
    stages: string[] | null;
    startDate: string | null;
    endDate: string | null;
    pageNo: number;
    pageSize: number;
    content: Incident[];
  };
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterParams {
  customers?: string[];
  sites?: string[];
  categories?: string[];
  reporters?: string[];
  priorities?: string[];
  status?: string[];
  dispatched?: string[];
  startDate?: string;
  endDate?: string;
  searchKey?: string;
}

export interface User {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  customerId: number;
  customerName: string;
  custName: string;
}

export interface Site {
  id: number;
  siteName: string;
  customer?: Customer;
  email?: string | null;
  phoneNo?: string | null;
  address1?: string | null;
  address2?: string | null;
  postalCode?: string | null;
  state?: string | null;
  createdBy?: number | null;
  createdDate?: string | null;
  updatedBy?: number | null;
  updatedDate?: string | null;
  status?: string | null;
  creator?: User | null;
  updator?: User | null;
}

export interface Category {
  id: number;
  category: string;
  details: string;
}

export interface Attachment {
  id: number;
  attachmentURL: string;
  createdBy: number;
  createdDate: string;
  updatedBy: number | null;
  updatedDate: string | null;
  status: string;
}

export interface Incident {
  id?: number;
  incidentId?: string;
  incidentNo?: string;
  incidentDate: string;
  siteName?: string;
  customerName?: string;
  category?: string;
  incidentCategories?: Category[];
  categories?: Category[];
  incidentStatus?: string;
  incidentPriority?: number;
  incidentCreatorFullName?: string;
  incidentCreatedDate?: string;
  customer?: string;
  userId?: number;
  siteId?: number;
  stage?: string;
  talkDown?: boolean;
  policeDispatched?: boolean;
  policeReference?: string;
  outcome?: string;
  priority?: number;
  summary?: string;
  approvedBy?: number | null;
  createdBy?: number;
  createdDate?: string | null;
  updatedBy?: number | null;
  updatedDate?: string | null;
  status?: string;
  creator?: User;
  updator?: User;
  approver?: User | null;
  approvedDate?: string | null;
  site?: Site;
  incidentEndPriority?: string;
  incidentAttachments?: Attachment[];
  deletedIncidentAttachments?: Attachment[] | null;
}

export interface CustomerResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  content: Customers[];
}

export interface SiteResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  content: Sites[];
}

export interface Outcome {
  id: number;
  outcome: string;
}

export interface OutcomeResponse {
  status: number;
  message: string;
  data: Outcome[];
}

export interface IncidentCategory {
  id: number;
  category: string;
  categoryPriority: string;
  details: string | null;
}

export interface IncidentCategoryResponse {
  status: number;
  message: string;
  data: IncidentCategory[];
}

export interface UploadAttachmentResponse {
  url: any;
  location: any;
  fileUrl: any;
    
  message: string;    
}

export interface IncidentAttachment {
  attachmentURL: string;
  status: string;
}

export interface IncidentCategoryRef {
  id: number;
}

export interface IncidentRequest {
  categories: IncidentCategoryRef[];
  incidentDate: string;
  talkDown: boolean;
  policeDispatched: boolean;
  policeReference: string;
  outcome: string;
  priority: number;
  summary: string;
  stage: string;
  status: string;
  site: {
    id: number;
  };
  incidentAttachments: IncidentAttachment[];
}

export interface IncidentResponse {
  id: number;
  categories: IncidentCategory[];
  incidentDate: string;
  stage: string;
  talkDown: boolean;
  policeDispatched: boolean;
  policeReference: string;
  outcome: string;
  priority: number;
  summary: string;
  site: {
    id: number;
    name?: string;
  };
  incidentAttachments: IncidentAttachment[];
}