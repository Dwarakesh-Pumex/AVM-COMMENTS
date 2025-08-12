import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import Cookies from 'js-cookie';

import Logo from '../../../assets/images/logo.svg';
import DashboardIcon from '../../../assets/images/sidebar/sidebar_dashboard.svg';
import DashboardIconHover from '../../../assets/images/sidebar/sidebar_dashboard_hover.svg';
import DashboardIconSelected from '../../../assets/images/sidebar/sidebar_dashboard_selected.svg';
import CustomerIcon from '../../../assets/images/sidebar/sidebar_customers.svg';
import CustomerIconHover from '../../../assets/images/sidebar/sidebar_customers_hover.svg';
import CustomerIconSelected from '../../../assets/images/sidebar/sidebar_customers_selected.svg';
import IncidentsIcon from '../../../assets/images/sidebar/sidebar_incidents.svg';
import IncidentsIconHover from '../../../assets/images/sidebar/sidebar_incidents_hover.svg';
import IncidentsIconSelected from '../../../assets/images/sidebar/sidebar_incidents_selected.svg';
import PropertiesIcon from '../../../assets/images/sidebar/sidebar_properties.svg';
import PropertiesIconHover from '../../../assets/images/sidebar/sidebar_properties_hover.svg';
import PropertiesIconSelected from '../../../assets/images/sidebar/sidebar_properties_selected.svg';
import UsersIcon from '../../../assets/images/sidebar/sidebar_users.svg';
import UsersIconHover from '../../../assets/images/sidebar/sidebar_users_hover.svg';
import UsersIconSelected from '../../../assets/images/sidebar/sidebar_users_selected.svg';
import PlaybacksIcon from '../../../assets/images/sidebar/sidebar_playbacks.svg';
import PlaybacksIconHover from '../../../assets/images/sidebar/sidebar_playbacks_hover.svg';
import PlaybacksIconSelected from '../../../assets/images/sidebar/sidebar_playbacks_selected.svg';
import CommentsIcon from '../../../assets/images/sidebar/sidebar_comments.svg';
import CommentsIconHover from '../../../assets/images/sidebar/sidebar_comments_hover.svg';
import CommentsIconSelected from '../../../assets/images/sidebar/sidebar_comments_selected.svg';

interface MenuItem {
  name: string;
  icon: string;              
  iconHover: string;         
  iconSelected: string;      
  path: string;
  additionalPaths?: string[];
}

const adminMenuItems: MenuItem[] = [
  { name: 'Dashboard', icon: DashboardIcon, iconHover: DashboardIconHover, iconSelected: DashboardIconSelected, path: '/admin-dashboard', additionalPaths: ['/change-password', '/profile'] },
  { name: 'Customers', icon: CustomerIcon, iconHover: CustomerIconHover, iconSelected: CustomerIconSelected, path: '/default-page' },
  { name: 'Properties', icon: PropertiesIcon, iconHover: PropertiesIconHover, iconSelected: PropertiesIconSelected, path: '/default-page' },
  { name: 'Users', icon: UsersIcon, iconHover: UsersIconHover, iconSelected: UsersIconSelected, path: '/default-page' },
  { name: 'Incidents', icon: IncidentsIcon, iconHover: IncidentsIconHover, iconSelected: IncidentsIconSelected, path: '/default-page', additionalPaths: ['/default-page', '/incident-detailed-page'] },
  { name: 'Playbacks', icon: PlaybacksIcon, iconHover: PlaybacksIconHover, iconSelected: PlaybacksIconSelected, path: '/default-page' },
  { name: 'Comments', icon: CommentsIcon, iconHover: CommentsIconHover, iconSelected: CommentsIconSelected, path: '/comment-page' },
];

const supervisorMenuItems: MenuItem[] = [
  { name: 'Dashboard', icon: DashboardIcon, iconHover: DashboardIconHover, iconSelected: DashboardIconSelected, path: '/supervisor-dashboard', additionalPaths: ['/change-password', '/profile']  },
  { name: 'Incidents', icon: IncidentsIcon, iconHover: IncidentsIconHover, iconSelected: IncidentsIconSelected, path: '/supervisor-incidents-list' },
  { name: 'Playbacks', icon: PlaybacksIcon, iconHover: PlaybacksIconHover, iconSelected: PlaybacksIconSelected, path: '/default-page' },
  { name: 'Comments', icon: CommentsIcon, iconHover: CommentsIconHover, iconSelected: CommentsIconSelected, path: '/comment-page' },
];

const staffMenuItems: MenuItem[] = [
  { name: 'Dashboard', icon: DashboardIcon, iconHover: DashboardIconHover, iconSelected: DashboardIconSelected, path: '/staff-dashboard', additionalPaths: ['/change-password', '/profile']  },
  { name: 'Incidents', icon: IncidentsIcon, iconHover: IncidentsIconHover, iconSelected: IncidentsIconSelected, path: '/staff-incidents-list' },
  { name: 'Playbacks', icon: PlaybacksIcon, iconHover: PlaybacksIconHover, iconSelected: PlaybacksIconSelected, path: '/default-page' },
];

const customerMenuItems: MenuItem[] = [
  { name: 'Dashboard', icon: DashboardIcon, iconHover: DashboardIconHover, iconSelected: DashboardIconSelected, path: '/customer-dashboard', additionalPaths: ['/change-password', '/profile']  },
  { name: 'Incidents', icon: IncidentsIcon, iconHover: IncidentsIconHover, iconSelected: IncidentsIconSelected, path: '/customer-incidents-list' },
  { name: 'Playbacks', icon: PlaybacksIcon, iconHover: PlaybacksIconHover, iconSelected: PlaybacksIconSelected, path: '/default-page' },
  { name: 'Comments', icon: CommentsIcon, iconHover: CommentsIconHover, iconSelected: CommentsIconSelected, path: '/comment-page' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const role = Cookies.get('role')?.toLowerCase();

    switch (role) {
      case 'role_admin':
        setMenuItems(adminMenuItems);
        break;
      case 'role_supervisor':
        setMenuItems(supervisorMenuItems);
        break;
      case 'role_staff':
        setMenuItems(staffMenuItems);
        break;
      case 'role_customer':
        setMenuItems(customerMenuItems);
        break;
      default:
        setMenuItems([]); 
    }
  }, []);

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <img src={Logo} alt="Logo" className="sidebar-logo" />
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item, index) => {
         const isActive =
  location.pathname === item.path ||
  (item.additionalPaths?.some(path => location.pathname.startsWith(path)));

          return (
            <div
              key={index}
              className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={
                  isActive
                    ? item.iconSelected
                    : hoveredItem === item.name
                    ? item.iconHover
                    : item.icon
                }
                alt={item.name}
                className="sidebar-icon"
              />
              <span className="sidebar-text">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
