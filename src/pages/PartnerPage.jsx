import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import WebApp from '@twa-dev/sdk';

import SingleAdvertisement from './SingleAdvertisement';

import { api } from "../api";
import { TOURS_DURATON_LABELS, TOURS_TYPE_ICONS } from './CreateAdvertisement';


import '../App.css';

const PartnerPage = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [activeDoc, setActiveDoc] = useState(null);
    const [lang, setLang] = useState('ru');


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
                    {data.map((item) => (
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
                                    <p className="price-text">{item.company_name}</p>
                                    {item.name && (<p><span>{item.name}</span></p>)}
                                    <p className="price-text">{`${item.tour_type} | ${item.duration_in_days + ' ' + TOURS_DURATON_LABELS[item.duration_in_days]} | ${item.difficulty}`}</p>
                                    {/* <p className="price-text">{item?.price} сом</p> */}
                                    </div>

                                    {/* <button className='search-button'>Подробнее</button> */}
                                    <p className='card-price-icon'><span>{item.price} сом</span> <i className='tour-type-icon'>{TOURS_TYPE_ICONS[item.tour_type]}</i></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
};

export default PartnerPage;