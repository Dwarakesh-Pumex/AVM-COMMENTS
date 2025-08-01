
import './ProfileDropdownMenu.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface Props {
  show: boolean;
}

export default function ProfileDropdownMenu({ show }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('role');
    Cookies.remove('fullname');
    navigate('/login', { replace: true });
  };

  return (
    <div className={`profile-dropdown ${show ? 'show' : ''}`}>
      <div className="profile-dropdown-header">Account</div>
      <div className="profile-dropdown-divider"></div>
      <ul className="profile-dropdown-list">
        <li><a href="/profile">Profile</a></li>
        <li><a href="/change-password">Change Password</a></li>
        <li>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}