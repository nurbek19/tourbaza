import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import WebApp from '@twa-dev/sdk';

import { format, addDays, startOfDay, isAfter, isSameDay } from "date-fns";
import { ru } from "react-day-picker/locale";

import SingleAdvertisement from './SingleAdvertisement';

import { api } from "../api";
import { TOURS_DURATON_LABELS, TOURS_TYPE_ICONS } from './CreateAdvertisement';


import '../App.css';


function getRecentDays(dates = []) {
    if (!dates.length) {
        return [];
    }

    const now = new Date();
    const today = startOfDay(new Date());

    const tomorrow = startOfDay(addDays(now, 1));
    const sixPM = new Date(today);
    sixPM.setHours(18, 0, 0, 0);

    const excludeTomorrow = now > sixPM;

    const futureDates = dates.filter(date => {
        if (isSameDay(date, today)) return false;

        if (excludeTomorrow && isSameDay(date, tomorrow)) return false; //в будущем добавить проверку существует ли дата на завтра


        return isAfter(date, today);
    });

    if (!futureDates.length) {
        return [];
    }

    if (futureDates.length > 2) {
        return futureDates.slice(0, 2);
    }

    return futureDates;
}

const PartnerPage = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [activeDoc, setActiveDoc] = useState(null);
    const [lang, setLang] = useState('ru');

    const byLink = searchParams.get('bylink');


    const fetchData = () => {
        const id = searchParams.get('owner_id');

        api.get(`/tours?owner_id=${id}`).then((res) => {
            if (res.data) {
                setData(res.data);

                // if (res.data.length === 1) {
                //     setActiveDoc(res.data[0])
                // }
                // console.log(res.data);
            }
        })
    };

    useEffect(() => {
        WebApp.expand();
        fetchData();
    }, []);

    useEffect(() => {
        const language = searchParams.get('lang');
    
        if (language) {
          setLang(language);
        }
        
      }, []);

    return (
        <div>
            {activeDoc ? (
                <div className="edit-modal">
                    <SingleAdvertisement item={activeDoc} lang={lang} onBackHandler={() => setActiveDoc(null)} hideButton={data.length === 1} />
                </div>
            ) : (
                <div className='card-list'>
                    {data && (
                        <p className="company-name">
                            {data[0]?.company_name}
                        </p>
                    )}
                    {data.map((item) => {
                        const recentDays = getRecentDays(item.available_dates);

                        return (
                            <div key={item._id} className="card-container" onClick={() => setActiveDoc(item)}>
                                <div className="card user-card">
                                {item.photo_ids && (
                                        <div className='card-single-image-container'>
                                            {/* <ImageSlider imageIds={item.photo_ids} /> */}
    
                                            <img key={item.photo_ids[0]} src={`https://booklink.pro/tb/tours/photo?id=${item.photo_ids[0]}`} alt="house image" />
                                        </div>
                                    )}
                                    <div className="card-detail user-card-detail">
                                        <div>
                                        {!byLink && <p className="price-text">{item.company_name}</p>}
                                        {item.name && (<p><span>{item.name}</span></p>)}
                                        <p className="price-text">{`${item.tour_type} | ${item.duration_in_days + ' ' + TOURS_DURATON_LABELS[item.duration_in_days]} | ${item.difficulty}`}</p>
                                        {/* <p className="price-text">{item?.price} сом</p> */}
                                        </div>
    
                                        {/* <button className='search-button'>Подробнее</button> */}
                                        <p className='card-price-icon'>
                                            <span>{item.price} сом</span>
                                            <span className='price-text'> {recentDays.map((d) => (format(new Date(d), 'd MMM', { locale: ru }))).join(', ')}</span>
                                            <i className='tour-type-icon'>{TOURS_TYPE_ICONS[item.tour_type]}</i>
                                            </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
};

export default PartnerPage;