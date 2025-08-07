import "./CommentsNote.css";
import editicon from "../../../assets/images/comments/tabler_edit.svg";
import deleteicon from "../../../assets/images/comments/ic_baseline-delete.svg";
import dateicon from "../../../assets/images/comments/date.svg";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import dateConvert from "../../../utils/dateConvert";
import FileCards from "../fileCards/fileCards";

type CommentsProps = {
  messageSender: string;
  messageSenderUserName: string;
  message: string;
  dateAndTime: string;
  role: string;
  attachments?: string[];
};

export default function Comments({
  messageSender,
  messageSenderUserName,
  message,
  dateAndTime,
  role,
  attachments,
}: CommentsProps) {
  const [roleColor, setRoleColor] = useState("");

  useEffect(() => {
    const loweCaseRole = role.toLowerCase();
    if (loweCaseRole === "role_admin") {
      setRoleColor("admin");
    } else if (loweCaseRole === "role_supervisor") {
      setRoleColor("supervisor");
    } else {
      setRoleColor("customer");
    }
  }, [role]);

  const isCurrentUser = messageSenderUserName === Cookies.get("username");

  return isCurrentUser ? (
    <div className="note-card-right" data-role={roleColor}>
      <div className="note-header">
        <strong>current: {messageSender}</strong>
        <div className="timestamp">
          <img src={dateicon} alt="dateicon" className="date-icon" />
          {dateConvert(dateAndTime)}
        </div>
      </div>
      <div className="note-body">
        <p>{message}</p>
      </div>
      <div className="note-footer">
        {attachments ? (
          <div className="note-attachments">
            {attachments?.map((fileName: any, index: number) => (
              <FileCards fileName={fileName} key={index} />
            ))}
          </div>
        ) : (
          <div></div>
        )}
        <div className="note-actions">
          <button>
            <img src={editicon} alt="edit" />
          </button>
          <button>
            <img src={deleteicon} alt="delete" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="note-card-left" data-role={roleColor}>
      <div className="note-header">
        <strong>other: {messageSender}</strong>
        <div className="timestamp">
          <img src={dateicon} alt="dateicon" className="date-icon" />
          {dateConvert(dateAndTime)}
        </div>
      </div>
      <div className="note-body">
        <p>{message}</p>
        <div className="note-footer">
          {attachments ? (
            <div className="note-attachments">
              {attachments?.map((fileName: any, index: number) => (
                <FileCards fileName={fileName} key={index} />
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
