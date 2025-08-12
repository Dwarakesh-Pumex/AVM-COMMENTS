import "./adminDashboard.css";
import Sidebar from "../../componets/UI/Sidebar/Sidebar";

function adminDashboard() {


  return (
    <div className="default-page-main-container">
      <div className="default-page-left-div">
        <Sidebar />
      </div>
      <div className="default-page-right-div">
        <span>The page is accessible!</span>
      </div>
    </div>
  );
}

export default adminDashboard;