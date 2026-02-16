import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Customers', path: '/customer' },
  { label: 'Users', path: '/users' },
  { label: 'Orders', path: '/orders' },
];

const Menu: React.FC = () => {
  return (
    <nav className="menu">
      <h2>Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => (
          <li key={item.path} style={{ padding: '8px 0' }}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                color: isActive ? '#1976d2' : 'inherit',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
