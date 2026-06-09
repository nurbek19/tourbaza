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

    // Only the tours whose toggle differs from what the backend returned.
    const changedStatuses = useMemo(
        () => data
            .filter((item) => item.active !== docStatuses[item._id])
            .map((item) => ({ _id: item._id, active: docStatuses[item._id] })),
        [data, docStatuses]
    );

    const onSendData = useCallback(() => {
        WebApp.sendData(JSON.stringify(changedStatuses));
    }, [changedStatuses]);

    // Show "Обновить статусы" only when something changed; send the diff on tap.
    useEffect(() => {
        WebApp.MainButton.text = 'Обновить статусы';

        if (changedStatuses.length > 0) {
            WebApp.MainButton.show();
            WebApp.onEvent('mainButtonClicked', onSendData);
        } else {
            WebApp.MainButton.hide();
        }

        return () => {
            WebApp.MainButton.hide();
            WebApp.offEvent('mainButtonClicked', onSendData);
        };
    }, [changedStatuses, onSendData]);

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
                                            checked={docStatuses[item._id] ?? true}
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