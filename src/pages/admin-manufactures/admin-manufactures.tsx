import { useEffect, useState } from 'react';
import AdminNavbar from '../../shared/navbar/navbar';
import s from './admin-manufactures.module.css';
import { useParams } from 'react-router-dom';
import { deleteManufacturerApplication, getCategories, getManufacturers, getManufacturerById, createManufacturer, patchManufacturer } from '../../shared/api';
import { useTranslation } from 'react-i18next';
import { getToken } from '../../App';
import Select from 'react-select';

export const AdminManufactures = () => {
    const [success, setSuccess] = useState<any>()
    const { manufacturerId } = useParams(); // Получаем ID производителя из параметров
    const [categories, setCategories] = useState<Category[]>([]);
    const [manufacturers, setManufacturers] = useState<any[]>([]);
    const { i18n } = useTranslation();
    const [category, setCategory] = useState<Category | null>(null);
    const [manufacture, setManufacture] = useState<any>()
    const [offset, ] = useState(0);
    const [_, setManufacturerData] = useState<any>({
        name_ru: '',
        name_en: '',
        description_ru: '',
        description_en: '',
        category_ids: [],
        links: [],
        action_ru: '',
        action_en: '',
        phones: [],
        email: '',
        video_link: '',
        status: '',
        manufacturer_icon: null,
    });

    useEffect(() => {
        getAllCategories();
        if (i18n.language === 'ru-RU' || i18n.language === 'ru-EN') {
            i18n.changeLanguage('ru');
        }

        if (manufacturerId) {
            loadManufacturerData(manufacturerId);
        }
    }, [manufacturerId]);

    const getAllCategories = async () => {
        const response = await getCategories(i18n.language === 'en' ? 'en' : 'ru');
        const data = await response.json();
        const formattedCategories = data.categories.map((category: any) => ({
            label: i18n.language === 'en' ? category.name_en : category.name_ru,
            value: category.category_id,
        }));
        setCategories(formattedCategories);
        if (formattedCategories.length > 0) {
            setCategory(formattedCategories[0]);
        }
    };

    const loadManufacturerData = async (id: string) => {
        const token = getToken('access');
        const response = await getManufacturerById(token, id, i18n.language === 'en' ? 'en' : 'ru');
        const data = await response.json();
        setManufacturerData(data);
        setCategory(categories.find(cat => cat.value === data.category_ids[0]) || null);
    };

    const getAllManufacturers = async (categoryId: string) => {
        const token = getToken('access');
        const response = await getManufacturers(token, categoryId, i18n.language, offset);
        const data = await response.json();
        setManufacturers(data.manufacturers);
    };

    useEffect(() => {
        if (category) {
            getAllManufacturers(category.value);
        }
    }, [category]);

 

    const deleteManufacturer = async (id: string) => {
        const token = getToken('access');
        await deleteManufacturerApplication(id, token, sessionStorage.getItem('csrf_token') || '');

    };

    const [formData, setFormData] = useState<{
        manufacturerIcon: FileList | null;
        products: FileList | null;
        nameRu: string;
        nameEn: string;
        descriptionRu?: string;
        descriptionEn?: string;
        categoryIds: string[];
        links: string[];
        actionRu?: string;
        actionEn?: string;
        phones: string[];
        email: string;
        videoLink?: string;


    }>({
        manufacturerIcon: null,
        products: null,
        nameRu: '',
        nameEn: '',
        descriptionRu: '',
        descriptionEn: '',
        categoryIds: [],
        links: [],
        actionRu: '',
        actionEn: '',
        phones: [],
        email: '',
        videoLink: '',

    });

    const handleChange = (e: any) => {
        const { name, value, files } = e.target;
    
        if (files) {
            setFormData((prev) => ({ ...prev, [name]: files }));
        } else if (name === "categoryIds" || name === "links" || name === "phones") {
            setFormData((prev) => ({ ...prev, [name]: value.split(',') })); // Если поле массив, разделяем по запятым
        }  else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (selectedOption: any) => {
        if (selectedOption) {
            const categoryId = selectedOption.value;

            getAllManufacturers(categoryId)

        }
    };

    interface Category {
        label: string;
        value: string;
      }




      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
    
        // Добавляем файлы
        if (formData.manufacturerIcon) {
            form.append('manufacturer_icon', formData.manufacturerIcon[0]); // Первый файл
        }
        if (formData.products) {
            Array.from(formData.products).forEach((file) => {
                form.append('products', file); // Добавляем каждый файл
            });
        }
        
        if (formData.nameRu) {
            form.append('name_ru', formData.nameRu);
        }

        if (formData.nameEn) {
            form.append('name_en', formData.nameEn);
        }

        if (formData.descriptionRu) {
            form.append('description_ru', formData.descriptionRu || '');
        }

        if (formData.descriptionEn) {
            form.append('description_en', formData.descriptionEn);
        }

        if (selectedCategoryIds.length === 0) {

        } else {
            if (selectedCategoryIds.length !== 0) {
                selectedCategoryIds.forEach(id => form.append('category_ids', id));
            }
        }


        if (formData.links.length !== 0) {
            formData.links.forEach(link => form.append('links', link));
        }

        if (formData.phones.length !== 0) {
            formData.phones.forEach(phone => form.append('phones', phone));
        } 
        
        if (formData.actionRu) {
            form.append('action_ru', formData.actionRu || '');
        }

        if (formData.actionEn) {
            form.append('action_en', formData.actionEn || '');
        }

        if (formData.email) {
            form.append('email', formData.email);
        }

        if (formData.videoLink) {
            form.append('video_link', formData.videoLink || '');
        }

        


        // Отправляем форму на сервер
        const token = getToken('access');
        if (idM !== '') {
            const response = await patchManufacturer(form, idM, token, sessionStorage.getItem('csrf_token') || '');
            setSuccess(response.ok);
        } else {
            const response = await createManufacturer(form, token, sessionStorage.getItem('csrf_token') || '');
            setSuccess(response.ok);
        }
    
        if (category) {
            getAllManufacturers(category.value);
        }
    };
    

    const [idM, setIdM] = useState('')

    const [selectedItemId, setSelectedItemId] = useState('');


    // Fetch ad details by ID
    const fetchManufactureDetails = async (ad_id: string) => {
        const token = getToken('access');
        const response = await getManufacturerById(token, ad_id, i18n.language);
        const data = await response.json();
        console.log(data)
        setManufacture(data); // Set ad details for editing
    };


    const handleSelectChangeCategoryPatch = (selectedOptions: any) => {
        const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setSelectedCategoryIds(selectedIds);    };
 
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]); // Состояние для хранения выбранных категорий

    return (
        <div className={s.login}>
            <div className={s.login_wrapper}>
                <AdminNavbar />
                <div className={s.main_content}>
                <form className={s.formModal} onSubmit={handleSubmit}>
                    <div className={s.title_popup}>
                        <p>{i18n.language === 'en' ? 'Creation/changing of manufacture' : 'Создание/изменение производства'}</p>
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Manufacturer id' : 'Айди производителя'}</label>
                        <input placeholder={i18n.language === 'en' ? 'Empty if new' : 'Оставьте пустым, если новое'} type="text" onChange={(e) => setIdM(e.target.value)}  />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Upload your logotype' : 'Загрузите ваш логотип'}</label>
                        <input placeholder='Загрузите ваш логотип' type="file" name="manufacturerIcon" onChange={handleChange} required={idM === ''} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Upload photos(max 10)' : 'Загрузите фотографии(макс. 10)'}</label>
                        <input placeholder={i18n.language === 'en' ? 'Upload photos(max 10)' : 'Загрузите фотографии(макс. 10)'} type="file" name="products" multiple onChange={handleChange} required={idM === ''} />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder={i18n.language === 'en' ? 'Manufacturer name(ru)' : 'Название производства(ru)'} type="text" name="nameRu" onChange={handleChange} required={idM === ''} />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder={i18n.language === 'en' ? 'Manufacturer name(en)' : 'Название производства(en)'} type="text" name="nameEn" onChange={handleChange} required={idM === ''} />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder={i18n.language === 'en' ? 'Description(ru)' : 'Описание(ru)'} name="descriptionRu" onChange={handleChange} />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder={i18n.language === 'en' ? 'Description(en)' : 'Описание(en)'} name="descriptionEn" onChange={handleChange} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Categories' : 'Категории'}</label>
                        <Select
                            options={categories.map(category => ({
                                label: category.label, // Название в зависимости от языка
                                value: category.value // Уникальный идентификатор категории
                            }))}                             onChange={handleSelectChangeCategoryPatch} // Обработчик выбора
                            placeholder={i18n.language === 'en' ? 'Select category...' : 'Выбрать...'}
                            isMulti // Позволяет выбирать несколько категорий
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
                    <div className={s.input_form}>
                        <input placeholder={i18n.language === 'en' ? 'Action(ru)' : 'Акция(ru)'} type="text" name="actionRu" onChange={handleChange} />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder={i18n.language === 'en' ? 'Action(en)' : 'Action(en)'} type="text" name="actionEn" onChange={handleChange} />
                    </div>
                    <div className={s.input_wrapper}>
                        <div className={s.input_form}>
                            <input placeholder={i18n.language === 'en' ? 'Phone numbers' : 'Номера телефонов'} type="text" name="phones" onChange={handleChange} required={idM === ''} />
                        </div>
                        <div className={s.input_form}>
                            <input placeholder={i18n.language === 'en' ? 'Links(ex. first_link, second_link...)' : 'Ссылки через запятую'} type="text" name="links" onChange={handleChange} required={idM === ''} />
                        </div>
                    </div>

                    <div className={s.input_wrapper}>
                        <div className={s.input_form}>
                            <input placeholder={i18n.language === 'en' ? 'Email' : 'Почта'} type="email" name="email" onChange={handleChange} required={idM === ''} />
                        </div>
                        <div className={s.input_form}>
                            <input placeholder={i18n.language === 'en' ? 'Video link' : 'Ссылка на видео'} type="text" name="videoLink" onChange={handleChange} />
                        </div>
                    </div>
        

                    <button style={{marginTop: '20px'}} type="submit">{i18n.language === 'en' ? 'Send' : 'Отправить'}</button>
                    <p style={{ margin: '0 auto', fontSize: '12px', color: success ? 'green' : 'red' }}>
                        {success === true ? (i18n.language === 'en' ? 'Success' : 'Успешно') : success === false ? (i18n.language === 'en' ? 'Error' : 'Ошибка') : ''}
                    </p> 
                </form>


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

                    <div className={s.manufacturers_list}>
                        <div style={{ marginBottom: '-20px' }} className={s.manufacturers_item}>
                            <h2 style={{ marginRight: '17.4%' }}>{i18n.language === 'en' ? 'Manufacture name' : 'Название производства'}</h2>
                            <p>{i18n.language === 'en' ? 'Logotype' : 'Логотип'}</p>
                            <p>{i18n.language === 'en' ? 'Manufacture id' : 'Айди производства'}</p>
                        </div>
                        {manufacturers && manufacturers.length > 0 ? (
                            <div className={s.manufacturer_list}>
                                {manufacturers.map((manufacturer: any) => (
                                    <div className="item_wrapper">

                                    <div key={manufacturer.manufacturer_id} className={s.manufacturer_item}>
                                        <h2
                                        >
                                            {i18n.language === 'en' ? manufacturer.name_en : manufacturer.name_ru}
                                        </h2>
                                        <img style={{ width: '100px', height: '100px', borderRadius: '20px' }} src={manufacturer.logo.url} alt={manufacturer.name_en} />
                                        <p>{manufacturer.manufacturer_id}</p>
                                        <p onClick={() => {
                                            if (selectedItemId === manufacturer.manufacturer_id) {
                                                setSelectedItemId('')
                                            } else {
                                                setSelectedItemId(manufacturer.manufacturer_id)
                                            }
                                            fetchManufactureDetails(manufacturer.manufacturer_id)}} style={{ cursor: 'pointer' }}>{i18n.language === 'en' ? 'Details' : 'Подробнее'}</p>
                                        <p style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteManufacturer(manufacturer.manufacturer_id)}>x {i18n.language === 'en' ? '(Click twice)' : '(Нажмите дважды)'}</p>
                                    </div>
                                        <div className={`${s.grid_container_about_more} ${manufacturer.manufacturer_id === selectedItemId ? s.active : s.unactive}`}>
                                                     <p>{i18n.language === 'en' ? 'Manufacture name' : 'Название производителя'}: {manufacture?.manufacturer 
                                                             ? (i18n.language === 'en' ? manufacture.manufacturer.name_en : manufacture.manufacturer.name_ru) 
                                                             : i18n.language === 'en' ? 'Manufacturer name not available' : 'Имя производителя недоступно'}</p>
                                                
                                                     <p>{i18n.language === 'en' ? 'Manufacture status' : 'Статус производителя'}: {manufacture?.manufacturer 
                                                             ? manufacture.manufacturer.status 
                                                             : i18n.language === 'en' ? 'Status not available' : 'Статус недоступен'}</p>

                                                    <p>{i18n.language === 'en' ? 'Logo' : 'Лого'}:</p>

                                                    <div className={s.image_manufacture}>
                                                                    <img style={{width: '150px'}} src={manufacture?.manufacturer && manufacture?.manufacturer.logo.url}></img>
                                                                    <p>{manufacture?.manufacturer && manufacture?.manufacturer.logo.picture_id}</p>
                                                    </div>
                                                     <p>{i18n.language === 'en' ? 'Images' : 'Изображения'}:</p>
                                                     <div className={s.images_manufacture}>
                                                        {manufacture && manufacture.manufacturer && manufacture.manufacturer.products && manufacture.manufacturer.products.map((item:any) => (
                                                            <div className={s.image_manufacture}>
                                                                    <img style={{width: '150px'}} src={item.url}></img>
                                                                    <p>{item.picture_id}</p>
                                                            </div>
                                                        ))}
                                                     </div>
                                                        <p>{i18n.language === 'en' ? 'Video link' : 'Ссылка на видео'}: {manufacture && manufacture.manufacturer && manufacture.manufacturer.video_link}</p>
                                                        <p style={{marginTop: '20px'}}>{i18n.language === 'en' ? 'Phones' : 'Телефоны'}:</p>

                                                    <div className={s.images_manufacture}>
                                                        {manufacture && manufacture.manufacturer && manufacture.manufacturer.phones && manufacture.manufacturer.phones.map((item:any) => (
                                                            <div className={s.image_manufacture}>
                                                                    <p>{item.number}</p>
                                                            </div>
                                                        ))}
                                                     </div>
                                            </div>
                                    </div>

                                ))}
                            </div>
                        ) : (
                            <p style={{ marginTop: '20px' }}>{i18n.language === 'en' ? 'No manufacturers found' : 'Производители не найдены'}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

