import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';
import PoweredBy from './components/PoweredBy/PoweredBy';
import UserInfo from './components/UserInfo/UserInfo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<>
  <Toaster />
  <UserInfo />
  <App />
  <PoweredBy />
</>
);
