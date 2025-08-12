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
    pageSize: number = 10
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



export const postComments = async (
    incidentId: number,
    comments: string,
    status: string = "ACTIVE",
    stage: string = "PENDING",
    attachmentURLs: string[] = [],

): Promise<Comments> => {
    const attachments = attachmentURLs.map(url => ({
        status: "ACTIVE",
        attachmentURL: url
    }));

    const requestBody = {
        comments,
        status,
        stage,
        attachments
    };

    const response = await apiClient.post<Comments>(
        `/incidents/${incidentId}/comment`,
        requestBody
    );

    return response.data;
};


export const deleteComments = async (
    incidentId: number,
    commentId: number,
):Promise<Comments> =>{
    const response = await apiClient.delete<Comments>(
        `/incidents/${incidentId}/comment/${commentId}`,
    );
    return response.data;
}


