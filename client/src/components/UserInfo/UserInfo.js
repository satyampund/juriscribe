import "./UserInfo.css"
import IcoEmail from "./email.png"
import IcoMobile from "./mobile.png"
import IcoUser from "./user.png"
import React, { useState } from 'react'

function UserInfo() {
  const [user, setUser] = useState({ email: '', name: '', mobile: '', role: ''});

  setInterval(() => {
    const storedData = sessionStorage.getItem('verificationData');
    const { data, expiry } = JSON.parse(storedData || '{"data": {"email": "", "name": "", "mobile": ""}}');
    const { email, name, mobile, role } = data;
    setUser({ email, name, mobile, role });
  }, 1000);

  return (
    <div className="user-info-container">
      <span className="top-bar-app-name">
        Juriscribe
      </span>
      <div>
        <div className="user-info">
          <img src={IcoUser} alt="user" className="ico-user" />
          {user.name} ({user.role})
        </div>
        <div className="contact-info">
          <img src={IcoEmail} alt="email" className="ico-email" />
          <span> {user.email}</span>
          <img src={IcoMobile} alt="mobile" className="ico-mobile" />
          <span> {user.mobile}</span>
        </div>
      </div>

    </div>
  )
}

export default UserInfo
