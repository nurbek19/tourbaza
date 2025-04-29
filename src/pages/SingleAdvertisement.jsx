import { useMemo, useState, useEffect } from 'react';

// import { useSearchParams } from 'react-router-dom';
// import "react-day-picker/style.css";
import ImageSlider from "../components/ImageSlider";
import AnimatedBottomButton from './AnimatedBottomButton';
import '../App.css';

import { DICTIONARY } from './CreateAdvertisement';
import clsx from 'clsx';
// import logo from '../images/booklink.png';


import { ExpandableText } from './ExpandableText';

// import { api } from '../api';

import { TOURS_DURATON_LABELS } from './CreateAdvertisement';
import TourPayment from './TourPayment';

const SingleAdvertisement = ({ item, lang, onBackHandler, hideButton }) => {
    // const [selected, setSelected] = useState();
    // const [name, setName] = useState('');
    // const [houses, setHouses] = useState([]);
    // const [phone, setPhone] = useState('');
    // const [open, setOpen] = useState(false);
    // const [amount, setAmount] = useState(1);
    const [isPayment, setPaymentPage] = useState(false);

    // const [searchParams] = useSearchParams();

    // const fetchData = () => {
    //     const books = houses.reduce((acc, value) => {
    //         acc[value] = [format(selected, 'MM/dd/yyyy')];

    //         return acc;
    //     }, {});

    //     const price = item.price * parseInt(amount);

    //     api.post('/payment', { 
    //         tour_id: item._id,
    //         books,
    //         comment: `${name} ${phone}`,
    //         people_count: parseInt(amount),
    //         price
    //      }).then((res) => {
    //         if (res.data) {
    //             window.location.href = res.data.url;
    //         }
    //     })
    // }

    // const onSendData = () => {
    //     const books = houses.reduce((acc, value) => {
    //         acc[value] = [format(selected, 'MM/dd/yyyy')];

    //         return acc;
    //     }, {});

    //     console.log({
    //         tour_id: item._id,
    //         books,
    //         comment: `${name} ${phone}`,
    //         people_amount: amount,
    //     });


    //     const price = item.price * parseInt(amount);
    //     const requester_id = searchParams.get('requester_id');
    //     WebApp.MainButton.showProgress();
    //     api.post('/payment', {
    //         tour_id: item._id,
    //         books,
    //         comment: `${name} ${phone}`,
    //         people_count: parseInt(amount),
    //         price,
    //         requester_id: parseInt(requester_id)
    //     }).then((res) => {
    //         if (res.data) {
    //             WebApp.MainButton.hide();
    //             window.location.href = res.data.url;
    //         }
    //     }).catch((err) => {
    //         console.log(err);
    //         WebApp.MainButton.hideProgress();
    //         WebApp.MainButton.text = 'Произашла какая то ошибка';
    //     })

    //     // WebApp.sendData(JSON.stringify({
    //     //     tour_id: item._id,
    //     //     books,
    //     //     comment: `${name} ${phone}`,
    //     //     people_amount: parseInt(amount),
    //     // }));
    // }

    // useEffect(() => {
    //     setHouses([1]);
    // }, [])

    // useEffect(() => {
    //     WebApp.onEvent('mainButtonClicked', onSendData);

    //     return () => {
    //         WebApp.offEvent('mainButtonClicked', onSendData);
    //     };
    // }, [phone, selected, name, amount]);

    // const isValid = useMemo(() => {
    //     return phone.length && selected && name && amount;
    // }, [selected, phone, name, amount]);

    // useEffect(() => {
    //     WebApp.MainButton.text = 'Купить тур';

    //     if (isValid) {
    //         WebApp.MainButton.show();

    //     } else {
    //         WebApp.MainButton.hide();
    //     }

    //     return () => {
    //         WebApp.MainButton.hide();
    //     };
    // }, [isValid]);

    // const handleSelect = (newSelected) => {
    //     setSelected(newSelected);
    //     // setOpen(false);
    // };

    // const inputValue = useMemo(() => {
    //     if (selected) {
    //         return format(selected, 'dd/MM/yyyy');
    //     }

    //     if (item.available_dates?.length) {
    //         const sortedDates = item.available_dates.map((d) => (new Date(d))).sort(compareAsc);

    //         handleSelect(sortedDates[0]);
    //         return format(sortedDates[0], 'dd/MM/yyyy')
    //     }

    //     return '';

    // }, [item.available_dates, selected]);

    // const disabledDates = useMemo(() => {
    //     const availableDates = item.available_dates ?? [];

    //     if (!availableDates.length) {
    //         return true;
    //     }

    //     if (availableDates.length === 1) {
    //         return {
    //             before: new Date(availableDates[0]),
    //             after: new Date(availableDates[0]),
    //         }
    //     }

    //     const sortedDates = availableDates.map(date => new Date(date)).sort(compareAsc);
    //     const missingDates = getMissingDates(sortedDates);

    //     if (!missingDates.length) {
    //         return {
    //             before: sortedDates[0],
    //             after: sortedDates[1]
    //         }
    //     }

    //     return [...missingDates, {
    //         before: sortedDates[0],
    //         after: sortedDates[sortedDates.length - 1]
    //     }];

    // }, [item.available_dates]);


    return (
        <div>
            {isPayment ? (
                <TourPayment item={item} onBackHandler={() => setPaymentPage(false)} lang={lang} />
            ) : (
                <div className='search-container'>
                    <div className="back-button back-button-padding" onClick={onBackHandler}>« {DICTIONARY[lang].back}</div>
                    <div className={clsx('single-result-card')}>
                        {/* { 'card-padding': selected } */}
                        <div className="">
                            <div className="single-card">
                                {item.photo_ids && (
                                    <ImageSlider imageIds={item.photo_ids} />
                                )}
                                <div className="card-detail single-card-detail">
                                    <p className="bold-title">
                                        {item.name}

                                        <span className='price-label'>{item.price} сом</span>
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
                                            <span>Стоимость за человека</span>
                                            {/* <span className="dots"></span> */}
                                            <p>{item.price} сом</p>
                                        </div>
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