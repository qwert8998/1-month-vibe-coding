
import { useState } from 'react';
import Menu from './components/shared/Menu';
import Content from './components/shared/Content';
import './App.css';

function App() {
  const [selected, setSelected] = useState('customers');

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7f7f7' }}>
      <div
        style={{
          width: '20%',
          minWidth: 200,
          maxWidth: 350,
          background: '#fff',
          borderRight: '1px solid #e0e0e0',
          padding: '24px 16px',
          boxSizing: 'border-box',
        }}
      >
        <Menu selected={selected} onSelect={setSelected} />
      </div>
      <div
        style={{
          width: '80%',
          padding: '32px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        <Content selected={selected} />
      </div>
    </div>
  );
}

export default App;
