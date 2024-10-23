import { useEffect, useState } from 'react';
import AdminNavbar from '../../shared/navbar/navbar';
import s from './admin-costumes.module.css';
import { getCostumes, patchCostume, deleteCostume, createCostume, getCategories } from '../../shared/api'; // Обновленные API методы для костюмов
import { useTranslation } from 'react-i18next';
import { getToken } from '../../App';
import Select from 'react-select';

export const AdminCostumes = () => {
    const { i18n } = useTranslation();
    const [costumes, setCostumes] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [limit,] = useState(25); // Лимит по умолчанию
    const [costumeDetails, setCostumeDetails] = useState<any | null>({ costume_id: '', title_ru: '', title_en: '', category_ids: [] }); // Инициализируем пустую форму для создания нового костюма
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]); // Состояние для хранения выбранных категорий

    // Получить костюмы
    const fetchCostumes = async () => {
        setIsLoading(true);
        const token = getToken('access');
        const response = await getCostumes(token, i18n.language, offset);
        const data = await response.json();
        if (offset === 0) {
            setCostumes(() => [...data.costumes]);
        } else {
            setCostumes((prevCostumes) => [...prevCostumes, ...data.costumes]); // Подгрузка новых костюмов
        }
        setIsLoading(false);
    };

    // Получить подробности костюма


    // Подгрузить ещё костюмы
    const loadMoreCostumes = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };


    // Обновить или создать костюм
    const handleSaveCostume = async (costumeData: any) => {
        const costumeId = costumeData.costume_id || ''; // Если ID пустое, создаст новый костюм
        const token = getToken('access');
        const data = {
            title_ru: costumeData.title_ru,
            title_en: costumeData.title_en,
            category_ids: selectedCategoryIds // Предохранение от null или undefined
        };
        console.log(data)
        let response;
        if (costumeData.costume_id !== '') {
            response = await patchCostume(data, costumeId, token, sessionStorage.getItem('csrf_token') || ''); // Patch запрос для обновления костюма
        } else {
            response = await createCostume(data, token, sessionStorage.getItem('csrf_token') || ''); // Create запрос для создания костюма
        }

        if (response.ok) {
            fetchCostumes(); // Обновляем список костюмов
            setSuccess(true);
            setCostumeDetails({ costume_id: '', title_ru: '', title_en: '', category_ids: [] });
            setSelectedCategoryIds([])


        } else {
            setSuccess(false);
            setCostumeDetails({ costume_id: '', title_ru: '', title_en: '', category_ids: [] });
            setSelectedCategoryIds([])

        }
    }

    // Удалить костюм
    const handleDeleteCostume = async (costume_id: string) => {
        const token = getToken('access');
        const response = await deleteCostume(costume_id, token, sessionStorage.getItem('csrf_token') || '');
        if (response.ok) {
            setCostumes(costumes.filter((costume) => costume.costume_id !== costume_id)); // Убираем из списка
        }
    };

    useEffect(() => {
        fetchCostumes(); // Загружаем костюмы при изменении offset
    }, [offset]);

    
    const handleSelectChangeCategoryPatch = (selectedOptions: any) => {
        const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setSelectedCategoryIds(selectedIds);

    };

    const [categories, setCategories] = useState<Category[]>([]);

    const getAllCategories = async () => {
        const response = await getCategories(i18n.language === 'en' ? 'en' : 'ru');
        const data = await response.json();
        const formattedCategories = data.categories.map((category: any) => ({
            label: i18n.language === 'en' ? category.name_en : category.name_ru,
            value: category.category_id,
        }));
        setCategories(formattedCategories);
    };

    useEffect(() => {
        getAllCategories()
    }, [])

    interface Category {
        label: string;
        value: string;
      }

      const [success, setSuccess] = useState<any>()

    return (
        <div className={s.login}>
            <div className={s.login_wrapper}>
                <AdminNavbar />
                <div className={s.main_content}>
                {costumeDetails && (
                        <div className={s.costume_details}>
                            {/* Форма для изменения костюма */}
                            <form
                                className={s.costume_details}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSaveCostume(costumeDetails);
                                }}
                            >
                                <h2 style={{ fontSize: '14px' }}>{i18n.language === 'en' ? 'Create/Update Costume' : 'Создание/Изменение костюма'}</h2>
                                <input
                                    type="text"
                                    value={costumeDetails.costume_id}
                                    onChange={(e) => setCostumeDetails({ ...costumeDetails, costume_id: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Costume ID(empty if new)' : 'Айди костюма(пусто если новый)'}
                                />
                                <input
                                    type="text"
                                    value={costumeDetails.title_ru}
                                    onChange={(e) => setCostumeDetails({ ...costumeDetails, title_ru: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Title (RU)' : 'Название (RU)'}
                                />
                                <input
                                    type="text"
                                    value={costumeDetails.title_en}
                                    onChange={(e) => setCostumeDetails({ ...costumeDetails, title_en: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Title (EN)' : 'Название (EN)'}
                                />
                                    {/*value={(costumeDetails.category_ids || []).join(', ')} // Защита от null*/}


                                    <div className={s.input_form}>
                        <label>{i18n.language === 'en' ? 'Categories' : 'Категории'}</label>
                        <Select
                            options={categories.filter((category: any) =>
                                !selectedCategoryIds.includes(category.value) // Фильтруем выбранные категории
                            )}
                            value={categories.filter((category: any) => 
                                selectedCategoryIds.includes(category.value) // Отображаем выбранные категории в select
                            )}
                            onChange={handleSelectChangeCategoryPatch}
                            placeholder={i18n.language === 'en' ? 'Select category...' : 'Выбрать...'}
                            isMulti
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
                                <button className={s.saveButton} type="submit">
                                    {i18n.language === 'en' ? 'Save' : 'Сохранить'}
                                </button>
                                <p style={{ fontSize: '12px', color: success ? 'green' : 'red' }}>
                                    {success === true ? (i18n.language === 'en' ? 'Success' : 'Успешно') : success === false ? (i18n.language === 'en' ? 'Error' : 'Ошибка') : ''}
                                </p> 
                            </form>
                        </div>
                    )}

                    
                    <div className={s.costume_list}>
                        <div className={s.costume_item}>
                            <p>{i18n.language === 'en' ? 'Name' : 'Имя'}</p>
                            <p>{i18n.language === 'en' ? 'Categories' : 'Категории'}</p>
                            <p>{i18n.language === 'en' ? 'Costume id' : 'Айди костюма'}</p>
                        </div>
                        {costumes && costumes.length > 0 ? (
                            <div className={s.list}>
                                {costumes.map((costume) => (
                                    <div className={s.item_wrapper} key={costume.costume_id}>
                                        <div className={s.costume_item}>
                                            <p>{i18n.language === 'en' ? costume.title_en : costume.title_ru}</p>
                                            <p>{(costume.category_ids || []).join(', ')}</p> {/* Защита от null */}
                                            <p>{costume.costume_id}</p>
                                            <button onClick={() => handleDeleteCostume(costume.costume_id)}>
                                                {i18n.language === 'en' ? 'Delete' : 'Удалить'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: '12px', margin: '10px 0px' }}>{i18n.language === 'en' ? 'No costumes found' : 'Костюмы не найдены'}</p>
                        )}
                    </div>

                    {/* Кнопка для загрузки ещё */}
                    <button className={s.loadMoreBtn} onClick={loadMoreCostumes} disabled={isLoading}>
                        {i18n.language === 'en' ? 'Load more' : 'Загрузить ещё'}
                    </button>

                    {/* Подробности костюма (анимация может быть добавлена через CSS) */}
                   
                </div>
            </div>
        </div>
    );
};
