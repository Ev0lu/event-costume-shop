import { useState } from 'react';
import s from './admin-navbar.module.css'
import { useLocation, useNavigate } from 'react-router-dom'

export const AdminNavbar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const [isSubmenuVisible, setSubmenuVisible] = useState(false);
    const toggleSubmenu = () => {
        setSubmenuVisible(!isSubmenuVisible);
    };
    return (
        <div className={s.admin_navbar}>
                <div className={s.admin_navbar_wrapper}>
                    <div onClick={() => navigate('/stats')} className={`${s.navbar_item} ${isActive('/stats') ? s.active : ''}`}>
                        <p>Реклама</p>
                    </div>
                    <div onClick={() => navigate('/orders')} className={`${s.navbar_item} ${isActive('/orders') ? s.active : ''}`}>
                        <p>Заявки</p>
                    </div>
                    <div onClick={() => toggleSubmenu()} className={`${s.navbar_item} ${isActive('/kisses') ? s.active : ''}`}>
                        <p>Модерация</p>
                    </div>
                    {isSubmenuVisible && (
                    <div className={`${s.submenu} ${isSubmenuVisible ? s.visible : ''}`}>
                        <div onClick={() => navigate('/kisses')} className={`${s.navbar_item} ${isActive('/kisses') ? s.active : ''}`}>
                            <p>Мероприятия</p>
                        </div>
                        <div onClick={() => navigate('/drivers')} className={`${s.navbar_item} ${isActive('/drivers') ? s.active : ''}`}>
                            <p>Производители</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminNavbar;