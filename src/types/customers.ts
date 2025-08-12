export interface PageableResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  content: T[];
}

export interface Customers {
  [key: string]: unknown;
  id: number;
  customerName: string;
  custName: string;
  email: string;
  phoneNo: number;
  address1: string;
  address2: string;
  postalCode: number;
  stateId:number;
  createdBy: number | null; 
  createdDate: number[] | null;
  updatedBy: number | null;
  updatedDate: number[] | null;
  status: string;
  customerId: string;
  
}
