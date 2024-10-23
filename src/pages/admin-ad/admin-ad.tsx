import { useEffect, useState } from 'react';
import AdminNavbar from '../../shared/navbar/navbar';
import s from './admin-ad.module.css';
import { getAds, getAdById, patchAd, deleteAd, createAd } from '../../shared/api';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { getToken } from '../../App';

export const AdminAd = () => {
    const { i18n } = useTranslation();
    const [ads, setAds] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(25);
    const [adPlacement, setAdPlacement] = useState<string>('Catalog');
    const [adDetails, setAdDetails] = useState<any | null>({
        ad_id: '',
        ad_placement: '',
        manufacturer_id: '',
        site_url: '',
        start_date: '',
        end_date: '',
        banner_picture: null, // Initialize with null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [advert, setAdvert] = useState<any>();
    const [selectedItemId, setSelectedItemId] = useState('');
    
    const adPlacementOptions = [
        { label: 'Catalog', value: 'Catalog' },
        { label: 'Manufacturer page', value: 'Manufacturer page' },
        { label: 'Events catalog', value: 'Events catalog' },
        { label: 'Event page', value: 'Event page' },
    ];

    // Fetch ads from API
    const fetchAds = async () => {
        setIsLoading(true);
        const token = getToken('access');
        const response = await getAds(adPlacement, offset, token);
        const data = await response.json();
        setAds(Array.isArray(data.ads) ? (offset === 0 ? data.ads : [...ads, ...data.ads]) : []);
        setIsLoading(false);
        console.log(data.ads)
    };

    // Fetch ad details by ID
    const fetchAdDetails = async (ad_id: string) => {
        const token = getToken('access');
        const response = await getAdById(ad_id, token);
        const data = await response.json();
        setAdvert(data.ad);
        setAdDetails(data.ad); // Set ad details for editing
    };

    // Handle ad placement change
    const handlePlacementChange = (selectedOption: any) => {
        setAdPlacement(selectedOption.value);
        setAds([]);
        setOffset(0);
    };

    const loadMoreAds = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };

    const handleViewDetails = (ad_id: string) => {
        fetchAdDetails(ad_id);
        setSelectedItemId(ad_id);
        if (ad_id === selectedItemId) {
            setSelectedItemId('')
        }
    };

    // Save or update ad
    const handleSaveAd = async (adData: any) => {
        const adId = adData.ad_id || '';
        const token = getToken('access');
        
        const formData = new FormData();
        if (adData.ad_placement) {
            formData.append('ad_placement', adData.ad_placement);
        } else {
            console.error("ad_placement is missing");
        }

        if (adData.manufacturer_id) {
            formData.append('manufacturer_id', adData.manufacturer_id);
        } else {
            console.error("manufacturer_id is missing");
        }

        if (adData.start_date) {
            formData.append('start_date', adData.start_date);
        } else {
            console.error("start_date is missing");
        }

        if (adData.site_url) {
            formData.append('site_url', adData.site_url);
        } else {
            console.error("site_url is missing");
        }

        if (adData.end_date) {
            formData.append('end_date', adData.end_date);
        } else {
            console.error("end_date is missing");
        }
        
        if (adData.banner_picture) {
            formData.append('banner_picture', adData.banner_picture);
        } else {
            console.error("banner_picture is missing");
        }


        let response;
        if (adData.ad_id !== '') {
            response = await patchAd(formData, adId, token, sessionStorage.getItem('csrf_token') || '');
        } else {
            response = await createAd(formData, token, sessionStorage.getItem('csrf_token') || '');
            
        }
        if (response.ok) {
            fetchAds()
            setSuccess(true);
            setAdDetails({
                ad_id: '',
                ad_placement: '',
                manufacturer_id: '',
                site_url: '',
                start_date: '',
                end_date: '',
                banner_picture: null, 
            })
        } else {
            setSuccess(false);
        }
    };

    // Delete ad
    const handleDeleteAd = async (ad_id: string) => {
        const token = getToken('access');
        const response = await deleteAd(ad_id, token, sessionStorage.getItem('csrf_token') || '');
        if (response.ok) {
            setAds(ads.filter((ad) => ad.ad_id !== ad_id));
        }
    };

    useEffect(() => {
        fetchAds();
    }, [adPlacement, offset]);

    const [success, setSuccess] = useState<any>()

    return (
        <div className={s.login}>
            <div className={s.login_wrapper}>
                <AdminNavbar />
                <div className={s.main_content}>
                    <Select
                        options={adPlacementOptions}
                        onChange={handlePlacementChange}
                        value={adPlacementOptions.find(option => option.value === adPlacement)}
                        placeholder={i18n.language === 'en' ? 'Select placement...' : 'Выбрать место размещения...'}
                    />

                    {adDetails && (
                        <div className={s.ad_details}>
                            <h3>{adDetails.title}</h3>
                            <form className={s.ad_details} onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveAd(adDetails);
                            }}>
                                <h2 style={{fontSize: '14px'}}>{i18n.language === 'en' ? 'Create/patch ad' : 'Создать/изменить рекламу'}</h2>
                                <input
                                    type="text"
                                    value={adDetails.ad_id}
                                    onChange={(e) => setAdDetails({ ...adDetails, ad_id: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Ad id(empty if creation)' : 'Айди рекламы(пусто при создании)'}
                                />
                                <input
                                    type="text"
                                    value={adDetails.ad_placement}
                                    onChange={(e) => setAdDetails({ ...adDetails, ad_placement: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Ad Placement(ex. Catalog)' : 'Место размещения(пр. Catalog)'}
                                />
                                <input
                                    type="text"
                                    value={adDetails.manufacturer_id}
                                    onChange={(e) => setAdDetails({ ...adDetails, manufacturer_id: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Manufacturer id' : 'Айди производителя'}
                                />
                                <input
                                    type="text"
                                    value={adDetails.site_url}
                                    onChange={(e) => setAdDetails({ ...adDetails, site_url: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'URL site' : 'Ссылка на сайт'}
                                />
                                <input
                                    type="date"
                                    value={adDetails.start_date}
                                    onChange={(e) => setAdDetails({ ...adDetails, start_date: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'Start Date' : 'Дата начала'}
                                />
                                <input
                                    type="date"
                                    value={adDetails.end_date}
                                    onChange={(e) => setAdDetails({ ...adDetails, end_date: e.target.value })}
                                    placeholder={i18n.language === 'en' ? 'End Date' : 'Дата окончания'}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setAdDetails({ ...adDetails, banner_picture: e.target.files[0] });
                                        }
                                    }}
                                    placeholder={i18n.language === 'en' ? 'Upload banner image' : 'Загрузите изображение баннера'}
                                />

                                <button className={s.saveButton} type="submit">{i18n.language === 'en' ? 'Save' : 'Сохранить'}</button>
                                <p style={{ fontSize: '12px', color: success ? 'green' : 'red' }}>
                                    {success === true ? (i18n.language === 'en' ? 'Success' : 'Успешно') : success === false ? (i18n.language === 'en' ? 'Error' : 'Ошибка') : ''}
                                </p> 
                            </form>
                        </div>
                    )}

                    <div className={s.ad_list}>
                        <div className={s.manufacturers_item}>
                            <p>{i18n.language === 'en' ? 'Page' : 'Страница'}</p>
                            <p style={{paddingRight: '10.5%'}}>{i18n.language === 'en' ? 'Manufacture ID' : 'Айди производителя'}</p>
                            <p style={{marginRight: '-0.6%'}}>{i18n.language === 'en' ? 'Start date' : 'Дата начала'}</p>
                            <p style={{marginRight: '-3%'}}>{i18n.language === 'en' ? 'End date' : 'Дата завершения'}</p>
                            <p>{i18n.language === 'en' ? 'Ad ID' : 'Айди рекламы'}</p>

                        </div>
                        {ads.length > 0 ? (
                            <div className={s.list}>
                                {ads.map((ad) => (
                                    <div className={s.item_wrapper} key={ad.ad_id}>
                                        <div className={s.manufacturer_item}>
                                            <p>{ad.ad_placement}</p>
                                            <p>{ad.manufacturer_id}</p>
                                            <p>{ad.start_date}</p>
                                            <p>{ad.end_date}</p>
                                            <p>{ad.ad_id}</p>
                                            <button onClick={() => handleViewDetails(ad.ad_id)}>
                                                {i18n.language === 'en' ? 'Details' : 'Подробнее'}
                                            </button>
                                            <button onClick={() => handleDeleteAd(ad.ad_id)}>
                                                {i18n.language === 'en' ? 'Delete' : 'Удалить'} {i18n.language === 'en' ? '(Click twice)' : '(Нажмите дважды)'}
                                            </button>
                                        </div>

                                        <div className={`${s.grid_container_about_more} ${ad.ad_id === selectedItemId ? s.active : s.unactive}`}>
                                            <p>{i18n.language === 'en' ? 'Manufacture name' : 'Название производителя'}:</p>
                                            <p>
                                                {advert?.manufacturer 
                                                    ? (i18n.language === 'en' ? advert.manufacturer.name_en : advert.manufacturer.name_ru) 
                                                    : i18n.language === 'en' ? 'Manufacturer name not available' : 'Имя производителя недоступно'}
                                            </p>
                                            <p>{i18n.language === 'en' ? 'Manufacture status' : 'Статус производителя'}:</p>
                                            <p>
                                                {advert?.manufacturer 
                                                    ? advert.manufacturer.status 
                                                    : i18n.language === 'en' ? 'Status not available' : 'Статус недоступен'}
                                            </p>  
                                            <p>{i18n.language === 'en' ? 'Image id' : 'Айди изображения'}:</p>
                                            <p>{advert?.picture && advert.picture.picture_id}
                                            </p>
                                            </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{fontSize: '12px', margin: '10px 0px'}}>{i18n.language === 'en' ? 'No ads found' : 'Объявления не найдены'}</p>
                        )}
                    </div>

                    <button className={s.loadMoreBtn} onClick={loadMoreAds} disabled={isLoading}>
                        {i18n.language === 'en' ? 'Load more' : 'Загрузить ещё'}
                    </button>
                </div>
            </div>
        </div>
    );
};
