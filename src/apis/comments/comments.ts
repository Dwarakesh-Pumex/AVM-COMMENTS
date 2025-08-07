import apiClient from "../../utils/axios";

interface Comments {
    incidentId: number;
    pageNo: number;
    pageSize: number;
    content:[];
}

export const fetchComments = async (
    incidentId: number,
    pageNo: number = 1,
    pageSize: number = 1
): Promise<Comments> => {
    const response = await apiClient.get<Comments>(
        `/incidents/${incidentId}/comment`,
        {
            params: {
                pageNo,
                pageSize
            }
        }
    );
    return response.data;
};
