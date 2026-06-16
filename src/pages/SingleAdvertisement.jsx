import { useMemo, useState, useEffect } from 'react';

import ImageSlider from "../components/ImageSlider";
import AnimatedBottomButton from './AnimatedBottomButton';
import '../App.css';

import { DICTIONARY } from './CreateAdvertisement';
import clsx from 'clsx';


import { ExpandableText } from './ExpandableText';

import { TOURS_DURATON_LABELS } from './CreateAdvertisement';
import TourPayment from './TourPayment';

const SingleAdvertisement = ({ item, lang, onBackHandler, hideButton }) => {
    const [isPayment, setPaymentPage] = useState(false);


    return (
        <div>
            {isPayment ? (
                <TourPayment item={item} onBackHandler={() => setPaymentPage(false)} lang={lang} />
            ) : (
                <div className='search-container'>
                    <div className="back-button back-button-padding" onClick={onBackHandler}>« {DICTIONARY[lang].back}</div>
                    <div className={clsx('single-result-card')}>
                        
                        <div className="">
                            <div className="single-card">
                            <p className="company-name">
                                        {item.company_name}
                                    </p>

                                {item.photo_ids && (
                                    <ImageSlider imageIds={item.photo_ids} />
                                )}
                                <div className="card-detail single-card-detail">
                                    <p className="bold-title">
                                        {item.name}

                                        <span className='price-label'>{item.price} сом{item.price_weekend > 0 ? ` / ${item.price_weekend} сом` : ''}</span>
                                    </p>

                                    <div className='tour-details'>
                                        <p>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                            Детали тура:
                                        </p>
                                        <div className='tour-detail'>
                                            <span>Длительность</span>
                                            {/* <span className="dots"></span> */}
                                            <p>{`${item.duration_in_days} ${TOURS_DURATON_LABELS[item.duration_in_days]}`}</p>
                                        </div>

                                        <div className='tour-detail'>
                                            <span>Тип</span>
                                            {/* <span className="dots"></span> */}
                                            <p>{item.tour_type}</p>
                                        </div>

                                        <div className='tour-detail'>
                                            <span>Уровень сложности</span>
                                            {/* <span className="dots"></span> */}
                                            <p>{item.difficulty}</p>
                                        </div>

                                        <div className='tour-detail'>
                                            <span>Стоимость за человека{item.price_weekend > 0 ? ' (будни)' : ''}</span>
                                            {/* <span className="dots"></span> */}
                                            <p>{item.price} сом</p>
                                        </div>

                                        {item.price_weekend > 0 && (
                                            <div className='tour-detail'>
                                                <span>Стоимость за человека (выходные)</span>
                                                <p>{item.price_weekend} сом</p>
                                            </div>
                                        )}
                                    </div>

                                    {item.description && (
                                        <div className='advertisement-description'>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                                Описание:
                                            </span>
                                            <br />
                                            <ExpandableText>
                                                {item.description}
                                            </ExpandableText>
                                        </div>
                                    )}

                                    <p className='advertisement-description'>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                            Место сбора:
                                        </span>
                                        <br />
                                        {item.location}
                                    </p>

                                    <a href={`https://t.me/${item.nick_name ?? ''}`} className='manager-link'>Написать менеджеру</a>

                                    {/* <div className='book-calendar'>
                                <p>{DICTIONARY[lang].bookLabel}:</p>
                                <div className="field-wrapper">
                                    <input type="text" id="name" placeholder='Выбрать дату' value={inputValue} className="text-field" readOnly={true} onFocus={() => setOpen(true)} />
                                </div>
                            </div> */}
                                </div>
                            </div>
                        </div>

                        {/* <button onClick={onSendData}>btn</button> */}
                    </div>

                    <AnimatedBottomButton
                        visible={!isPayment}
                        text="Купить тур"
                        onClick={() => setPaymentPage(true)}
                    />

                    {/* <BottomDrawer isOpen={open} onClose={() => setOpen(false)}>
                        <div className='not-partner'>
                            <DayPicker
                                locale={ru}
                                mode="single"
                                selected={selected}
                                onSelect={handleSelect}
                                disabled={disabledDates}
                            />

                            <div className="field-wrapper">
                                <label htmlFor="amount" className="field-label">Количество людей</label>

                                <input type="number" id="amount" pattern="[0-9]*" inputMode="numeric" className="text-field" value={amount} onChange={(e) => setAmount(e.target.value)} />
                            </div>

                            <div className={clsx('field-wrapper hide-name-field', { 'show-name-field': selected })}>
                                <label htmlFor="name" className="field-label">Введите ваше имя</label>

                                <input type="text" id="name" className="text-field" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className={clsx('field-wrapper phone-field', { 'show-number': selected })}>
                                <label htmlFor="phone" className="field-label">Оставьте номер для покупки</label>

                                <input
                                    type="tel"
                                    pattern="[0-9]*"
                                    noValidate id="phone"
                                    className="text-field"
                                    placeholder="0555 555 555"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    maxLength={10} />
                            </div>
                        </div>
                    </BottomDrawer> */}

                    {/* <div className="footer">
                <p>Хотите такой же календарь для бронирования? 👇</p>
                <a href="https://booklink.pro/" target="_blank">
                    <img src={logo} alt="logotype" />
                </a>
            </div> */}
                </div>
            )}
        </div>
    )
}

export default SingleAdvertisement;