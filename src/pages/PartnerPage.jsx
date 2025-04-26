import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import WebApp from '@twa-dev/sdk';

import SingleAdvertisement from './SingleAdvertisement';

import { api } from "../api";


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
                            <div className="card">
                            {item.photo_ids && (
                                    <div className='card-single-image-container'>
                                        {/* <ImageSlider imageIds={item.photo_ids} /> */}

                                        <img key={item.photo_ids[0]} src={`https://booklink.pro/bl/houses/photo?id=${item.photo_ids[0]}`} alt="house image" />
                                    </div>
                                )}
                                <div className="card-detail">
                                    {item.name && (<p><span>{item.name}</span></p>)}
                                    {/* <p>
                                        <a href={`https://2gis.kg/search/${encodeURIComponent(item.city + ' ' + item.address)}`} target='_blank'><span>📍</span> {item.city}, {item.address}</a>
                                    </p> */}
                                    <p>{item?.price} сом</p>

                                    {/* <div className="card-prices">
                                        {Object.entries(item.price).map(([key, value]) => {
                                            if (!value) {
                                                return null;
                                            }

                                            return (
                                                <div key={key}>{DICTIONARY[lang][key]} {value}</div>
                                            );
                                        })}
                                    </div> */}
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