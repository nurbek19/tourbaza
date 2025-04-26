import { useCallback, useEffect, useMemo, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { useSearchParams } from 'react-router-dom';

import '../App.css';


export const DICTIONARY = {
  'ru': {
    city: 'Город',
    address: 'Адрес',
    phone: 'Номер телефона',
    roomCount: 'Количество комнат / мест',
    price: 'Цена',
    day: 'Будни',
    night: 'Ночь',
    hour: 'Час',
    day_night: 'Сутки',
    day_off: 'Выходные',
    shortRoomCount: 'Кол-во комнат / мест',
    back: 'Назад',
    find: 'Найти',
    rentType: 'Тип аренды',
    free: 'Свободно',
    busy: 'Занято',
    showNumber: 'Показать номер',
    numberCopied: 'Номер телефона скопировано',
    notFound: 'Нету подходящих квартир с текущими параметрами. Попробуйте другие параметры.',
    name: 'Название (для отелей)',
    nameLabel: 'Название',
    book: 'Запросить бронь',
    recentDays: 'Ближайшие свободные даты',
    bookLabel: 'Выберите даты для бронирования',
    bookPhone: 'Оставьте номер для брони',
    notBookLabel: 'Выберите недоступные дни'
  },
  'kg': {
    city: 'Шаар',
    address: 'Дарек',
    phone: 'Телефон номер',
    roomCount: 'Комната саны / орун',
    price: 'Баа',
    day: 'Күндүз',
    night: 'Түн',
    hour: 'Саат',
    day_night: 'Күн',
    day_off: 'Иш эмес күндөр',
    shortRoomCount: 'Комната саны / орун',
    back: 'Артка кайтуу',
    find: 'Издөө',
    rentType: 'Ижара түрү',
    free: 'Бош',
    busy: 'Бош эмес',
    showNumber: 'Номер көрсөтүү',
    numberCopied: 'Телефон номер көчүрүлдү',
    notFound: 'Учурдагы тандоолор менен ылайыктуу батирлер жок. Башка тандоолорду колдонуп көрүңүз.',
    name: 'Аты-жөнү (мейманкана үчүн)',
    nameLabel: 'Аты-жөнү',
    book: 'Брондоо',
    recentDays: 'Жакынкы бош күндөр',
    bookLabel: 'Брондоо үчүн даталарды тандаңыз',
    bookPhone: 'брондоо үчүн номериңизди калтырыңыз',
    notBookLabel: 'Бош эмес күндөрдү белгилеңиз'
  }
}


export const CITIES = ['Бишкек', 'Нарын', 'Каракол', 'Ош', 'Чолпон - Ата', 'Иссык - Куль'];
export const HOUSE_TYPES = ['А - фрейм', 'Глемпинг', 'Коттедж', 'Барнхаус', 'Гостевой дом', 'Юрта'];
export const TOURS_DURATION = ['1 день', '2 дня', '3 дня', '4 дня'];
export const TOURS_TYPE = ['Пеший', 'Конный', 'Авто'];
export const TOURS_DIFFICULTY = ['Легкий', 'Средний', 'Сложный'];

function CreateAdvertisement() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [count, setCount] = useState('');
  const [tourDuration, setTourDuration] = useState(TOURS_DURATION[0]);
  const [tourType, setTourType] = useState(TOURS_TYPE[0]);
  const [tourDifficulty, setTourDifficulty] = useState(TOURS_DIFFICULTY[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const [searchParams] = useSearchParams();
  const [lang, setLang] = useState('ru');

  const onSendData = useCallback(() => {
    const payload = {
      name,
      price: parseInt(price),
      count: parseInt(count),
      tourDuration,
      tourType,
      tourDifficulty,
      description,
      location
    };

    console.log(payload);

    WebApp.sendData(JSON.stringify(payload));
  }, [name, price, count, tourDuration, tourType, tourDifficulty, description, location]);

  useEffect(() => {
    WebApp.expand();
  }, []);

  useEffect(() => {
    const language = searchParams.get('lang');

    if (language) {
      setLang(language);
    }

  }, []);

  const isFormValid = useMemo(() => {
    const valid = name && price && count && tourDuration && tourType && tourDifficulty && description && location;

    return valid;

  }, [name, price, count, tourDuration, tourType, tourDifficulty, description, location]);

  useEffect(() => {
      WebApp.onEvent('mainButtonClicked', onSendData);
    

    return () => {
      WebApp.offEvent('mainButtonClicked', onSendData);
    };
  }, [name, price, count, tourDuration, tourType, tourDifficulty, description, location]);

  useEffect(() => {
    WebApp.MainButton.text = 'Создать тур';

    if (isFormValid) {
      WebApp.MainButton.show();
    } else {
      WebApp.MainButton.hide();
    }


    return () => {
      WebApp.MainButton.hide();
    };

  }, [isFormValid])

  return (
    <div className='container-padding'>
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

        <select name="tour-difficultye" id="tour-difficulty" value={tourDifficulty} onChange={(e) => setTourDifficulty(e.target.value)} className="select-field">
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

      <button onClick={onSendData}>btn</button>
    </div>
  )
}

export default CreateAdvertisement;
