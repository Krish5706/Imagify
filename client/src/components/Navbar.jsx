import React, { useContext, useState, useRef } from 'react'
import {assets} from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

function Navbar() {

    const {user, setShowLogin, logout ,credit} = useContext(AppContext);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const timeoutRef = useRef(null);

  return (
    <div className = 'flex items-center justify-between py-4'>
       <Link to='/'> 
       <img src={assets.logo} alt="" className='w-28 sm:w-32 lg:w-40'/>
       </Link>

       <div>
        {
        user ? 
        <div className='flex items-center gap-2 sm:gap-3'>
            <button onClick={() => navigate('/buy') } className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
                <img className='w-5' src={assets.credit_star} alt="" />
                <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits left : {credit}</p>
            </button>
            <p className='text-gray-600 max-sm:hidden pl-4'>Hi, {user.name}</p>

            <div
              className='relative'
              onMouseLeave={() => {
                timeoutRef.current = setTimeout(() => setShowDropdown(false), 200);
              }}
              onMouseEnter={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setShowDropdown(true);
              }}
            >
                <img
                  src={assets.profile_icon}
                  className='w-10 drop-shadow cursor-pointer'
                  alt=""
                />

                {showDropdown && (
                  <div className='absolute top-12 right-0 z-10 text-black rounded-md shadow-lg border border-gray-200'>
                    <ul className='list-none m-0 p-0 bg-white rounded-md text-sm min-w-[120px]'>
                      <li onClick={() => { setShowDropdown(false); navigate('/history'); }} className='py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-t-md'>History</li>
                      <li onClick={() => { setShowDropdown(false); logout(); }} className='py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-b-md'>Logout</li>
                    </ul>
                  </div>
                )}
            </div>
        </div>
        :
        <div className='flex items-center gap-2 sm:gap-5'>
            <p onClick={() => navigate('/buy')} 
            className = 'cursor-pointer'> Pricing</p>
            <button onClick={() => setShowLogin(true)} className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full'>Login</button>
        </div>
        }
        
         

       </div>
    </div>
  )
}

export default Navbar