import s from './main-catalog.module.css'
import crown from '../../assets/header_crown_logotype.svg'
import man_and_woman from '../../assets/man_and_woman.svg'
import costume_creation from '../../assets/costume_creation.svg'
import catalog_preview from '../../assets/catalog_preview.svg'
import checkmark from '../../assets/description_galka.svg'
import calendar from '../../assets/description_calendar.svg'
import events from '../../assets/events.svg'
import events_arrow from '../../assets/events_arros.svg'
import first_blob from '../../assets/first_blob.svg'
import second_blob from '../../assets/left_blob.svg'
import third_blob from '../../assets/third_blob.svg'
import last_blob from '../../assets/last_blob.svg'
import { lazy, useEffect, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next';
import { getCategories } from '../../shared/api'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../shared/header/header'
import { Footer } from '../../shared/footer/footer'


export function MainCatalog() {

  const {t, i18n} = useTranslation()
  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([]);

  const getAllCategories = async () => {
    const response = await getCategories()
    const data = await response.json()
    setCategories(data.categories)
    setFilteredCategories(data.categories); // Устанавливаем изначально все категории
    console.log(data)
  }

  useEffect(() => {
    getAllCategories()
    if (i18n.language === 'ru-RU' || i18n.language === 'ru-EN') {
        i18n.changeLanguage('ru')
    }
  }, [])

  const navigate = useNavigate()

  const handleSearch = (term:any) => {
    const filtered = categories.filter((category:any) =>
      i18n.language === 'ru'
        ? category.name_ru.toLowerCase().includes(term.toLowerCase())
        : category.name_en.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategories(filtered);
  };




  return (
    <div className={s.main_catalog}>
      <div className={s.main_catalog_wrapper}>
        <Header onSearch={handleSearch} link={''}/>
        <section className={s.description}>
          <div className={s.description_wrapper}>
            <img src={first_blob} className={s.first_blob}></img>
            <img loading='lazy' src={man_and_woman} className={s.man_and_woman_image}></img>
            <div className={s.description_text_about}>
              <p><Trans i18nKey="main_catalog.part1" /></p>
            </div>
            <div className={s.description_text_title}>
              <h1><Trans i18nKey="main_catalog.part2" /></h1>
            </div>
            <div className={s.description_text_subtitle}>
              <p><Trans i18nKey="main_catalog.part3" /></p>
            </div>
            <div className={s.description_advantages}>
              <div className={s.description_advantages_item}>
                <img loading='lazy' src={checkmark}></img>
                <p><Trans i18nKey="main_catalog.part4" /></p>
              </div>
              <div className={s.description_advantages_item}>
                <img loading='lazy' src={calendar}></img>
                <p><Trans i18nKey="main_catalog.part5" /></p>
              </div>
            </div>
            <div className={s.description_button} onClick={() => navigate('/contacts')}>
              <button><Trans i18nKey="main_catalog.part6" />  ↗</button>
            </div>
          </div>
        </section>
        <section className={s.catalogs}>
          <div className={s.catalogs_wrapper}>
            <img loading='lazy' src={second_blob} className={s.second_blob}></img>
            {/*<img src={last_blob} className={s.last_blob}></img>*/}

            <div className={s.catalogs_title}>
              <p><Trans i18nKey="main_catalog.part7" /></p>
            </div>
            <div className={s.catalogs_list}>
              {filteredCategories.length !== 0 && filteredCategories.map((category:any) => (
                <div className={s.catalogs_item} onClick={() => {
                    navigate(`/manufacturers/${category.category_id}`)
                    localStorage.setItem('nameManufactory', i18n.language === 'ru' ? category.name_ru : category.name_en)
                }}>
                  <img alt='Error' src={category.picture.url} className={s.category_picture}></img>
                  <p>{i18n.language === 'ru' ? category.name_ru : category.name_en}</p>
                </div>
                
              ))}

            </div>
            <div className={s.catalogs_creation}>
                  <img loading='lazy' className={s.catalogs_creation_image} src={costume_creation}></img>
                  <h1><Trans i18nKey="main_catalog.part8" /></h1>
                  <p><Trans i18nKey="main_catalog.part9" /></p>
            </div>
          </div>
        </section>
        <section className={s.events}>
          <div className={s.events_wrapper}>
            <div className={s.events_title}>
              <p><Trans i18nKey="main_catalog.part10" /></p>
            </div>
            <div className={s.events_main}>
              <div className={s.events_image}>
                <img onClick={() => navigate('/event')} loading='lazy' src={events}></img>
              </div>
              {/*<div className={s.events_description}>
                  <p className={s.event_description_head_text} style={{width: '511px', fontWeight: '600'}}>25 ноября 2025</p>
                  <p className={s.event_description_head_text} style={{width: '511px', paddingBottom: '10px', fontWeight: '600'}}>Искусство и технологии создания ростовых кукол</p>
                  <p className={s.event_description_bottom_text} style={{width: '563px'}}>Приглашаем вас на мероприятие, где встретятся ведущие производители и мастера по созданию ростовых кукол. В рамках мероприятия вас ожидают  мастер-классы, презентации новинок, а также возможность лично пообщаться с экспертами и задать интересующие вопросы. Откройте для себя новейшие технологии и тренды в индустрии и вдохновитесь на новые творческие проекты!</p>
                  <div className={s.events_description_link}>
                    <img loading='lazy' src={events_arrow}></img>
                    <p>перейти на страницу мероприятия</p>
                  </div>
              </div>*/}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  )
}
