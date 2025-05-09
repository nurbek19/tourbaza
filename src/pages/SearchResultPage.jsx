
import { useState } from 'react';
import '../App.css';

import SingleAdvertisement from './SingleAdvertisement';

import notFoundImage from '../images/image.png';

import { DICTIONARY, TOURS_DURATON_LABELS, TOURS_TYPE_ICONS } from './CreateAdvertisement';

const SearchResultPage = ({ lang, data = [], loading, isData, itemIndex }) => {
    const [activeDoc, setActiveDoc] = useState(null);

    if (loading) {
        return (
            <div className='loading-container'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="40" cy="65">
                        <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                    </circle>
                    <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle>
                    <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle>
                </svg>
            </div>
        )
    }

    if (isData) {
        return (
            <div className='not-found-container'>
                <div className="not-found-info">
                    <img src={notFoundImage} alt="not found" />
                    <p className='info-text'>{DICTIONARY[lang].notFound}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='search-result'>
            {activeDoc ? (
                <div className="edit-modal">
                    <SingleAdvertisement item={activeDoc} lang={lang} onBackHandler={() => setActiveDoc(null)} />
                </div>
            ) : (
                <div className='card-list'>
                    {data.map((item, index) => (
                        <div key={item._id} className="card-container" onClick={() => setActiveDoc(item)}>
                            <div className="card user-card">
                                {item.photo_ids && (
                                    <div className='card-single-image-container'>
                                        <img key={item.photo_ids[0]} src={`https://booklink.pro/tb/tours/photo?id=${item.photo_ids[0]}`} alt="house image" />
                                    </div>
                                )}
                                <div className="card-detail user-card-detail">
                                    <div>
                                        <p className="price-text">{item.company_name}</p>
                                        {item.name && (<p><span>{item.name}</span></p>)}
                                        <p className="price-text">{`${item.tour_type} | ${item.duration_in_days + ' ' + TOURS_DURATON_LABELS[item.duration_in_days]} | ${item.difficulty}`}</p>
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
}

export default SearchResultPage;