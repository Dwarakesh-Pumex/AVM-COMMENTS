import { useState, useRef, useEffect } from "react";
import Comments from "../../componets/cards/commentsNote/commentsNote";
import CommentSendBar from "../../componets/forms/commentSendBar/commentSendBar";
import Sidebar from "../../componets/UI/Sidebar/Sidebar";
import "./CommentManagement.css";
import { fetchComments } from "../../apis/comments/comments";

function CommentManagement() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [comments, setComments] = useState<any>([]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  

  const loadComments = async () => {
    try {
      const incidentId = 4;
      const response = await fetchComments(incidentId);

      const mappedComments = response.content.map((item:any) =>({
          messageSender: item.user.fullname || "Unknown",
          messageSenderUserName: item.user.username || "Unknown",
          message: item.comments,
          dateAndTime: item.createdDate,
          role: "ROLE_ADMIN",
          attachmentfiles : item.attachments.map((attachment:any) => attachment.attachmentURL)
        }));
        
      setComments(mappedComments);

      console.log("Comments fetched:", response);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };
  loadComments();
  },[]);

  return (
    <div className="default-page-main-container">
      <div className="default-page-left-div">
        <Sidebar />
      </div>

      <div className="default-page-right-div">
        
        {comments.map((comment:any, index:number) => (
        <Comments
          key={index}
          messageSender={comment.messageSender}
          messageSenderUserName={comment.messageSenderUserName}
          message={comment.message}
          dateAndTime={comment.dateAndTime}
          role={comment.role}
          attachments={comment.attachmentfiles}
        />
       ))}

       
        <Comments
          messageSender="Arun George"
          messageSenderUserName="arun.george@pumexinfotech.com"
          message="We noticed unusual activity around 3 AM. The security cameras seem to have captured some movement near the east entrance."
          dateAndTime="2025-08-05T11:38:50.165Z"
          role="ROLE_ADMIN"
          attachments={["witness_proof.svg","another_proof.mov","https://avm-prod-bucket.s3.us-east-1.amazonaws.com/56a0908b-459f-4041-8d53-6fa6b4dda7c7-Snapshot (16).jpg","witness_statement.pdf"]}
        />

        <Comments
          messageSender="Arun George"
          messageSenderUserName="arun.george@pumexinfotech.com"
          message="We noticed unusual activity around 3 AM. The security cameras seem to have captured some movement near the east entrance."
          dateAndTime="2025-08-05T11:38:50.165Z"
          role="ROLE_ADMIN"
        />

        <Comments
          messageSender="Melanie"
          messageSenderUserName="melanie@americanvirtualmonitoring.com"
          message="We noticed unusual activity around 3 AM. The security cameras seem to have captured some movement near the east entrance.
                 We noticed unusual activity around 3 AM. The security cameras seem to have captured some movement near the east entrance."
          dateAndTime="2025-08-05T11:38:50.165Z"
          role="ROLE_SUPERVISOR"
        />

        <Comments
          messageSender="Revanth"
          messageSenderUserName="reyvanth@abilytics.com"
          message="We noticed unusual activity around 3 AM. The security cameras seem to have captured some movement near the east entrance.
                 We noticed unusual activity around 3 AM. The security cameras seem to have captured some movement near the east entrance."
          dateAndTime="2025-08-05T11:38:50.165Z"
          role="ROLE_CUSTOMER"
          attachments={["https://avm-prod-bucket.s3.us-east-1.amazonaws.com/56a0908b-459f-4041-8d53-6fa6b4dda7c7-Snapshot (16).jpg","Witness.pdf"]}
        />

        <Comments
          messageSender="Revanth"
          messageSenderUserName="reyvanth@abilytics.com"
          message="We noticed unusual activity around 3 AM. The security cameras seem to have captured some movement near the east entrance.
                 We noticed unusual activity around 3 AM. The security cameras seem to have captured some movement near the east entrance."
          dateAndTime="2025-08-05T11:38:50.165Z"
          role="ROLE_CUSTOMER"
        />

        

        <div className="footer-holder"></div>
        <div className="footer">
          <CommentSendBar />
        </div>
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}

export default CommentManagement;
