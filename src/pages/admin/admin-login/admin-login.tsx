import AdminNavbar from '../admin-navbar/admin-navbar';
import s from './admin-login.module.css'

export const AdminLogin = () => {
    return (
        <div className={s.login}>
                <div className={s.login_wrapper}>
                    <AdminNavbar />
                    <div className={s.main_content}>

                    </div>
                </div>
        </div>
    );
};

