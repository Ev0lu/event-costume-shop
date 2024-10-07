import s from './header.module.css'
import crown from '../../assets/header_crown_logotype.svg'
import { useTranslation, Trans } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
interface HeaderProps {
  onSearch?: (term: string) => void;
  link?: string;
}

export const Header: React.FC<HeaderProps> = ({onSearch, link}) => {
    const {t, i18n} = useTranslation()
    const navigate = useNavigate()
    const location = useLocation();
    const isActive = (path: string) => location.pathname.split('/')[1] === path;
    useEffect(() => {
        console.log(location.pathname.split('/')[1])
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onSearch) {
        onSearch(event.target.value); // Вызываем onSearch с новым значением
      }
    };
    return (
        <header className={s.header}>
            <div className={s.header_wrapper}>
                <div className={s.header_logo}>
                  <img src={crown}></img>
                  <p>COSTUMIER</p>
                </div>
                <div className={s.header_nav}>
                  <div onClick={() => {navigate('/')}} className={`${s.header_nav_item}  ${isActive('') ? s.active : ''}`}>
                    <p><Trans i18nKey="header.part1" /></p>
                  </div>
                  <div onClick={() => {navigate(`/manufacturers/none`)}} className={`${s.header_nav_item}  ${isActive('manufacturers') ? s.active : ''}`}>
                    <p><Trans i18nKey="header.part2" /></p>
                  </div>
                  <div onClick={() => {navigate('/event')}} className={`${s.header_nav_item}  ${isActive('event') ? s.active : ''}`}>
                    <p><Trans i18nKey="header.part3" /></p>
                  </div>
                  <div onClick={() => {navigate('/contacts')}} className={`${s.header_nav_item}  ${isActive('contacts') ? s.active : ''}`}>
                    <p><Trans i18nKey="header.part4" /></p>
                  </div>
                </div>
                <div className={s.header_cover}>
                  <div style={{display: isActive('') ? 'flex' : 'none' }} className={s.header_search}>
                      <input onChange={handleChange} placeholder={i18n.language === 'en' ? 'Search' : 'Поиск'}></input>
                  </div>
                  <div className={s.header_language}>
                  <p style={{fontWeight: i18n.language === 'ru' ? 700 : 400}} onClick={() => {
                        i18n.changeLanguage('ru');  // Передаем строку 'ru'
                        window.location.reload()
                        
                    }}>RU</p>
                    <p> / </p>
                    <p style={{fontWeight: i18n.language === 'en' ? 700 : 400}} onClick={() => {
                        i18n.changeLanguage('en');  // Передаем строку 'en'
                        window.location.reload()
                    }}>EN</p>

                  </div>
                </div>
            </div>
        </header>
    );
};

