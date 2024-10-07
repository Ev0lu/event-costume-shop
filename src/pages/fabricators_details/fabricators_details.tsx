import s from './fabricators_details.module.css'
import crown from '../../assets/header_crown_logotype.svg'
import fabric_logo from '../../assets/fabric_logo.svg'
import carousel from '../../assets/details_about.svg'
import fabric_view from '../../assets/fabric_view.svg'
import first_blob from '../../assets/first_blob.svg'
import second_blob from '../../assets/left_blob.svg'
import photo_details from '../../assets/photo_details.svg'
import { useTranslation, Trans } from 'react-i18next';
import { Header } from '../../shared/header/header'
import { getManufactureDescription } from '../../shared/api'
import { useEffect, useState } from 'react'
import { Footer } from '../../shared/footer/footer'

export function FabricatorDetails() {
    const {t, i18n} = useTranslation()
    const [manufacture, setManufacture] = useState<any>()

    const getAllEvents = async () => {
        const response = await getManufactureDescription(location.pathname.split('/')[3], i18n.language)
        const data = await response.json()
        setManufacture(data.manufacturer)
        console.log(data)
      }

    useEffect(() => {
        getAllEvents()
    }, [])

  return (
    <div className={s.fabricators}>
      <div className={s.fabricators_wrapper}>
        <Header />
        <section className={s.tables}>
            <div className={s.tables_wrapper}>
                <img src={first_blob} className={s.first_blob}></img>
                <img src={second_blob} className={s.left_blob}></img>
                <div className={s.tables_title}>
                    <p><Trans i18nKey="events.part1" /> &nbsp;&nbsp;/&nbsp;&nbsp; {localStorage.getItem('nameManufactory') ? localStorage.getItem('nameManufactory') : '-'} &nbsp;&nbsp;/&nbsp;&nbsp;</p> 
                    <h2>{manufacture ? i18n.language === 'en' ? manufacture.name_en : manufacture.name_ru : '-'}</h2>
                </div>
                <div className={s.tables_items}>
                    <div className={s.table_about}>
                        <div className={s.table_about_left}>
                            <div className={s.table_about_left_title}>
                                <img  className={s.table_about_left_title_img} src={manufacture ? manufacture.logo.url : fabric_logo}></img>
                                <h2>{manufacture ? i18n.language === 'en' ? manufacture.name_en : manufacture.name_ru : '-'}</h2>
                            </div>
                            <div className={s.table_about_left_description}>
                                <p>{manufacture ? i18n.language === 'en' ? manufacture.description_en : manufacture.description_ru : '-'}</p>
                            </div>
                            <div className={s.table_about_left_description}>
                                <p></p>
                            </div>

                        </div>
                        <div className={s.table_about_right}>
                            <img className={s.table_image_right} src={manufacture ? manufacture.products[0].url : carousel}></img>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className={s.actual}>
            <div className={s.actual_wrapper}>
                <div className={s.actual_item}>
                    <div className={s.actual_item_title}>
                        <h2>{i18n.language === 'en' ? 'Current promotions' : 'Актуальные акции'}</h2>
                    </div>
                    <div style={{display: (manufacture ? i18n.language === 'en' ? manufacture.action_en === null ? 'none' : 'flex' : manufacture.action_ru === null ? 'none' : 'flex'  : 'none')}} className={s.actual_item_text}>
                        <p>{manufacture ? i18n.language === 'en' ? manufacture.action_en : manufacture.action_ru : '-'}</p>
                    </div>
                </div>
                <div className={s.actual_item}>
                    <div className={s.actual_item_title}>
                        <h2>{i18n.language === 'en' ? 'Studio contacts' : 'Контакты студии'}</h2>
                    </div>
                    <div className={s.actual_item_text}>
                        <p>{i18n.language === 'en' ? 'Phone' : 'Телефон'}: {manufacture ? manufacture.phones[0].number : '-'}</p>
                        {manufacture && manufacture.links.map((item: any) => (
                            <p>{item.url}</p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        <section className={s.fabric_pictures}>
            <div className={s.fabric_pictures_wrapper}>
                <div className={s.fabric_pictures_list}>
                    {manufacture && manufacture.products.map((item:any) => (
                        <div className={s.fabric_pictures_list_item}>
                            <img style={{width: '246px', height: '313px', borderRadius: '20px'}} src={item ? item.url : photo_details}></img>
                        </div>
                    ))}


                </div>
                {/*<div className={s.fabric_pictures_text}>
                    <p>Загрузить еще</p>
                </div>*/}
            </div>
        </section>
        <section className={s.fabric_preview}>
            <div className={s.fabric_preview_wrapper}>
                <img src={fabric_view}></img>
            </div>
        </section>
        <section className={s.list}>
            <div className={s.list_wrapper}>
                <div className={s.list_btn}>
                    <button>{i18n.language === 'en' ? 'LOAD MORE' : 'ЗАГРУЗИТЬ ЕЩЕ'}</button>
                </div>
            </div>
        </section>
        <Footer />
      </div>
    </div>
  )
}