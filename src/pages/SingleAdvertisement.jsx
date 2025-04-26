import { useMemo, useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { DayPicker } from "react-day-picker";
import { format, isAfter, sub } from "date-fns";
import "react-day-picker/style.css";
import { ru } from "react-day-picker/locale";
import { useSearchParams } from 'react-router-dom';
import ImageSlider from "../components/ImageSlider";
import '../App.css';

import { DICTIONARY } from './CreateAdvertisement';
import clsx from 'clsx';
import logo from '../images/booklink.png';

import { BottomDrawer } from './BottomDrawer';
import { ExpandableText } from './ExpandableText';

const SingleAdvertisement = ({ item, lang, onBackHandler, hideButton }) => {
    const [selected, setSelected] = useState();
    const [name, setName] = useState('');
    const [houses, setHouses] = useState([]);
    const [phone, setPhone] = useState('');
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(1);

    const onSendData = () => {
        const books = houses.reduce((acc, value) => {
            acc[value] = [format(selected, 'MM/dd/yyyy')];

            return acc;
        }, {});

        console.log({
            tour_id: item._id,
            books,
            comment: `${name} ${phone}`,
            people_amount: amount,
        });

        WebApp.sendData(JSON.stringify({
            tour_id: item._id,
            books,
            comment: `${name} ${phone}`,
            people_amount: parseInt(amount),
        }));
    }

    useEffect(() => {
        // if (item.count === 1) {
        setHouses([1]);
        // }
    }, [])

    useEffect(() => {
        WebApp.onEvent('mainButtonClicked', onSendData);

        return () => {
            WebApp.offEvent('mainButtonClicked', onSendData);
        };
    }, [phone, selected, name, amount]);

    const isValid = useMemo(() => {
        return phone.length && selected && name && amount;
    }, [selected, phone, name, amount]);

    useEffect(() => {
        WebApp.MainButton.text = DICTIONARY[lang].book;

        if (isValid) {
            WebApp.MainButton.show();

        } else {
            WebApp.MainButton.hide();
        }

        return () => {
            WebApp.MainButton.hide();
        };
    }, [isValid]);

    const handleSelect = (newSelected) => {
        setSelected(newSelected);
        setOpen(false);
    };

    const inputValue = useMemo(() => {
        if (selected) {
            return format(selected, 'dd/MM/yyyy');
        }

        if (item.available_dates?.length) {
            return format(new Date(item.available_dates[0]), 'dd/MM/yyyy')
        }

        return '';

    }, [item.available_dates, selected]);


    return (
        <div className='search-container'>
            <div className="back-button" onClick={onBackHandler}>« {DICTIONARY[lang].back}</div>
            <div className={clsx('single-result-card', { 'card-padding': selected })}>
                <div className="">
                    <div className="single-card">
                        {item.photo_ids && (
                            <ImageSlider imageIds={item.photo_ids} />
                        )}
                        <div className="card-detail single-card-detail">
                            <p className="bold-title">
                                {item.name}
                            </p>

                            <div className='book-calendar'>
                                <p>{DICTIONARY[lang].bookLabel}:</p>
                                <div className="field-wrapper">
                                    <input type="text" id="name" placeholder='Выбрать дату' value={inputValue} className="text-field" readOnly={true} onFocus={() => setOpen(true)} />
                                </div>
                            </div>

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

                            <div className='tour-details'>
                                <p>Детали тура:</p>
                                <div className='tour-detail'>
                                    <span>Длительность</span>
                                    <span className="dots"></span>
                                    <p>{item.duration_in_days}</p>
                                </div>

                                <div className='tour-detail'>
                                    <span>Тип</span>
                                    <span className="dots"></span>
                                    <p>{item.tour_type}</p>
                                </div>

                                <div className='tour-detail'>
                                    <span>Уровень сложности</span>
                                    <span className="dots"></span>
                                    <p>{item.difficulty}</p>
                                </div>

                                <div className='tour-detail'>
                                    <span>Стоимость за человека</span>
                                    <span className="dots"></span>
                                    <p>{item.price} сом</p>
                                </div>
                            </div>

                            {item.description && (
                                <div className='advertisement-description'><span>Описание:</span> <br />
                                    <ExpandableText>
                                        {item.description}
                                    </ExpandableText>
                                </div>
                            )}

                            <p className='advertisement-description'><span>Место сбора:</span> <br />
                                {item.location}
                            </p>
                        </div>
                    </div>
                </div>

                <button onClick={onSendData}>btn</button>
            </div>


            <BottomDrawer isOpen={open} onClose={() => setOpen(false)}>
                <div className='not-partner'>
                    <DayPicker
                        locale={ru}
                        mode="single"
                        selected={selected}
                        onSelect={handleSelect}
                        disabled={[
                            { before: new Date() },
                            // ...bookedDays.filter((el) => (isAfter(el, sub(new Date(), { days: 1 }))))
                        ]}
                    // modifiers={{
                    //     booked: bookedDays.filter((el) => (isAfter(el, sub(new Date(), { days: 1 }))))
                    // }}
                    // modifiersClassNames={{
                    //     booked: "my-booked-class"
                    // }}
                    />
                </div>
            </BottomDrawer>

            <div className="footer">
                <p>Хотите такой же календарь для бронирования? 👇</p>
                <a href="https://booklink.pro/" target="_blank">
                    <img src={logo} alt="logotype" />
                </a>
            </div>
        </div>
    )
}

export default SingleAdvertisement;