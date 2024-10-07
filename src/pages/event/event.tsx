import s from './event.module.css'
import crown from '../../assets/header_crown_logotype.svg'
import fabric_logo from '../../assets/fabric_logo.svg'
import carousel from '../../assets/carousel.svg'
import fabric_view from '../../assets/fabric_view.svg'
import first_blob from '../../assets/first_blob.svg'
import second_blob from '../../assets/left_blob.svg'

import { useTranslation, Trans } from 'react-i18next';
import { useEffect, useState } from 'react'
import { Header } from '../../shared/header/header'
import { useNavigate } from 'react-router-dom'
import { getAd, getEvents} from '../../shared/api'
import { Footer } from '../../shared/footer/footer'



export function Event() {

    const {t, i18n} = useTranslation()
    const [offset, setOffset] = useState(0)

    const [events, setEvents] = useState<any>()
    const [firstEvent, setFirstEvent] = useState<any>()
    const [secondEvent, setSecondEvent] = useState<any>()
    const [thirdEvent, setThirdEvent] = useState<any>()
    const [fourthEvent, setFourthEvent] = useState<any>()

    const [ad, setAd] = useState()


    const getAllEvents = async () => {
      const response = await getEvents(i18n.language, offset)
      const data = await response.json()
      setFirstEvent(data.events[0])
      setSecondEvent(data.events[1])
      setThirdEvent(data.events[2])
      setFourthEvent(data.events[3])
      setEvents(data.events.slice(4))
      console.log(data)
    }

    const getAdditionalEvents = async () => {
        const response = await getEvents(i18n.language, offset + 25)
        setOffset(offset +  25)
        const data = await response.json()
        console.log(data)
        if (data.events.length !== 0) {
            setEvents([...events, data.events])
        }
      }

      const getAdForPage = async () => {
        const response = await getAd('Catalog')
        const data = await response.json()
        setAd(data.ad)
        console.log(data)
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
                    <p><Trans i18nKey="events.part1" /> &nbsp;&nbsp;/&nbsp;&nbsp;</p> 
                    <h2><Trans i18nKey="events.part2" /></h2>
                </div>
                <div className={s.tables_items}>
                    <div className={s.table_about} onClick={() => {
                        if (firstEvent) {
                            navigate(`${firstEvent.event_id}`)
                       } 

                    }
 
                    }>
                        <div className={s.table_about_left}>
                            <div className={s.table_about_left_title}>
                                <h2>{firstEvent ? i18n.language === 'en' ? firstEvent.title_en : firstEvent.title_ru : '-'}</h2>
                            </div>
                            <div className={s.table_about_left_description}>
                                <p>{firstEvent ? i18n.language === 'en' ? firstEvent.description_en : firstEvent.description_ru : '-'}</p>
                            </div>
                            <div className={s.table_about_left_contacts}>
                                <p>Вконтакте: *ссылка*</p>
                                <p>Вконтакте: *ссылка*</p>
                                <p>Вконтакте: *ссылка*</p>
                                <p>Вконтакте: *ссылка*</p>
                                <p>Вконтакте: *ссылка*</p>
                            </div>
                        </div>
                        <div className={s.table_about_right}>
                            <img className={s.table_about_right_img} src={firstEvent ? firstEvent.pictures[0].url : carousel}></img>
                        </div>
                    </div>
                    <div className={s.table_description}>
                        <div className={s.list_item}  onClick={() => {
                        if (secondEvent) {
                            navigate(`${secondEvent.event_id}`)
                       } 

                    }
 
                    }>
                            <p>{secondEvent ? i18n.language === 'en' ? secondEvent.title_en : secondEvent.title_ru : '-'}</p>
                        </div>
                        <div className={s.list_item}   onClick={() => {
                        if (thirdEvent) {
                            navigate(`${thirdEvent.event_id}`)
                       } 

                    }
 
                    }>
                            <p>{thirdEvent ? i18n.language === 'en' ? thirdEvent.title_en : thirdEvent.title_ru : '-'}</p>
                        </div>
                        <div className={s.list_item}   onClick={() => {
                        if (fourthEvent) {
                            navigate(`${fourthEvent.event_id}`)
                       } 

                    }
 
                    }>
                            <p>{fourthEvent ? i18n.language === 'en' ? fourthEvent.title_en : fourthEvent.title_ru : '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className={s.fabric_preview}>
            <div className={s.fabric_preview_wrapper}>
                <img src={ad !== null ? ad : fabric_view}></img>
            </div>
        </section>
        <section className={s.list}>
            <div className={s.list_wrapper}>
                <div className={s.list_items}>
                    {events && events.map((event: any) => (
                        <div className={s.list_item_events} onClick={() => {
                            if (fourthEvent) {
                                navigate(`${event.event_id}`)
                           } 
                        }
                        }>
                            <p>{event ? i18n.language === 'en' ? event.title_en : event.title_ru : '-'}</p>
                        </div>
                    ))}
                </div>
                <div style={{display: events ? events.length < 22 ? 'none' : 'flex' : 'flex'}} className={s.list_btn}>
                    <button onClick={() => {
                        getAdditionalEvents()
                    }}><Trans i18nKey="events.part4" /></button>
                </div>
            </div>
        </section>
        <Footer />
      </div>
    </div>
  )
}