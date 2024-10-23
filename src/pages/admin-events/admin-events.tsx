import { useEffect, useState } from 'react';
import AdminNavbar from '../../shared/navbar/navbar';
import s from './admin-events.module.css';
import { deleteEvent, getEvents, getEventById, createEvent, patchEvent } from '../../shared/api';
import { useTranslation } from 'react-i18next';
import { getToken } from '../../App';

export const AdminEvents = () => {
    const [eventId, setEventId] = useState(''); 
    const [events, setEvents] = useState<any[]>([]);
    const { i18n } = useTranslation();
    const [offset, ] = useState(0);
    const [success, setSuccess] = useState<any>()
    const [eventData, setEventData] = useState<any>({
        title_ru: '',
        title_en: '',
        description_ru: '',
        description_en: '',
        event_date: '',
        contact_info_ru: '',
        contact_info_en: '',
        pictures: null,
        video_link: '',
        place: ''
    });




    useEffect(() => {
        getAllEvents();
  
    }, []);

    // const loadEventData = async (id: string) => {
    //     const token = getToken('access');
    //     const response = await getEventById(id, token, i18n.language);
    //     const data = await response.json();
    //     setEventData(data);
    // };

    const getAllEvents = async () => {
        const token = getToken('access');
        const response = await getEvents(token, i18n.language, offset);
        const data = await response.json();
        setEvents(data.events);
        console.log(data)
    };

    const deleteEventById = async (id: string) => {
        const token = getToken('access');
        await deleteEvent(id, token, sessionStorage.getItem('csrf_token') || '');
        getAllEvents(); // Обновляем список после удаления
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const { value } = e.target;
        setEventData({ ...eventData, [name]: value });
        
        setEventData((prev:any) => ({ ...prev, [name]: value }));
        
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const fileList = e.target.files;
        setEventData({ ...eventData, [name]: fileList });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();

        if (eventData.pictures) {
            Array.from(eventData.pictures).forEach((file: any) => {
                form.append('pictures', file);
            });
        }


        if (eventData.title_ru){
            form.append('title_ru', eventData.title_ru);
        }

        if (eventData.title_en) {
            form.append('title_en', eventData.title_en);
        }

        if (eventData.description_ru){
            form.append('description_ru', eventData.description_ru || '');
        }

        if (eventData.description_en){
            form.append('description_en', eventData.description_en || '');
        }

        if (eventData.event_date){
            form.append('event_date', eventData.event_date);
        }

        if (eventData.contact_info_ru) {
            form.append('contact_info_ru', eventData.contact_info_ru);
        }

        if (eventData.contact_info_en) {
            form.append('contact_info_en', eventData.contact_info_en);
        }

        if (eventData.video_link) {
            form.append('video_link', eventData.video_link);
        } 
        
        if (eventData.place) {
            form.append('place', eventData.place);
        } 


        const token = getToken('access');

        if (eventId !== '') {
            const response = await patchEvent(form, eventId, token, sessionStorage.getItem('csrf_token') || '');
            if (response.ok) {
                setSuccess(true);
            } else {
                setSuccess(false);
            }
        } else {
            const response = await createEvent(form, token, sessionStorage.getItem('csrf_token') || '');
            if (response.ok) {
                setSuccess(true);
                setEventData({
                    title_ru: '',
                    title_en: '',
                    description_ru: '',
                    description_en: '',
                    event_date: '',
                    contact_info_ru: '',
                    contact_info_en: '',
                    pictures: null,
                    video_link: '',
                    place: ''
                });
            
            } else {
                setSuccess(false);
                setEventData({
                    title_ru: '',
                    title_en: '',
                    description_ru: '',
                    description_en: '',
                    event_date: '',
                    contact_info_ru: '',
                    contact_info_en: '',
                    pictures: null,
                    video_link: '',
                    place: ''
                });
            }
        }

        getAllEvents(); 
    };

    const [selectedItemId, setSelectedItemId] = useState('');
    const [eventItem, setEventItem] = useState<any>()

    // Fetch ad details by ID
    const fetchManufactureDetails = async (ad_id: string) => {
        const token = getToken('access');
        const response = await getEventById(ad_id, token, i18n.language);
        const data = await response.json();
        setEventItem(data); // Set ad details for editing
    };

 

    return (
        <div className={s.login}>
            <div className={s.login_wrapper}>
                <AdminNavbar />
                <div className={s.main_content}>
                <form className={s.formModal} onSubmit={handleSubmit}>
                    <div className={s.title_popup}>
                        <p>{eventId ? (i18n.language === 'en' ? 'Update/Patch Event' : 'Создать/Обновить событие') : (i18n.language === 'en' ? 'Create/Patch Event' : 'Создать/Обновить событие')}</p>
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Event ID' : 'Айди события'}</label>
                        <input placeholder={i18n.language === 'en' ? 'Empty if new' : 'Пусто если новое'} type="text" value={eventId} onChange={(e) => setEventId(e.target.value)} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Title (RU)' : 'Название (RU)'}</label>
                        <input type="text" name="title_ru" value={eventData.title_ru} onChange={(e) => handleInputChange(e, 'title_ru')} required={eventId === ''} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Title (EN)' : 'Название (EN)'}</label>
                        <input type="text" name="title_en" value={eventData.title_en} onChange={(e) => handleInputChange(e, 'title_en')} required={eventId === ''} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Description (RU)' : 'Описание (RU)'}</label>
                        <input name="description_ru" value={eventData.description_ru} onChange={(e) => handleInputChange(e, 'description_ru')} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Description (EN)' : 'Описание (EN)'}</label>
                        <input name="description_en" value={eventData.description_en} onChange={(e) => handleInputChange(e, 'description_en')} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Event Date' : 'Дата события'}</label>
                        <input type="date" name="event_date" value={eventData.event_date} onChange={(e) => handleInputChange(e, 'event_date')} required={eventId === ''} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Place' : 'Расположение'}</label>
                        <input name="place" value={eventData.place} onChange={(e) => handleInputChange(e, 'place')} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Contact Info (RU)' : 'Контактная информация (RU)'}</label>
                        <input name="contact_info_ru" value={eventData.contact_info_ru} onChange={(e) => handleInputChange(e, 'contact_info_ru')} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Contact Info (EN)' : 'Контактная информация (EN)'}</label>
                        <input name="contact_info_en" value={eventData.contact_info_en} onChange={(e) => handleInputChange(e, 'contact_info_en')} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Upload Event Pictures' : 'Загрузить изображения события'}</label>
                        <input type="file" name="pictures" multiple onChange={(e) => handleImageChange(e, 'pictures')} />
                    </div>
                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Video Link' : 'Ссылка на видео'}</label>
                        <input type="text" name="video_link" value={eventData.video_link} onChange={(e) => handleInputChange(e, 'video_link')} />
                    </div>

                    <button style={{marginTop: '20px'}} type="submit">
                        {eventId ? (i18n.language === 'en' ? 'Update Event' : 'Обновить событие') : (i18n.language === 'en' ? 'Create Event' : 'Создать событие')}
                    </button>
                    <p style={{ margin: '0 auto', fontSize: '12px', color: success ? 'green' : 'red' }}>
                        {success === true ? (i18n.language === 'en' ? 'Success' : 'Успешно') : success === false ? (i18n.language === 'en' ? 'Error' : 'Ошибка') : ''}
                    </p> 
              </form>


                    <div className={s.events_list}>
                        <div style={{ marginBottom: '-20px' }} className={s.events_item}>
                            <h2>{i18n.language === 'en' ? 'Event Title' : 'Название события'}</h2>
                            <p>{i18n.language === 'en' ? 'Event ID' : 'Айди события'}</p>
                        </div>
                        {events && events.length > 0 ? (
                            <div className={s.event_list}>
                                {events.map((event: any) => (
                                 <div className="item_wrapper">

                                    <div key={event.event_id} className={s.event_item}>
                                        <h2>
                                            {i18n.language === 'en' ? event.title_en : event.title_ru}
                                        </h2>
                                        <p>{event.event_id}</p>
                                        <p style={{cursor: 'pointer'}} onClick={() => {
                                            if (selectedItemId === event.event_id) {
                                                setSelectedItemId('')
                                            } else {
                                                setSelectedItemId(event.event_id)
                                            }
                                            fetchManufactureDetails(event.event_id)}}>Подробнее</p>
                                        <p style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteEventById(event.event_id)}>x {i18n.language === 'en' ? '(Click twice)' : '(Нажмите дважды)'}</p>
                                    </div>

                                {eventItem && eventItem.event && (<div className={`${s.grid_container_about_more} ${event.event_id === selectedItemId ? s.active : s.unactive}`}>
                                    <p>{i18n.language === 'en' ? 'Manufacture name' : 'Название производителя'}: {eventItem && eventItem?.event 
                                            ? (i18n.language === 'en' ? eventItem.event.title_en : eventItem.event.title_ru) 
                                            : i18n.language === 'en' ? 'Manufacturer name not available' : 'Имя производителя недоступно'}</p>

                                    <p>{i18n.language === 'en' ? 'Manufacture status' : 'Статус производителя'}: {eventItem && eventItem?.event 
                                            ? i18n.language === 'en' ? eventItem.event.description_en : eventItem.event.description_ru
                                            : i18n.language === 'en' ? 'Status not available' : 'Статус недоступен'}</p>

                                    <p>{i18n.language === 'en' ? 'Images' : 'Изображения'}:</p>
                                    <div className={s.images_manufacture}>
                                    {eventItem && eventItem.event && eventItem.event.pictures && eventItem.event.pictures.map((item:any) => (
                                        <div className={s.image_manufacture}>
                                                <img style={{width: '150px'}} src={item.url}></img>
                                                <p>{item.picture_id}</p>
                                        </div>
                                    ))}
                                    </div>
                                    <p>{i18n.language === 'en' ? 'Contact info' : 'Контакты'}: {eventItem && eventItem.event && i18n.language === 'en' ? eventItem.event.contact_info_en : eventItem.event.contact_info_ru}</p>
                                    <p>{i18n.language === 'en' ? 'Event date' : 'Дата события'}: {eventItem && eventItem.event && eventItem.event.event_date}</p>
                                    <p>{i18n.language === 'en' ? 'Description' : 'Описание'}: {eventItem && eventItem.event && i18n.language === 'en' ? eventItem.event.description_en : eventItem.event.description_ru}</p>

                                    </div>)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ marginTop: '20px' }}>{i18n.language === 'en' ? 'No events found' : 'События не найдены'}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
