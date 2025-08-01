import CommentSendBar from "../../componets/UI/CommentSendBar/CommentSendBar";
import Sidebar from "../../componets/UI/Sidebar/Sidebar";
import "./CommentManagement.css";
function CommentManagement() {
  return (
    <div className="default-page-main-container">
      <div className="default-page-left-div">
        <Sidebar />
      </div>
      <div className="default-page-right-div">
        <div className="footer">
        <CommentSendBar/>
        </div>
      </div>
      
    </div>
  );
}

export default CommentManagement;
