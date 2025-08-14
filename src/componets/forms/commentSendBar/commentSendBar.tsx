import "./CommentSendBar.css";
import TextInput from "../inputs/TextInput/TextInput";
import attachmentIcon from "../../../assets/images/comments/attachment.svg";
import { useEffect, useRef, useState } from "react";
import { postComments } from "../../../apis/comments/comments";
import { uploadIncidentAttachment } from "../../../apis/incidents";
import { updateComment } from "../../../apis/comments/comments";
import extractNameAfterLastDash from "../../../utils/urlExtraction";

type Message = {
  currentIncidentId: number;
  editCommentId?: number;
  initialMessage?: string;
  initialAttachments?: string[];
  onCancelEdit?: () => void;
  onMessageSent?: () => void;
};

function CommentSendBar({
  onMessageSent,
  currentIncidentId,
  editCommentId,
  initialMessage,
  initialAttachments,
  onCancelEdit,
}: Message) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [sendButtonState, setSendButtonState] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage.substring(initialMessage.lastIndexOf(":") + 1));
    }
    if (initialAttachments) {
      setSelectedUrls(initialAttachments);
    }
  }, [initialMessage, initialAttachments]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);

      newFiles.forEach((file) => {
        console.log("Selected file:", file.name);
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleRemoveUrl = (index: number) => {
    setSelectedUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const handleSendClick = async () => {
    try {
      setSendButtonState(true);

      if (!message.trim()) {
        console.warn("Cannot send empty comment");

        return;
      }

      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await uploadIncidentAttachment(file);
        uploadedUrls.push(String(url));
      }

      const allUrls = [...uploadedUrls, ...(selectedUrls || [])];

      console.log(allUrls);

      console.log(currentIncidentId);

      console.log(editCommentId);

      console.log(message);

      if (editCommentId) {
        await updateComment(
          currentIncidentId,
          editCommentId,
          `Edited: ${message}`,
          "ACTIVE",
          "PENDING",
          allUrls
        );
      } else {
        await postComments(
          currentIncidentId,
          message,
          "ACTIVE",
          "PENDING",
          allUrls
        );
      }

      setMessage("");
      setSelectedFiles([]);
      setSelectedUrls([]);
      if (onCancelEdit) onCancelEdit();
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error("Error creating/updating message", error);
    } finally {
      setSendButtonState(false);
    }
  };

  return (
    <div>
      {(selectedFiles.length > 0 || selectedUrls.length > 0) && (
        <div className="comment-attachments">
          <button
            type="button"
            className="remove-attachment"
            onClick={() => {
              setSelectedFiles([]);
              setSelectedUrls([]);
            }}
          >
            Clear All
          </button>
          <ul className="list">
            {selectedFiles.map((file, index) => (
              <li className="attachment" key={`file-${index}`}>
                {file.name}
                <button
                  type="button"
                  className="remove-attachment"
                  onClick={() => handleRemoveFile(index)}
                >
                  ✕
                </button>
              </li>
            ))}
            {selectedUrls.map((url, index) => (
              <li className="attachment" key={`url-${index}`}>
                {extractNameAfterLastDash(String(url))}
                <button
                  type="button"
                  className="remove-attachment"
                  onClick={() => handleRemoveUrl(index)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="comment-box">
        <button
          className="comment-box-attachment-button"
          onClick={handleBrowseClick}
        >
          <img src={attachmentIcon} alt="edit" />
        </button>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
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
          disabled={sendButtonState}
          onClick={handleSendClick}
        >
          {editCommentId ? "Update" : "Send"}
        </button>

        <button
          className="cancel-button"
          onClick={() => {
            setMessage("");
            setSelectedFiles([]);
            setSelectedUrls([]);
            if (editCommentId && onCancelEdit) {
              onCancelEdit();
            }
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CommentSendBar;
