import React, { useState } from 'react';
import s from './popup-form.module.css';
import { sendForm } from '../api';

interface PopupFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const PopupForm: React.FC<PopupFormProps> = ({ isOpen, onClose }) => {
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
        videoLink: ''
    });

    const handleChange = (e: any) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev) => ({ ...prev, [name]: files }));
        } else if (name === "categoryIds" || name === "links" || name === "phones") {
            setFormData((prev) => ({ ...prev, [name]: value.split(',') })); // Если поле массив, разделяем по запятым
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
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
        
        // Добавляем остальные поля
        form.append('name_ru', formData.nameRu);
        form.append('name_en', formData.nameEn);
        form.append('description_ru', formData.descriptionRu || '');
        form.append('description_en', formData.descriptionEn || '');
        
        // Добавляем массивы
        formData.categoryIds.forEach(id => form.append('category_ids', id));
        formData.links.forEach(link => form.append('links', link));
        formData.phones.forEach(phone => form.append('phones', phone));
        
        form.append('action_ru', formData.actionRu || '');
        form.append('action_en', formData.actionEn || '');
        form.append('email', formData.email);
        form.append('video_link', formData.videoLink || '');

        // Отправка данных
        sendForm(form).then(() => {
            onClose();
        }).catch(err => {
            console.error(err);
            alert('Произошла ошибка при отправке заявки.');
        });
    };


    if (!isOpen) return null;


    return (
        <div className={s.popup}>
            <div className={s.popup_content}>
                <div className={s.title_popup}>
                    <h2>Заполните форму</h2>
                    <span className={s.close} onClick={onClose}>&times;</span>
                </div>
                <form className={s.formModal} onSubmit={handleSubmit}>
                    <div className={s.input_form}>
                        <label>Загрузите ваш логотип</label>
                        <input placeholder='Загрузите ваш логотип' type="file" name="manufacturerIcon" onChange={handleChange} required />
                    </div>
                    <div className={s.input_form}>
                        <label>Загрузите фото (до 10 шт.)</label>
                        <input placeholder='Загрузите фото (до 10 шт.)' type="file" name="products" multiple onChange={handleChange} required />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder='Название компании (RU)' type="text" name="nameRu" onChange={handleChange} required />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder='Название компании (EN)' type="text" name="nameEn" onChange={handleChange} required />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder='Описание на русском языке' name="descriptionRu" onChange={handleChange} />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder='Описание на английском языке' name="descriptionEn" onChange={handleChange} />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder='Категории (через запятую)' type="text" name="categoryIds" onChange={handleChange} required />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder='Действие (RU)' type="text" name="actionRu" onChange={handleChange} />
                    </div>
                    <div className={s.input_form}>
                        <input placeholder='Действие (EN)' type="text" name="actionEn" onChange={handleChange} />
                    </div>
                    <div className={s.input_wrapper}>
                        <div className={s.input_form}>
                            <input placeholder='Телефоны (через запятую)' type="text" name="phones" onChange={handleChange} required />
                        </div>
                        <div className={s.input_form}>
                            <input placeholder='Ссылки (через запятую)' type="text" name="links" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className={s.input_wrapper}>
                        <div className={s.input_form}>
                            <input placeholder='Почта' type="email" name="email" onChange={handleChange} required />
                        </div>
                        <div className={s.input_form}>
                            <input placeholder='Ссылка на видео' type="text" name="videoLink" onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit">Отправить</button>
                </form>
            </div>
        </div>
    );
};

export default PopupForm;