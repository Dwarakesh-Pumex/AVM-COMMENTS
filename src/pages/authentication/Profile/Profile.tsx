import { useEffect, useState } from "react";
import "./Profile.css";
import PageHeader from "../../../componets/UI/PageHeader/PageHeader";
import ProfileIcon from '../../../assets/images/header/searchbar_profile-icon.svg';
import TextInput from "../../../componets/forms/inputs/TextInput/TextInput";
import { fetchUser } from "../../../apis/profile";
import type { Users } from "../../../types/users";
import Sidebar from "../../../componets/UI/Sidebar/Sidebar";




function Profile() {
 const [form, setForm] = useState<Pick<Users, 'fullName' | 'username' | 'phoneNo'>>({
    fullName: '',
    username : '',
    phoneNo : '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error,   setError]   = useState<string | null>(null);  

  /* ───────── fetch profile once ───────── */
  useEffect(() => {
    fetchUser()
      .then((u) => {
        setForm({ fullName: u.fullName, username: u.username, phoneNo: u.phoneNo });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


  if (loading) return <div className="profile-loading">Loading…</div>;
  if (error)   return <p className="text-red-600">{error}</p>;
  return (
    <div className="profile-main-container">
       <div className="profile-left-div">
        <Sidebar />
      </div>
      <div className="profile-right-div">
        <PageHeader
          title="Dashboard"
          showHeaderRow1Only={true}
        />
        <div className="profile-right-bottom-div">
          <div className="profile-container">        
             <div className="profile-user-row">
            <img src={ProfileIcon} alt="" className="profile-picture"  />
            <h2>{form.fullName || '—'}</h2>
          </div>   
            <form className="profile-form" noValidate>
             
              <div className="profile-form-group">
                <label htmlFor="current-password">NAME</label>
                <TextInput
                  id="fullName"
                  name="fullName"
                  placeholder="Name"
                  value={form.fullName}
                  disabled onChange={function (): void {
                    throw new Error("Function not implemented.");
                  } }                />
                
              </div>

              <div className="profile-form-group">
                <label htmlFor="new-password">EMAIL</label>               
                <TextInput
                  id="emailId"
                  name="emailId"
                  type="email"
                  placeholder="Email"
                  value={form.username}

                  disabled
                  autoComplete="email" onChange={function (): void {
                    throw new Error("Function not implemented.");
                  } }  />
                </div>               
             

              <div className="profile-form-group">
                <label htmlFor="confirm-password">PHONE</label>
                <div
                 
                >
              <TextInput
                    id="phoneNo"
                    name="phoneNo"
                    type="tel"
                    placeholder="Phone"
                    value={form.phoneNo}

                    disabled
                    autoComplete="tel" onChange={function (): void {
                      throw new Error("Function not implemented.");
                    } }              />
                </div>
     
                
              </div>

     
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;


