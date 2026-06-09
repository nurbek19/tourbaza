import { useEffect, useState, useCallback, useMemo } from "react";
import WebApp from '@twa-dev/sdk';
import { useSearchParams } from "react-router-dom";

import { api } from "../api";

import '../App.css';
import EditAdvertisement from "./EditAdvertisement";

function OwnerAdvertisementsList() {
    const [data, setData] = useState([]);
    const [docStatuses, setDocStatus] = useState({});
    const [editDoc, setEditDoc] = useState(null);
    const [lang, setLang] = useState('ru');

    const [searchParams] = useSearchParams();

    const fetchData = () => {
        const id = searchParams.get('owner_id');

        api.get(`/tours?owner_id=${id}`).then((res) => {
            if (res.data) {
                setData(res.data);

                const statuses = res.data.reduce((acc, item) => {
                    acc[item._id] = item.active;
                    return acc;
                }, {});

                setDocStatus(statuses);
            }
        });
    };

    useEffect(() => {
        WebApp.expand();
    }, []);

    useEffect(() => {
        const language = searchParams.get('lang');
        if (language) {
            setLang(language);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const statusChangeHandler = (e, docId) => {
        const checked = e.target.checked;
        setDocStatus((prev) => ({ ...prev, [docId]: checked }));
    };

    // Tours whose toggle differs from the backend value. A missing local status
    // (before the toggle is touched) is treated as unchanged, and `active` is
    // always a real boolean — never undefined in the payload.
    const changedStatuses = useMemo(
        () => data
            .filter((item) => (docStatuses[item._id] ?? item.active) !== item.active)
            .map((item) => ({ _id: item._id, active: docStatuses[item._id] ?? item.active })),
        [data, docStatuses]
    );

    const onSendData = useCallback(() => {
        WebApp.sendData(JSON.stringify(changedStatuses));
    }, [changedStatuses]);

    // Show "Обновить статусы" only when something changed; send the diff on tap.
    // While the edit form is open, EditAdvertisement owns the MainButton, so we
    // stand down (and drop our click handler so it can't also fire). hide() is
    // intentionally NOT in this cleanup — that would flicker the button on every
    // toggle; it's handled by the unmount-only effect below.
    useEffect(() => {
        if (!editDoc) {
            WebApp.MainButton.text = 'Обновить статусы';
            if (changedStatuses.length > 0) {
                WebApp.MainButton.show();
                WebApp.onEvent('mainButtonClicked', onSendData);
            } else {
                WebApp.MainButton.hide();
            }
        }
        return () => WebApp.offEvent('mainButtonClicked', onSendData);
    }, [changedStatuses, onSendData, editDoc]);

    // Hide the button only when leaving the screen (not on each toggle).
    useEffect(() => () => WebApp.MainButton.hide(), []);

    return (
        <div>
            {editDoc ? (
                <EditAdvertisement doc={editDoc} lang={lang} onBackHandler={() => setEditDoc(null)} />
            ) : (
                <div>
                    {data.map((item) => (
                        <div key={item._id} className="card-container" onClick={() => setEditDoc(item)}>
                            <div className="card">
                                {item.photo_ids && (
                                    <div className='card-single-image-container'>
                                        <img key={item.photo_ids[0]} src={`https://booklink.pro/tb/tours/photo?id=${item.photo_ids[0]}`} alt="tour image" />
                                    </div>
                                )}
                                <div className="card-detail">
                                    {item.name && (<p><span>{item.name}</span></p>)}
                                    <p>{item?.price} сом{item?.price_weekend > 0 ? ` / вых. ${item.price_weekend} сом` : ''}</p>

                                    {/* enable/disable the tour (seasonal on/off); stopPropagation so the
                                        toggle doesn't open the edit form */}
                                    <label className="switch" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={docStatuses[item._id] ?? item.active}
                                            onChange={(e) => statusChangeHandler(e, item._id)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OwnerAdvertisementsList;