import "./CommentSendBar.css";
import TextInput from "../inputs/TextInput/TextInput";
import attachmentIcon from "../../../assets/images/comments/attachment.svg";
import { useRef, useState } from "react";
import { postComments } from "../../../apis/comments/comments";


type Message={
    currentIncidentId:number
    onMessageSent?:() => void;
}



function CommentSendBar({onMessageSent,currentIncidentId}: Message) {
  const [message, setMessage] = useState(""); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    console.log("clicked");
    fileInputRef.current?.click();
  };

  const handleSendClick = async () => {
    try {
      if (!message.trim()) {
        console.warn("Cannot send empty comment");
        return;
      }
      await postComments(currentIncidentId, message);

      setMessage("");
      if (onMessageSent) {
        onMessageSent();
    } 
    }
    
    catch (error) {
      console.error("Error creating message", error);
    }
  };

  return (
    <div className="comment-box">
    
      <button
        className="comment-box-attachment-button"
        onClick={handleBrowseClick}
      >
        <img src={attachmentIcon} alt="edit" />
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log("Selected file:", file.name);
          }
        }}
      />
      <TextInput
        name="comment"
        id="comment"
        placeholder="Add a Comment"
        type="text"
        required
        className="comment-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)} 
      />
      
      <button
  className="send-button"
  onClick={handleSendClick}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
    
  }}
>
        Send
      </button>
      <button
        className="cancel-button"
        onClick={() => setMessage("")}
      >
        Cancel
      </button>
    </div>
  );
}

export default CommentSendBar;
