import { useState, useRef, useEffect } from "react";
import Comments from "../../componets/cards/commentsNote/commentsNote";
import CommentSendBar from "../../componets/forms/commentSendBar/commentSendBar";
import Sidebar from "../../componets/UI/Sidebar/Sidebar";
import "./CommentManagement.css";
import { deleteComments, fetchComments } from "../../apis/comments/comments";
import PageHeader from "../../componets/UI/PageHeader/PageHeader";

function CommentManagement() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [comments, setComments] = useState<any>([]);
  const [currentIncidentId, setCurrentIncidentId] = useState(4);

  useEffect(()=>{
    setCurrentIncidentId(4);
  },[currentIncidentId])
  
  const buttons = [
    { label: "Back", onClick: () => console.log("Back") },
    { label: "End Session", onClick: () => console.log("End Session") },
  ];

  const stages = [
    { id: "Report", label: "Reports", ariaLabel: "View Reports" },
    { id: "Comments", label: "Comments", ariaLabel: "View Comments" },
  ];

  const loadComments = async () => {
  try {
    const response = await fetchComments(currentIncidentId);
    const content = Array.isArray(response.content) ? response.content : [];

    const mappedComments = content.map((item: any) => ({
      messageSender: item.user?.fullName || "Unknown",
      messageSenderUserName: item.user?.username || "Unknown",
      message: item.comments,
      dateAndTime: item.createdDate,
      commentId: item.id,
      role: "ROLE_ADMIN",
      attachmentfiles: Array.isArray(item.attachments)
        ? item.attachments.map((attachment: any) => attachment.attachmentURL)
        : [],
    }));

    setComments(mappedComments);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
  }
};


useEffect(() => {
  const interval = setInterval(() => {
    loadComments();
  }, 5000);
  return () => clearInterval(interval);
}, [currentIncidentId]);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    loadComments();
  }, [currentIncidentId]);


  return (
    <div className="default-page-main-container">
      <div className="default-page-left-div">
        <Sidebar />
      </div>

      <div className="default-page-right-div">
        <PageHeader
          title="Comment Management"
          stages={stages}
          buttons={buttons}
          showGridOption={false}
          showHeaderRow1Only={false}
          showSearchBar={false}
        />

        {comments.map((comment: any, index: number) => (
          <Comments
            key={index}
            messageSender={comment.messageSender}
            messageSenderUserName={comment.messageSenderUserName}
            message={comment.message}
            dateAndTime={comment.dateAndTime}
            role={comment.role}
            attachments={comment.attachmentfiles}
            onDeleteClick={async () => {
              const response = await deleteComments(currentIncidentId, comment.commentId);
              console.log(response);
              await loadComments();
            }
           }
            onEditClick={async () => {  
              console.log("edit Comment");
              await loadComments();
            }
          }
          />
        ))}

        <div className="footer-holder"></div>
        <div className="footer">
          <CommentSendBar 
          currentIncidentId={currentIncidentId}
          onMessageSent={loadComments}
          />
        </div>
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}

export default CommentManagement;
