import apiClient from '../../utils/axios';

interface PlaybackFilterRequest {
  filter: string;
  stages: string[];
  pageNo: number;
  pageSize: number;
}

interface Playback {
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

interface PlaybackResponse {
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

export const fetchPlaybacks = async (params: PlaybackFilterRequest): Promise<PlaybackResponse> => {
  try {
    const response = await apiClient.post<PlaybackResponse>('/playbackrequest/filter/search', {
      filter: 'all',
      stages: params.stages,
      pageNo: params.pageNo,
      pageSize: params.pageSize,
    });
    return response.data;
  } catch {
    throw new Error('Failed to fetch playback requests');
  }
};