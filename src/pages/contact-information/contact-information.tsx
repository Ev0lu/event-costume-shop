import s from './contact-information.module.css'
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
import { getManufacturers, getAd} from '../../shared/api'
import { Footer } from '../../shared/footer/footer'
import PopupForm from '../../shared/popup-form/popup-form'



export function ContactInformation() {
    const [secondManufacturer, setSecondManufacturer] = useState<any>()
    const [thirdManufacturer, setThirdManufacturer] = useState<any>()
    const [ad, setAd] = useState()
  
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);

    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

  return (
    <div className={s.fabricators}>
      <div className={s.fabricators_wrapper}>
        <PopupForm isOpen={isOpen} onClose={closePopup} />
        <Header />
        <section className={s.tables}>
            <div className={s.tables_wrapper}>
                <img src={first_blob} className={s.first_blob}></img>
                <img src={second_blob} className={s.left_blob}></img>
                <div className={s.tables_items}>
                    <div className={s.table_about}>
                        <div className={s.table_about_left}>
                            <div className={s.table_about_left_title}>
                                <h2><Trans i18nKey="contacts.part1" /></h2>
                            </div>
                            <div className={s.table_about_left_description}>
                                <p><Trans i18nKey="contacts.part2" /></p>
                            </div>
                            <div className={s.table_about_left_contacts}>
                                <p>Вконтакте: *ссылка*</p>
                                <p>Вконтакте: *ссылка*</p>
                                <p>Вконтакте: *ссылка*</p>
                                <p>Вконтакте: *ссылка*</p>
                                <p>Вконтакте: *ссылка*</p>
                            </div>
                        </div>
                    </div>
                    <div className={s.table_description}>
                        <div className={s.table_description_about_item}>
                            <div className={s.table_description_about}>
                                <p><Trans i18nKey="contacts.part3" /></p>
                            </div>
                            <div onClick={openPopup} className={s.table_description_button}>
                                <button><Trans i18nKey="contacts.part4" /></button>
                            </div>
                        </div>
                        <div className={s.table_name}>
                            <div className={s.table_name_title}>
                                <h2><Trans i18nKey="contacts.part5" /></h2>
                                <h2>{<Trans i18nKey="contacts.part6" />}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={s.table_description_form} onClick={() => navigate('/')}>
                                <button><Trans i18nKey="contacts.part7" /></button>
                </div>
            </div>

        </section>
        <Footer />
      </div>
    </div>
  )
}