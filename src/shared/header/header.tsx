import s from './header.module.css'
import crown from '../../assets/header_crown_logotype.svg'
import { useTranslation, Trans } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchCostume } from '../api';

interface HeaderProps {
  onSearch?: (term: string) => void;
  link?: string;
}

export const Header: React.FC<HeaderProps> = ({ link }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any>([]);
  const [filteredCategories, setFilteredCategories] = useState<any>([]);

  const isActive = (path: string) => location.pathname.split('/')[1] === path;

  useEffect(() => {
    console.log(location.pathname.split('/')[1]);
    if (searchQuery !== '') {
      searchCostumesByInput(); // Автоматический поиск при загрузке компонента
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
    const filtered = categories.filter((category: any) => {
      const categoryName = i18n.language === 'en' ? category.name_en.toLowerCase() : category.name_ru.toLowerCase();
      return categoryName.includes(e.target.value.toLowerCase());
    });
    setFilteredCategories(filtered);
    searchCostumesByInput()
  };

  const searchCostumesByInput = async () => {
    const response = await searchCostume(i18n.language === 'en' ? 'en' : 'ru', searchQuery);
    const data = await response.json();
    setCategories(data.categories);
    setFilteredCategories(data.categories); // Устанавливаем все категории при инициализации
    console.log(data);
  };

  return (
    <header className={s.header}>
      <div className={s.header_wrapper}>
        <div className={s.header_logo}>
          <img src={crown} alt="Crown Logo" />
          <p>COSTUMIER</p>
        </div>
        <div className={s.header_nav}>
          <div onClick={() => { navigate('/'); }} className={`${s.header_nav_item}  ${isActive('') ? s.active : ''}`}>
            <p><Trans i18nKey="header.part1" /></p>
          </div>
          <div onClick={() => { navigate(`/manufacturers/none`); }} className={`${s.header_nav_item}  ${isActive('manufacturers') ? s.active : ''}`}>
            <p><Trans i18nKey="header.part2" /></p>
          </div>
          <div onClick={() => { navigate('/event'); }} className={`${s.header_nav_item}  ${isActive('event') ? s.active : ''}`}>
            <p><Trans i18nKey="header.part3" /></p>
          </div>
          <div onClick={() => { navigate('/contacts'); }} className={`${s.header_nav_item}  ${isActive('contacts') ? s.active : ''}`}>
            <p><Trans i18nKey="header.part4" /></p>
          </div>
        </div>
        <div className={s.header_cover}>
          <div style={{ display: isActive('') ? 'flex' : 'none' }} className={s.header_search}>
            <input
              onChange={handleChange}
              value={searchQuery}
              placeholder={i18n.language === 'en' ? 'Search' : 'Поиск'}
            />
            {filteredCategories && filteredCategories.length > 0 && (
              <div className={s.dropdown}>
                {filteredCategories.map((category: any) => (
                  <div
                    key={category.category_id}
                    className={s.dropdown_item}
                    onClick={() => navigate(`/manufacturers/${category.category_id}`)}
                  >
                    {i18n.language === 'en' ? category.name_en : category.name_ru}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={s.header_language}>
            <p
              style={{ fontWeight: i18n.language === 'ru' ? 700 : 400 }}
              onClick={() => {
                i18n.changeLanguage('ru');
                window.location.reload();
              }}
            >RU</p>
            <p> / </p>
            <p
              style={{ fontWeight: i18n.language === 'en' ? 700 : 400 }}
              onClick={() => {
                i18n.changeLanguage('en');
                window.location.reload();
              }}
            >EN</p>
          </div>
        </div>
      </div>
    </header>
  );
};
