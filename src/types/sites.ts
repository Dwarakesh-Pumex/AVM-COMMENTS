export interface Sites {
  id: number;
  siteName: string;
  customerId: number;
  email: string;
  phoneNo: string;
  address1: string;
  address2: string;
  postalCode: string;
  stateId: number;
  createdBy: number;
  createdDate: string; 
  updatedBy: number;
  updatedDate: string; 
  status: 'ACTIVE' | 'INACTIVE'; 
  customerName: string;
  stateName: string;
  siteId: string;
}

