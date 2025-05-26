import { useState, useEffect, useMemo } from "react";
import WebApp from '@twa-dev/sdk';
import { DayPicker } from "react-day-picker";
import { format, compareAsc, addDays, isBefore, startOfDay, isAfter, isSameDay } from "date-fns";
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

import { api } from '../api';

import "react-day-picker/style.css";
import { ru } from "react-day-picker/locale";

import { BottomDrawer } from './BottomDrawer';
import { DICTIONARY } from './CreateAdvertisement';

function getMissingDates(sortedDates) {
    const missingDates = [];

    for (let i = 0; i < sortedDates.length - 1; i++) {
        let current = addDays(sortedDates[i], 1);

        while (isBefore(current, sortedDates[i + 1])) {
            missingDates.push(current);
            current = addDays(current, 1);
        }
    }

    return missingDates;
}

const TourPayment = ({ item, onBackHandler, lang }) => {
    const [selected, setSelected] = useState();
    const [open, setOpen] = useState(false);

    const [houses, setHouses] = useState([]);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState(1);

    const [searchParams] = useSearchParams();

    // const [value, setValue] = useState(1);

    const increment = () => {
        const newValue = Math.min(amount + 1, 68);
        setAmount(newValue);
        //   onChange?.(newValue);
    };

    const decrement = () => {
        const newValue = Math.max(amount - 1, 1);
        setAmount(newValue);
        //   onChange?.(newValue);
    };



    const onSendData = () => {
        const books = houses.reduce((acc, value) => {
            acc[value] = [format(selected, 'MM/dd/yyyy')];

            return acc;
        }, {});

        console.log({
            tour_id: item._id,
            books,
            comment: `${name} ${phone}`,
            people_count: amount,
        });

        console.log(JSON.stringify({
            tour_id: item._id,
            books,
            comment: `${name} ${phone}`,
            people_count: amount,
        }));


        const price = item.price * parseInt(amount);
        const requester_id = searchParams.get('requester_id');
        WebApp.MainButton.showProgress();
        api.post('/payment', {
            tour_id: item._id,
            books,
            comment: `${name} ${phone}`,
            people_count: parseInt(amount),
            price,
            requester_id: parseInt(requester_id)
        }).then((res) => {
            if (res.data) {
                WebApp.MainButton.hide();
                // window.location.href = res.data.url;
                WebApp.openLink(res.data.url);
                WebApp.close();
            }
        }).catch((err) => {
            console.log(err);
            WebApp.MainButton.hideProgress();
            WebApp.MainButton.text = 'Произашла какая то ошибка';
        })

        // WebApp.sendData(JSON.stringify({
        //     tour_id: item._id,
        //     books,
        //     comment: `${name} ${phone}`,
        //     people_amount: parseInt(amount),
        // }));
    }

    useEffect(() => {
        setHouses([1]);
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
        WebApp.MainButton.text = 'Оплатить';

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


    const disabledDates = useMemo(() => {
        const availableDates = item.available_dates ?? [];

        if (!availableDates.length) {
            return true;
        }

        const now = new Date();
        const today = startOfDay(new Date());

        const tomorrow = startOfDay(addDays(now, 1));
        const sixPM = new Date(today);
        sixPM.setHours(18, 0, 0, 0);

        const excludeTomorrow = now > sixPM;

        const futureDates = availableDates.filter(date => {
            if (isSameDay(date, today)) return false;

            if (excludeTomorrow && isSameDay(date, tomorrow)) return false; //в будущем добавить проверку существует ли дата на завтра


            return isAfter(date, today);
        });

        if (!futureDates.length) {
            return true;
        }


        if (futureDates.length === 1) {
            return {
                before: new Date(futureDates[0]),
                after: new Date(futureDates[0]),
            }
        }

        const sortedDates = futureDates.map(date => new Date(date)).sort(compareAsc);
        const missingDates = getMissingDates(sortedDates);
        console.log(sortedDates, 'Nurbek', futureDates, missingDates);

        if (!missingDates.length) {
            return {
                before: sortedDates[0],
                after: sortedDates[sortedDates.length - 1]
            }
        }

        return [...missingDates, {
            before: sortedDates[0],
            after: sortedDates[sortedDates.length - 1]
        }];

    }, [item.available_dates]);


    const inputValue = useMemo(() => {
        if (selected) {
            return format(selected, 'dd/MM/yyyy');
        }

        if (item.available_dates?.length) {
            const sortedDates = item.available_dates.map((d) => (new Date(d))).sort(compareAsc);

            const now = new Date();
            const today = startOfDay(new Date());

            const tomorrow = startOfDay(addDays(now, 1));
            const sixPM = new Date(today);
            sixPM.setHours(18, 0, 0, 0);

            const excludeTomorrow = now > sixPM;

            const futureDates = sortedDates.filter(date => {
                if (isSameDay(date, today)) return false;

                if (excludeTomorrow && isSameDay(date, tomorrow)) return false; //в будущем добавить проверку существует ли дата на завтра

                return isAfter(date, today);
            });

            if (futureDates?.length) {
                handleSelect(futureDates[0]);
                return format(futureDates[0], 'dd/MM/yyyy');
            }
        }

        return '';

    }, [item.available_dates, selected]);

    return (
        <div>
            <div className="back-button back-button-padding" onClick={onBackHandler}>« {DICTIONARY[lang].back}</div>
            <div className="tour-payment">
                {/* <div className='book-calendar'>
                    <p>{DICTIONARY[lang].bookLabel}:</p> */}
                <div className="field-wrapper">
                    <label htmlFor="date" className="field-label">Выберите дату для покупки</label>
                    <input type="text" id="date" placeholder='Выбрать дату' value={inputValue} className="text-field" readOnly={true} onFocus={() => setOpen(true)} />
                </div>
                {/* </div> */}



                <div className="field-wrapper">
                    <label htmlFor="amount" className="field-label">Количество людей</label>

                    <div className="counter-buttons">
                        <button onClick={decrement} className="decrement">−</button>
                        <div className="counter-value">{amount}</div>
                        <button onClick={increment} className="increment">+</button>
                    </div>

                    {/* <input type="number" id="amount" pattern="[0-9]*" inputMode="numeric" className="text-field" value={amount} onChange={(e) => setAmount(e.target.value)} /> */}
                </div>

                <div className={clsx('field-wrapper')}>
                    {/* { 'show-name-field': selected } */}
                    <label htmlFor="name" className="field-label">Введите ваше имя</label>

                    <input type="text" id="name" className="text-field" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className={clsx('field-wrapper')}>
                    {/* , { 'show-number': selected } */}
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


                <div className="total-sum">
                    <p>Сумма к оплате</p>
                    <span>{item.price * parseInt(amount)} сом</span>
                </div>
                <div className="one-person-sum">
                    <p>За одного участника</p>
                    <span>{item.price} сом</span>
                </div>



                <BottomDrawer isOpen={open} onClose={() => setOpen(false)}>
                    <div className='not-partner'>
                        <DayPicker
                            locale={ru}
                            mode="single"
                            selected={selected}
                            onSelect={handleSelect}
                            disabled={disabledDates}
                        />
                    </div>
                </BottomDrawer>
            </div>
        </div>
    )
}

export default TourPayment;