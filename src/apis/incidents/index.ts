import apiClient from '../../utils/axios';
import type { Incident, FilterParams, CustomerResponse, SiteResponse, OutcomeResponse, IncidentCategoryResponse, UploadAttachmentResponse, IncidentRequest } from '../../types/incidents';

interface IncidentResponse {
  status: number;
  message: string;
  
  data: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    content: Incident[];
  };
}

interface IncidentDetailResponse {
  status: number;
  message: string;
  data: Incident;
}

interface Customer {
  customerId: number;
  customerName: string;
}

interface Site {
  siteId: number;
  siteName: string;
  customer?: Customer;
}

interface Category {
  id: number;
  category: string;
}

interface Reporter {
  id: number;
  fullName: string;
}

interface FilterOptionsResponse {
  status: number;
  message: string;
  data: {
    customers: Customer[];
    sites: Site[];
    categories: Category[];
    reporters: Reporter[];
  };
}

export const fetchIncidents = async (
  page: number,
  pageSize: number,
  stages: string[],
  filters: FilterParams
): Promise<IncidentResponse> => {
  const payload = {
    customers: filters.customers?.map(Number) || [],
    sites: filters.sites?.map(Number) || [],
    categories: filters.categories?.map(Number) || [],
    reporters: filters.reporters?.map(Number) || [],
    priorities: filters.priorities || [],
    status: filters.status || [],
    dispatched: filters.dispatched || [],
    stages,
    startDate: filters.startDate || null,
    endDate: filters.endDate || null,
    searchKey: filters.searchKey || "",
    pageNo: page,
    pageSize,
  };

  const response = await apiClient.post<IncidentResponse>('/incidents/search', payload);
  return response.data;
};

export const fetchIncidentById = async (id: number): Promise<IncidentDetailResponse> => {
  const response = await apiClient.get<IncidentDetailResponse>(`/incidents/${id}`);
  return response.data;
};

export const fetchIncidentExport = async (id: number): Promise<Blob> => {
  const response = await apiClient.get(`/incidents/${id}/export`, {
    responseType: 'blob',
  });
  return response.data;
};

export const fetchFilterOptions = async (selectedFilters?: {
  customers?: string[];
  sites?: string[];
  categories?: string[];
  reporters?: string[];
}): Promise<FilterOptionsResponse> => {
  const customerPayload = {
    status: ["ACTIVE"],
    searchKey: "",
    siteIds: selectedFilters?.sites?.map(Number) || [],
    pageNo: 1,
    pageSize: 100,
  };

  const sitePayload = {
    status: ["ACTIVE"],
    searchKey: "",
    customerIds: selectedFilters?.customers?.map(Number) || [],
    pageNo: 1,
    pageSize: 100,
  };

  const reporterPayload = {
    status: ["ACTIVE"],
    searchKey: "",
    pageNo: 1,
    pageSize: 100,
  };

  const [customerResponse, siteResponse, categoryResponse, reporterResponse] = await Promise.all([
    apiClient.post<{ content: Customer[] }>('/customer/filter', customerPayload),
    apiClient.post<{ content: Site[] }>('/site/filter', sitePayload),
    apiClient.get<{ data: Category[] }>('/category'),
    apiClient.post<{ data: { content: Reporter[] } }>('/incidents/reporters', reporterPayload),
  ]);

  return {
    status: 200,
    message: "Filter options retrieved",
    data: {
      customers: customerResponse.data.content,
      sites: siteResponse.data.content,
      categories: categoryResponse.data.data,
      reporters: reporterResponse.data.data.content,
    },
  };
};

export const fetchCustomerCategories = async (
  status?: string[],
  searchKey?: string,
  siteIds?: number[],
  pageNo: number = 1,
  pageSize: number = 10
): Promise<CustomerResponse> => {
  const requestBody = {
    status: status || ["ACTIVE"],
    searchKey: searchKey || "",
    siteIds: siteIds || [],
    pageNo,
    pageSize,
  };

  const response = await apiClient.post<CustomerResponse>(
    "/customer/filter",
    requestBody
  );
  return response.data;
};

export const fetchSiteCategories = async (
  status?: string[],
  searchKey?: string,
  customerIds?: number[],
  pageNo: number = 1,
  pageSize: number = 10
): Promise<SiteResponse> => {
  const requestBody = {
    status: status || ["ACTIVE"],
    searchKey: searchKey || "",
    customerIds: customerIds || [],
    pageNo,
    pageSize,
  };

  const response = await apiClient.post<SiteResponse>(
    "/site/filter",
    requestBody
  );
  return response.data;
};

export const fetchOutcome = async (
  searchKey?: string
): Promise<OutcomeResponse> => {
  const response = await apiClient.get<OutcomeResponse>("/outcomes", {
    params: {
      searchKey: searchKey || "",
    },
  });
  return response.data;
};

export const fetchIncidentCategories = async (): Promise<IncidentCategoryResponse> => {
  const response = await apiClient.get<IncidentCategoryResponse>("/category");
  return response.data;
};

export const uploadIncidentAttachment = async (
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadAttachmentResponse> => {
  const formData = new FormData();
  formData.append("attachment", file);

  const response = await apiClient.post<UploadAttachmentResponse>(
    "/incidents/upload/attachment",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (e) => {
        if (e.total) {
          const pct = Math.round((e.loaded * 100) / e.total);
          onProgress?.(pct);
        }
      },
    }
  );

  return response.data;
};

export const createIncident = async (
  incidentData: IncidentRequest
): Promise<IncidentResponse> => {
  const response = await apiClient.post<IncidentResponse>(
    "/incidents",
    incidentData
  );
  return response.data;
};

export const updateIncident = async (
  incidentId: number,
  incidentData: IncidentRequest
): Promise<IncidentResponse> => {
  const response = await apiClient.put<IncidentResponse>(
    `/incidents/${incidentId}`,
    incidentData
  );
  return response.data;
};


export const deleteIncident = async (
  incidentId: number
): Promise<IncidentResponse> => {
  const response = await apiClient.put<IncidentResponse>(
    `/incidents/${incidentId}/delete`
  );
  return response.data;
};

export const approveIncident = async (
  incidentId: number
): Promise<IncidentResponse> => {
  const response = await apiClient.put<IncidentResponse>(
    `/incidents/${incidentId}/approve`
  );
  return response.data;
};

export const blockIncident = async (
  incidentId: number
): Promise<IncidentResponse> => {
  const requestBody = {
    status: "BLOCKED"
  };
  const response = await apiClient.put<IncidentResponse>(
    `/incidents/${incidentId}/status`,
    requestBody
  );
  return response.data;
};

export const unblockIncident = async (
  incidentId: number
): Promise<IncidentResponse> => {
  const requestBody = {
    status: "ACTIVE"
  };
  const response = await apiClient.put<IncidentResponse>(
    `/incidents/${incidentId}/status`,
    requestBody
  );
  return response.data;
};

