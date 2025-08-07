import "./DefaultPage.css";
import Sidebar from "../../componets/UI/Sidebar/Sidebar";

function AdminDashboard() {


  return (
    <div className="default-page-main-container">
      <div className="default-page-left-div">
        <Sidebar />
      </div>
      <div className="default-page-right-div">
        <span>The page is not accessible!</span>
      </div>
    </div>
  );
}

export default AdminDashboard;