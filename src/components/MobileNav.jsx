
import { NavLink } from 'react-router-dom';
const cls = ({ isActive }) => 'mobile-nav__link' + (isActive ? ' active' : '');

export default function MobileNav() {
  return (
    <div className="mobile-nav">
      <NavLink className={cls} to="/" end>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <title>Home</title>
            <path
              d="M21.743 12.331l-9-10c-.379-.422-1.107-.422-1.486 0l-9 10a.998.998 0 0 0-.17 1.076c.16.361.518.593.913.593h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a.998.998 0 0 0 .743-1.669z"
              fill="currentColor"
            />
          </svg>
        </span> 
        <p>Главная</p>
      </NavLink>

      <NavLink className={cls} to="/about">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
            <title>Info</title>
            <path
              fill="currentColor"
              d="M256 512a256 256 0 1 0 0-512a256 256 0 1 0 0 512m-40-176h24v-64h-24c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-80c-13.3 0-24-10.7-24-24s10.7-24 24-24m40-208a32 32 0 1 1 0 64a32 32 0 1 1 0-64"
            />
          </svg>
        </span>
        <p>О нас</p>
      </NavLink>

      <NavLink className={cls} to="/servis">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
            <title>Services</title>
            <circle cx="9.379" cy="9.379" r="3.879" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9.379" cy="38.621" r="3.879" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9.379" cy="24" r="3.879" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <rect width="25.064" height="7.758" x="17.436" y="5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" rx="1.79" ry="1.79" />
            <rect width="25.064" height="7.758" x="17.436" y="34.742" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" rx="1.79" ry="1.79" />
            <rect width="25.064" height="7.758" x="17.436" y="20.121" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" rx="1.79" ry="1.79" />
          </svg>
        </span>
        <p>Услуги</p>
      </NavLink>

      <NavLink className={cls} to="/social" target="_blank">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <title>Contacts</title>
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              d="M5 12a3 3 0 1 1 0-6a3 3 0 0 1 0 6Zm4 6v-2c0-2.25-1.787-4-4.036-4h.054C2.768 12 1 13.75 1 16v2M12 7h12M12 17h10m-10-5h7"
            />
          </svg>
        </span>
        <p>Соцсети</p>
      </NavLink>
    </div>
  );
}
