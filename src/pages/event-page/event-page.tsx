import s from './event-page.module.css'
import carousel from '../../assets/details_about.svg'
import fabric_view from '../../assets/fabric_view.svg'
import first_blob from '../../assets/first_blob.svg'
import second_blob from '../../assets/left_blob.svg'
import photo_details from '../../assets/photo_details.svg'
import { useTranslation, Trans } from 'react-i18next';
import { Header } from '../../shared/header/header'
import { getAd, getEventDescription } from '../../shared/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../shared/footer/footer'

export function EventPage() {
    const {i18n} = useTranslation()

    const [event, setEvent] = useState<any>()
    const [ad, setAd] = useState<any>()

    const getAllEvents = async () => {
        const response = await getEventDescription(location.pathname.split('/')[2], i18n.language)
        const data = await response.json()
        setEvent(data.event)
        console.log(data)
      }

    const getAdForPage = async () => {
        const response = await getAd('Event page')
        const data = await response.json()
        setAd(data.ad)
    }

    useEffect(() => {
        getAllEvents()
        getAdForPage()
    }, [])

    const navigate = useNavigate()


  return (
    <div className={s.fabricators}>
      <div className={s.fabricators_wrapper}>
        <Header />
        <section className={s.tables}>
            <div className={s.tables_wrapper}>
                <img src={first_blob} className={s.first_blob}></img>
                <img src={second_blob} className={s.left_blob}></img>
                <div className={s.tables_title}>
                    <p><Trans i18nKey="events.part1" /> &nbsp;&nbsp;/&nbsp;&nbsp; <Trans i18nKey="events.part2" /> &nbsp;&nbsp; / </p> 
                    <h2>{event ? i18n.language === 'en' ? event.title_en : event.title_ru : '-'}</h2>
                </div>
                <div className={s.tables_items}>
                    <div className={s.table_about}>
                        <div className={s.table_about_left}>
                            <div className={s.table_about_left_title}>
                                <h2>{event ? i18n.language === 'en' ? event.title_en : event.title_ru : '-'}</h2>
                            </div>
                            <div className={s.table_about_left_description}>
                                <p>{event ? i18n.language === 'en' ? event.description_en : event.description_ru : '-'}</p>
                            </div>
                            {/*<div className={s.table_about_left_description}>
                                <p>Воплощение вашей творческой идеи в сценических костюмах. Мы создаем элегантные и уникальные наряды, идеально подходящие для любого выступления. Высококачественные ткани и продуманные детали — для вашего звездного выхода на сцену.</p>
                            </div>*/}

                        </div>
                        <div className={s.table_about_right}>
                            <img className={s.table_img} src={event ? event.pictures[0].url : carousel}></img>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className={s.fabric_pictures}>
            <div className={s.fabric_pictures_wrapper}>
                <div className={s.fabric_pictures_list}>
                    {event && event.pictures.map((item:any) => (
                        <div className={s.fabric_pictures_list_item}>
                            <img className={s.fabric_pictures_list_item_image} src={item ? item.url : photo_details}></img>
                        </div>
                    ))}

                </div>
                {/*<div className={s.fabric_pictures_text}>
                    {currentIndex + imagesToLoad < (event?.pictures.length || 0) && (
                        <button className={s.button_load_fabric} onClick={loadMoreImages}>Загрузить еще</button>
                    )}
                </div>*/}
            </div>
        </section>
        <section className={s.fabric_preview}>
            <div className={s.fabric_preview_wrapper}>
                <img src={ad !== null ? ad : fabric_view}></img>
            </div>
        </section>
        <section className={s.list}>
            <div className={s.list_wrapper}>
                <div onClick={() => navigate('/event')} className={s.list_btn}>
                    <button><Trans i18nKey="events.part3" /></button>
                </div>
            </div>
        </section>
        <Footer />
      </div>
    </div>
  )
}