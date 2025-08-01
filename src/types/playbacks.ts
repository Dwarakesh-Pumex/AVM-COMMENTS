export interface Playback {
  id: number;
  pbrId: number;
  pbrCreatedDate: string;
  pbrNo: string;
  pbrDate: string;
  pbrCategory: string | null;
  pbrPriority: number;
  pbrStatus: string;
  pbrStage: string;
  pbrApproverUsername: string | null;
  pbrCreatorUsername: string;
  pbrLocation: string;
  pbrRequestorUsername: string;
  pbrCustName: string;
  pbrCategories: string[] | null;
}

export interface PlaybackResponse {
  status: number;
  message: string;
  data: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    content: Playback[];
  };
}

export interface PlaybackFilterRequest {
  filter: string;
  stages: string[];
  pageNo: number;
  pageSize: number;
}


export interface PlaybackAttachment {
  id: number;
  pbrId: number | null;
  attachmentUrl: string;
  createdBy: number | null;
  createdDate: number[] | null;
  updatedBy: number | null;
  updatedDate: number[] | null;
  status: string;
}

export interface PlaybackRequest {
  id: number;
  createdDate: string;
  pbrCategory: string;
  pbrDate: string;
  siteId: number;
  requestorId: number;
  stage: 'PENDING' | 'PROCESSING' | 'APPROVED';
  pbrNo: string;
  priority: number;
  pbrRequestDetails: string;
  pbrSummary: string;
  createdBy: number | null;
  updatedBy: number | null;
  updatedDate: number[] | null;
  status: string;
  pbrAttachment: PlaybackAttachment[] | null;
  approvedBy: number | null;
  approvedDate: number[] | null;
  customerName: string;
  siteName: string;
  creatorName: string;
  
}