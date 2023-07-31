import React from 'react';
import '../App.css';
import HeaderImage from '../../public/OD_Logo.png';

function Header() {
  return (
    <div className="Header">
      <img className="Header_Image" src={HeaderImage} loading="lazy" />
      <span className='Header_Text'>OPERATION DRAGONFLY</span>
      <a className='Header_Profile'>Profile</a>
    </div>
  );
}

export default Header;
