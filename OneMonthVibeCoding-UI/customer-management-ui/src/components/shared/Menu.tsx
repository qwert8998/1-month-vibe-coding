import React from 'react';

interface MenuProps {
  selected: string;
  onSelect: (item: string) => void;
}

const menuItems = [
  { label: 'Customers', value: 'customers' },
  { label: 'Users', value: 'users' },
  { label: 'Orders', value: 'orders' },
];

const Menu: React.FC<MenuProps> = ({ selected, onSelect }) => {
  return (
    <nav className="menu">
      <h2>Menu</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.value}
            className={selected === item.value ? 'active' : ''}
            onClick={() => onSelect(item.value)}
            style={{ cursor: 'pointer', padding: '8px 0' }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
