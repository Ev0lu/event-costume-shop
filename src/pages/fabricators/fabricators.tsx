import s from './fabricators.module.css'
import fabric_logo from '../../assets/fabric_logo.svg'
import carousel from '../../assets/carousel.svg'
import fabric_view from '../../assets/fabric_view.svg'
import first_blob from '../../assets/first_blob.svg'
import second_blob from '../../assets/left_blob.svg'

import { useTranslation, Trans } from 'react-i18next';
import { useEffect, useState } from 'react'
import { Header } from '../../shared/header/header'
import { useNavigate } from 'react-router-dom'
import { getAd, getCategories, getManufacturersUser} from '../../shared/api'
import { Footer } from '../../shared/footer/footer'
import Select from 'react-select';



export function Fabricator() {

    const { i18n } = useTranslation()
    const [offset, setOffset] = useState(0)

    const [manufacturers, setManufacturers] = useState<any>()
    const [firstManufacturer, setFirstManufacturer] = useState<any>()
    const [secondManufacturer, setSecondManufacturer] = useState<any>()
    const [thirdManufacturer, setThirdManufacturer] = useState<any>()
    const [ad, setAd] = useState<any>()


    const getAllManufacturers = async () => {
      const response = await getManufacturersUser(location.pathname.split('/')[2], i18n.language, offset)
      const data = await response.json()
      setFirstManufacturer(data.manufacturers[0])
      setSecondManufacturer(data.manufacturers[1])
      setThirdManufacturer(data.manufacturers[2])
      setManufacturers(data.manufacturers.slice(3))
      console.log(data)
    }

    const getAdditionalManufacturers = async () => {
        const response = await getManufacturersUser(location.pathname.split('/')[2], i18n.language, offset + 25)
        setOffset(offset +  25)
        const data = await response.json()
        console.log(data)
        if (data.manufacturers.length !== 0) {
            setManufacturers([...manufacturers, data.manufacturers])
        }
      }

    const getAdForPage = async () => {
        const response = await getAd('Catalog')
        const data = await response.json()
        setAd(data.ad)
        console.log(data)
    }

    const [categories, setCategories] = useState<Category[]>([]);

    const getAllCategories = async () => {
        const response = await getCategories(i18n.language === 'en' ? 'en' : 'ru')
        const data = await response.json()
        const formattedCategories = data.categories.map((category: any) => ({
            label: i18n.language === 'en' ? category.name_en : category.name_ru,
            value: category.category_id, // используем ID для навигации
        }));
        setCategories(formattedCategories);

      }

      const handleSelectChange = (selectedOption: any) => {
        if (selectedOption) {
            const selectedCategory = selectedOption.label;
            const categoryId = selectedOption.value;

            // Сохраняем название категории в localStorage
            localStorage.setItem('nameManufactory', selectedCategory);

            // Навигация по выбранному category_id
            navigate(`/manufacturers/${categoryId}`);
            getAllManufacturers()

        }
    };

    interface Category {
        label: string;
        value: string;
      }

    const navigate = useNavigate()

    useEffect(() => {
        getAllManufacturers()
        getAdForPage()
        getAllCategories()
    }, [])

    useEffect(() => {
        // Проверяем, если путь содержит 'none' и категории загружены
        if (location.pathname.split('/')[2] === 'none' && categories.length > 0) {
            // Выбираем первую категорию
            localStorage.setItem('nameManufactory', categories[0].label);
    
            // Навигация по ID первой категории
            navigate(`/manufacturers/${categories[0].value}`);
            getAllManufacturers()
        }
    }, [categories, navigate]);
  


  return (
    <div className={s.fabricators}>
      <div className={s.fabricators_wrapper}>
        <Header />
        <section className={s.tables}>
            <div className={s.tables_wrapper}>
                <img src={first_blob} className={s.first_blob}></img>
                <img src={second_blob} className={s.left_blob}></img>
                <div className={s.tables_title}>
                    <p style={{cursor: 'pointer'}} onClick={() => {
                        navigate('/')
                    }}><Trans i18nKey="events.part1" /> &nbsp;&nbsp;/&nbsp;&nbsp;</p> 
                    <h2>{localStorage.getItem('nameManufactory') ? localStorage.getItem('nameManufactory') : '-'}</h2>
                    <Select
                                options={categories} // Опции для селекта
                                onChange={handleSelectChange} // Обработчик выбора
                                placeholder={i18n.language === 'en' ? 'Select category...' : 'Выбрать...'}
                                styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      fontFamily: "Manrope, sans-serif"
                                    }),
                                    menu: (provided) => ({
                                      ...provided,
                                      fontFamily: "Manrope, sans-serif"
                                    }),
                                    option: (provided) => ({
                                      ...provided,
                                      fontFamily: "Manrope, sans-serif"
                                    }),
                                  }}
                            />
                </div>
                <div className={s.tables_items}>
                    <div className={s.table_about} onClick={() => navigate(`${firstManufacturer.manufacturer_id}`)}>
                        <div className={s.table_about_left}>
                            <div className={s.table_about_left_title}>
                                <img src={firstManufacturer ? firstManufacturer.logo.url : fabric_logo} className={s.list_item_picture}></img>
                                <h2>{firstManufacturer ? i18n.language === 'en' ? firstManufacturer.name_en : firstManufacturer.name_ru : '-'}</h2>
                            </div>
                            <div className={s.table_about_left_description}>
                                <p>{firstManufacturer ? i18n.language === 'en' ? firstManufacturer.description_en : firstManufacturer.description_ru : '-'}</p>
                            </div>
                            <div className={s.table_about_left_contacts}>
                                <p>{i18n.language === 'en' ? 'Phone' : 'Телефон'}: {firstManufacturer ? firstManufacturer.phones[0].number : '-'}</p>
                                {firstManufacturer && firstManufacturer.links.map((item:any) => (
                                    <a>{item.url}</a>
                                ))}

                            </div>
                        </div>
                        <div className={s.table_about_right}>
                            <img className={s.table_about_right_img} src={firstManufacturer ? firstManufacturer.products[0].url : carousel}></img>
                        </div>
                    </div>
                    <div className={s.table_description}>
                        <div className={s.table_description_about_item} onClick={() => navigate(`${secondManufacturer.manufacturer_id}`)}>
                            <div className={s.table_description_title}>
                                <img className={s.list_item_picture} src={secondManufacturer && secondManufacturer.logo ? secondManufacturer.logo.url : fabric_logo}></img>
                                <h2>{secondManufacturer ? i18n.language === 'en' ? secondManufacturer.name_en : secondManufacturer.name_ru : '-'}</h2>
                            </div>
                            <div className={s.table_description_about}>
                                <p>{secondManufacturer ? i18n.language === 'en' ? secondManufacturer.description_en : secondManufacturer.description_ru : '-'}</p>
                            </div>
                        </div>
                        <div className={s.table_name} onClick={() => navigate(`${thirdManufacturer.manufacturer_id}`)}>
                            <div className={s.table_name_title}>
                                <img className={s.list_item_picture} src={thirdManufacturer && thirdManufacturer.logo ? thirdManufacturer.logo.url : fabric_logo}></img>
                                <h2>{thirdManufacturer ? i18n.language === 'en' ? thirdManufacturer.name_en : thirdManufacturer.name_ru : '-'}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className={s.fabric_preview} style={{display: ad ? ad.picture ? 'flex' : 'none' : 'none'}}>
            <div className={s.fabric_preview_wrapper}>
                <a href={ad && ad.site_url}>
                    <img loading='lazy' src={ad ? ad.picture && ad.picture.url : fabric_view}></img>
                </a>
            </div>
        </section>
        <section className={s.list}>
            <div className={s.list_wrapper}>
                <div className={s.list_items}>
                    {manufacturers && manufacturers.map((manufacture: any) => (
                        <div className={s.list_item} onClick={() => navigate(`${manufacture.manufacturer_id}`)}>
                            <img src={manufacture && manufacture.logo ? manufacture.logo.url : fabric_logo} className={s.list_item_picture}></img>
                            <p style={{paddingRight: '10px'}}>{manufacture ? i18n.language === 'en' ? manufacture.name_en : manufacture.name_ru : '-'}</p>
                        </div>
                    ))}

                </div>
                <div className={s.list_btn}>
                    <button style={{display: manufacturers ? manufacturers.length < 22 ? 'none' : 'flex' : 'flex'}} onClick={() => {
                        getAdditionalManufacturers()
                    }}><Trans i18nKey="events.part4" /></button>
                </div>
            </div>
        </section>
        <Footer />
      </div>
    </div>
  )
}