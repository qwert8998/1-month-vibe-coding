import React from 'react';
import CustomersMain from '../customers/customers-main';

interface ContentProps {
  selected: string;
}

const Content: React.FC<ContentProps> = ({ selected }) => {
  let content;
  switch (selected) {
    case 'customers':
      content = <CustomersMain />;
      break;
    case 'users':
      content = <div><h2>Users</h2><p>User details go here.</p></div>;
      break;
    case 'orders':
      content = <div><h2>Orders</h2><p>Order details go here.</p></div>;
      break;
    default:
      content = <div><h2>Welcome</h2><p>Please select a menu item.</p></div>;
  }
  return (
    <section className="content">
      {content}
    </section>
  );
};

export default Content;
