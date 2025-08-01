export interface CustomerSiteMapping {
  customerId: number;
  customerName: string;
  siteId: number;
  siteName: string;
}

export interface Users {
  id: number;
  emailId: string;
  username: string;
  role: string;
  fullName: string;
  phoneNo: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  customerSiteMappings: CustomerSiteMapping[];
}
