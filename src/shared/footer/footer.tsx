import s from './footer.module.css'

import { lazy, useEffect, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom'



export function Footer() {

  const navigate = useNavigate()
  return (
        <footer className={s.footer}>
           <div className={s.footer_wrapper}>
              <div className={s.footer_navigation}>
                <div className={s.footer_logotype}>
                    <h2>LOGOTYPE</h2>
                </div>
                <div className={s.footer_navbar}>
                  <div onClick={() => {navigate('/')}} className={s.footer_navbar_item}>
                      <p><Trans i18nKey="header.part1" /></p>
                  </div>
                  <div onClick={() => {navigate('/manufacturers/none')}} className={s.footer_navbar_item}>
                      <p><Trans i18nKey="header.part2" /></p>
                  </div>
                  <div onClick={() => {navigate('/event')}} className={s.footer_navbar_item}>
                      <p><Trans i18nKey="header.part3" /></p>
                  </div>
                  <div onClick={() => {navigate('/contacts')}} className={s.footer_navbar_item}>
                      <p><Trans i18nKey="header.part4" /></p>
                  </div>
                  <div className={s.footer_navbar_item}>
                      <p><Trans i18nKey="header.part5" /></p>
                  </div>
                  <div className={s.footer_navbar_item}>
                      <p><Trans i18nKey="header.part6" /></p>
                  </div>
                </div>
              </div>
              <div className={s.footer_copyright}>
                  <p>© COSTUMIER | <Trans i18nKey="header.part8" />. 2024</p>
              </div>
           </div>
        </footer>
  )
}
