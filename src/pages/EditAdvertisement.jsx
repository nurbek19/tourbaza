import { useCallback, useEffect, useMemo, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { DayPicker } from "react-day-picker";
import { format, isAfter, sub } from "date-fns";
import "react-day-picker/style.css";
import { ru } from "react-day-picker/locale";
import deepEqual from 'deep-equal';

import '../App.css';

import { DICTIONARY } from './CreateAdvertisement';
import clsx from 'clsx';


import { TOURS_DURATION, TOURS_TYPE, TOURS_DIFFICULTY } from './CreateAdvertisement';

function EditAdvertisement({ doc, lang, onBackHandler }) {
  const [name, setName] = useState(doc.name);
    const [price, setPrice] = useState(doc.price);
    const [count, setCount] = useState(doc.people_limit);
    const [tourDuration, setTourDuration] = useState(doc.duration_in_days);
    const [tourType, setTourType] = useState(doc.tour_type);
    const [difficulty, setTourDifficulty] = useState(doc.difficulty);
    const [description, setDescription] = useState(doc.description);
    const [location, setLocation] = useState(doc.location);

  // const [city, setCity] = useState(doc.city);
  // const [address, setAddress] = useState(doc.address);
  // const [price, setPrice] = useState({ ...doc.price });
  // const [name, setName] = useState(doc.name ? doc.name : '');
  const [selected, setSelected] = useState([]);
  const [houses, setHouses] = useState([1]);
  const [calendarType, setCalendarType] = useState('book');
  // const [count, setCount] = useState('');
  // const [prepayment, setPrepayment] = useState(doc.prepayment_sum);
  // const [paymentLink, setPaymentLink] = useState(doc.mbank_link);
  // const [note, setNote] = useState('');
  const [noteDate, setNoteDate] = useState('');
  const [editData, setEditData] = useState(false);
  // const [paymentId, setPaymentId] = useState(doc.finik_account_id);
  // const [houseType, setHouseType] = useState(doc.house_type);
  // const [description, setDescription] = useState(doc.description);

  // const {
  //   ref,
  //   value: phone,
  //   setValue,
  // } = useIMask({ mask: '+{996}(000)000-000' });


  // const priceChangeHandler = (name, value) => {
  //   const copyObj = { ...price };

  //   copyObj[name] = value;

  //   setPrice(copyObj);
  // }

  const onSendData = () => {
    const payload = {
      _id: doc._id,

      name,
      price: parseInt(price),
      people_limit: parseInt(count),
      duration_in_days: tourDuration,
      tour_type: tourType,
      difficulty,
      description,
      location
    };

    if (calendarType === 'book') {
      // const booksCopy = {};

      const selectedDates = selected.map((date) => (format(date, 'MM/dd/yyyy')));

      // houses.forEach((value) => {
      //   booksCopy[value] = [...selectedDates];
      // });


      payload.availableDates = selectedDates;
    }
    // else if (calendarType === 'delete') {
    //   const booksCopy = {};

    //   const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

    //   houses.forEach((value) => {
    //     // booksCopy[value] = [...selectedDates];

    //     booksCopy[value] = [...doc.books[value]].reduce((acc, obj) => {
    //       if (!selectedDates.includes(obj.book_date)) {
    //         acc.push(obj);
    //       }

    //       return acc;
    //     }, []);
    //   });


    //   payload.books = booksCopy;
    //   payload.delete_books = true;
    // }

    console.log(JSON.stringify(payload));
    console.log(payload);

    WebApp.sendData(JSON.stringify(payload));
  };

  const replaceImagesHandler = () => {
    WebApp.sendData(JSON.stringify({
      house_id: doc._id,
      action: 'REPLACE_IMAGES',
    }));
  }



  const isFormValid = useMemo(() => {
    // const isSomeprice = Object.values(price).some((value) => value);

    // let pricesObj = {
    //   day: 0,
    //   day_off: 0,
    // };

    // for (let key in price) {
    //   if (price[key] || price[key] === 0) {
    //     pricesObj[key] = parseInt(price[key]);
    //   }
    // }

    let selectedDays = doc.books;

    if (selected.length) {
      const booksCopy = { ...doc.books };

      const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

      houses.forEach((value) => {
        booksCopy[value] = [...booksCopy[value], ...selectedDates];
      });


      selectedDays = booksCopy;
    }

    const payload = {
      // city,
      // address,
      // phone,
      // count: parseInt(count),
      // prepayment_sum: prepayment,
      // mbank_link: paymentLink,
      // price: pricesObj,
      // name,
      // house_type: houseType,
      // finik_account_id: paymentId,
      // description,
      // books: selectedDays
    };

    const docObj = {
      // city: doc.city,
      // address: doc.address,
      // phone: doc.phone,
      // prepayment_sum: doc.prepayment_sum,
      // mbank_link: doc.mbank_link,
      // // count: parseInt(doc.count),
      // price: doc.price,
      // name: doc.name ? doc.name : '',
      // house_type: doc.house_type,
      // finik_account_id: doc.finik_account_id,
      // description: doc.description,
      // books: doc.books ? doc.books : {}
    }

    const isObjectChanged = deepEqual(payload, docObj);

    if (calendarType === 'delete') {
      return (name && !isObjectChanged) || houses.length; // кейс когда одна бронь и пытаются удалить бронь
    }

    return (name && !isObjectChanged) || (houses.length && selected.length);
  }, [price, name, selected, doc, houses, calendarType, description]);

  useEffect(() => {
    WebApp.onEvent('mainButtonClicked', onSendData);

    return () => {
      WebApp.offEvent('mainButtonClicked', onSendData);
    };
  }, [count, price, selected, houses, name, description, doc]);

  useEffect(() => {
    WebApp.MainButton.text = 'Применить изменения';
    // WebApp.onEvent('mainButtonClicked', onSendData);

    if (isFormValid) {
      WebApp.MainButton.show();
    } else {
      WebApp.MainButton.hide();
    }


    return () => {
      WebApp.MainButton.hide();
      // WebApp.offEvent('mainButtonClicked', onSendData);
    };

  }, [isFormValid]);

  useEffect(() => {
    WebApp.expand();
    // setValue(doc.phone);
  }, []);

  const handleSelect = (days) => {

    setSelected(days);
  };

  useEffect(() => {
    if (doc?.availableDates?.length) {
      const availableDatesFormatted = doc.availableDates.map((d) => new Date(d));

      setSelected(availableDatesFormatted);
    }
  }, [doc.availableDates]);

  const selectNote = (days, triggerDate, modifiers) => {
    if (modifiers?.booked && triggerDate) {
      const formattedDate = format(triggerDate, 'MM/dd/yyyy');
      setNoteDate(formattedDate);

      return;
    }
  };

  const notesDates = useMemo(() => {
    const housesBookedDays = Object.entries(doc.books).map(([key, values]) => {
      return values.map((v) => v.book_date);
    }).flat();

    const setFromArr = new Set(housesBookedDays);

    return Array.from(setFromArr).map((d) => new Date(d));
  }, [doc.books, calendarType]);

  // const bookedDays = useMemo(() => {
  //   if (!doc.books) {
  //     return [];
  //   }

  //   // if (calendarType === 'delete') {
  //   //   return [];
  //   // }

  //   if (houses.length) {
  //     const housesBookedDays = houses.reduce((acc, value) => {
  //       const booksByHouseNumber = doc.books[value].map((entity) => entity.book_date);
  //       acc.push(...booksByHouseNumber);

  //       return acc;
  //     }, []);

  //     const setFromArr = new Set(housesBookedDays);

  //     return Array.from(setFromArr).map((d) => new Date(d));
  //   }

  //   return [];

    // const commonDates = Object.values(doc.books).map((arr) => (arr.map((el) => el.book_date)));;

    // if (commonDates.length === 0) {
    //   return [];
    // }

    // return commonDates.reduce((acc, arr) => acc.filter(el => arr.includes(el))).map(date => new Date(date));

  // }, [doc.books, houses]);


  // const housesList = useMemo(() => {
  //   if (!doc.books) {
  //     return [];
  //   }

  //   if (calendarType === 'delete') {
  //     return Object.keys(doc.books).map((v) => ({ number: v, disabled: false }));
  //   }

  //   if (selected.length) {
  //     const arr = [];
  //     const selectedDates = selected.map((date) => format(date, 'MM/dd/yyyy'));

  //     Object.keys(doc.books).forEach((key) => {
  //       const disabled = selectedDates.some((d) => doc.books[key].map((obj) => (obj.book_date)).includes(d));

  //       arr.push({ number: key, disabled });
  //     });

  //     return arr;
  //   }

  //   return Object.keys(doc.books).map((v) => ({ number: v, disabled: false }));
  // }, [doc.books, selected]);


  // useEffect(() => {
  //   if (calendarType === 'delete' && houses.length) {
  //     const housesBookedDays = houses.reduce((acc, value) => {
  //       const booksByHouseNumber = doc.books[value].map((entity) => entity.book_date);
  //       acc.push(...booksByHouseNumber);

  //       return acc;
  //     }, []);

  //     const setFromArr = new Set(housesBookedDays);

  //     const arr = Array.from(setFromArr).map((d) => new Date(d));
  //     handleSelect(arr);
  //   } else if (calendarType === 'delete' && !houses.length) {
  //     handleSelect([]);
  //   }

  // }, [houses, calendarType]);

  useEffect(() => {
    // if (doc.count === 1) {
    //   setHouses([1]);
    // } else {
    //   setHouses([]);
    // }
    handleSelect([]);
  }, [calendarType]);

  useEffect(() => {
    if (noteDate) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }

  }, [noteDate])

  const notes = useMemo(() => {
    const map = {};

    Object.entries(doc.books).forEach(([key, values]) => {
      map[key] = '';

      values.forEach((v) => {
        if (v.book_date === noteDate) {
          map[key] = v.book_comment;
        }
      })
    });

    return map;

  }, [noteDate]);

  return (
    <div className="edit-container-padding">
      <div className="back-button" onClick={onBackHandler}>« {DICTIONARY[lang].back}</div>

      <div className="field-wrapper">
        <span className="field-label">Выберите календарь:</span>

        <div className="calendar-type-buttons">
          <label className="radio-input-label">
            <input type="radio" name="calendarType" value="book" className="radio-input" checked={calendarType === 'book'} onChange={(e) => setCalendarType(e.target.value)} />
            <span className="radio-input-text">даты туров</span>
          </label>
          {/* <label className="radio-input-label">
            <input type="radio" name="calendarType" value="delete" className="radio-input" checked={calendarType === 'delete'} onChange={(e) => setCalendarType(e.target.value)} />
            <span className="radio-input-text">отмены</span>
          </label> */}
          <label className="radio-input-label">
            <input type="radio" name="calendarType" value="notes" className="radio-input" checked={calendarType === 'notes'} onChange={(e) => setCalendarType(e.target.value)} />
            <span className="radio-input-text">заметок</span>
          </label>
        </div>
      </div>

      {calendarType === 'notes' ? (
        <div className='edit-calendar-container'>
          {/* <div className={clsx('book-calendar', { 'partner-calendar': calendarType === 'delete' })}> */}
          {/* <p>{DICTIONARY[lang].notBookLabel}:</p> */}
          <DayPicker
            locale={ru}
            mode="multiple"
            selected={selected}
            onSelect={selectNote}
            disabled={[{ before: new Date() }]}
            modifiers={{
              booked: notesDates.filter((el) => (isAfter(el, sub(new Date(), { days: 1 }))))
            }}
            modifiersClassNames={{
              booked: "my-booked-class"
            }}
          />
          {/* </div> */}
        </div>
      ) : (
        <div className='edit-calendar-container'>
          {/* {housesList.length !== 1 && (
            <div className='houses-container'>
              <p>Выберите номер дома для бронирования:</p>
              <div className='houses-list'>
                {housesList.map((obj) => (
                  <HouseItem key={obj.number} number={obj.number} disabled={obj.disabled} setHouses={setHouses} calendarType={calendarType} />
                ))}
              </div>
            </div>
          )} */}

          <div>
            <div className={clsx('book-calendar', { 'partner-calendar': calendarType === 'delete' })}>
              <p>{DICTIONARY[lang].notBookLabel}:</p>
              <DayPicker
                locale={ru}
                mode="multiple"
                selected={selected}
                onSelect={handleSelect}
                disabled={[
                  { before: new Date() },
                  // ...bookedDays.filter((el) => (isAfter(el, sub(new Date(), { days: 1 }))))
                ]}
                // modifiers={{
                //   booked: bookedDays.filter((el) => (isAfter(el, sub(new Date(), { days: 1 }))))
                // }}
                // modifiersClassNames={{
                //   booked: "my-booked-class"
                // }}
              />
            </div>
          </div>

          {/* <div className={clsx('field-wrapper hide-name-field note-field', { 'show-name-field': selected.length && houses.length && calendarType === 'book' })}>
            <label htmlFor="note" className="field-label">Введите заметку</label>

            <input type="text" id="note" className="text-field" value={note} onChange={(e) => setNote(e.target.value)} />
          </div> */}
        </div>
      )}


      <button className='replace-images-btn' onClick={replaceImagesHandler}>Заменить фотографии</button>
      <button className='edit-data-button' onClick={() => setEditData(!editData)}>
        {editData ? 'Скрыть данные' : 'Редактировать данные'}
      </button>

      <div className={clsx('edit-data-container', { 'show-edit-data': editData })}>
        <div className="field-wrapper">
                <label htmlFor="name" className="field-label">Название тура</label>
        
                <input type="text" id="name" className="text-field" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
        
              <div className="field-wrapper">
                <label htmlFor="price" className="field-label">Стоимость</label>
        
                <input type="number" id="price" pattern="[0-9]*" inputMode="numeric" className="text-field" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
        
              <div className="field-wrapper">
                <span className="field-label">Максимальное количество людей</span>
        
                <input type="number" id="count" className="text-field" value={count} onChange={(e) => setCount(e.target.value)} />
              </div>
        
              <div className="field-wrapper select-wrapper">
                <label htmlFor="tour-duration" className="field-label">Длительность</label>
        
                <select name="tour-duration" id="tour-duration" value={tourDuration} onChange={(e) => setTourDuration(e.target.value)} className="select-field">
                  {TOURS_DURATION.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
        
              <div className="field-wrapper select-wrapper">
                <label htmlFor="tour-type" className="field-label">Тип</label>
        
                <select name="tour-type" id="tour-type" value={tourType} onChange={(e) => setTourType(e.target.value)} className="select-field">
                  {TOURS_TYPE.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
        
              <div className="field-wrapper select-wrapper">
                <label htmlFor="tour-difficulty" className="field-label">Уровень сложности</label>
        
                <select name="tour-difficultye" id="tour-difficulty" value={difficulty} onChange={(e) => setTourDifficulty(e.target.value)} className="select-field">
                  {TOURS_DIFFICULTY.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
        
              <div className="field-wrapper">
                <label htmlFor="description" className="field-label">Описание</label>
        
                <textarea id="description" rows="6" className="text-field" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
        
              <div className="field-wrapper">
                <label htmlFor="location" className="field-label">Место сбора</label>
        
                <textarea id="location" rows="3" className="text-field" value={location} onChange={(e) => setLocation(e.target.value)}></textarea>
              </div>
      </div>

      {noteDate && (
        <div className='note-modal' onClick={() => setNoteDate('')}>
          <div className='note-modal-content' onClick={(e) => { e.stopPropagation() }}>
            <div className='close-icon' onClick={() => setNoteDate('')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </div>
            <h4>{format(new Date(noteDate), 'd MMMM', { locale: ru })}</h4>

            {Object.entries(notes).map(([key, value]) => {
              if (!value) {
                return null;
              }

              return (
                <div key={key} className='note-card'>
                  <p>
                    {/* <span>🏠 {key}</span> */}
                    {value}
                    </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <button onClick={onSendData}>btn</button>
    </div>
  )
}

export default EditAdvertisement;
