'use client';
import React, { useState } from 'react';
import { APIProvider, AdvancedMarker, InfoWindow, CollisionBehavior, Map, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';


const containerStyle = {
    width: '100%',
    height: '400px'
};

const initialCenter = {
    lat: 10.916598461452587,
    lng: -74.81070847861618
};

const MapTest = () => {
    const mapKey = process.env.MAP_API_KEY || '';
    const mapId = process.env.MAP_ID || '';
    const [markers, setMarkers] = useState<{ lat: number; lng: number; time: string }[]>([]);
    const [infowindowOpen, setInfowindowOpen] = useState(false);
    const [markerRef, marker] = useAdvancedMarkerRef();

    const handleMapClick = (event: any) => {
        const { latLng } = event;
        const newMarker = {
            lat: latLng.lat(),
            lng: latLng.lng(),
            time: new Date().toISOString(), // Unique key for each marker
        };
        setMarkers((currentMarkers): any => [...currentMarkers, newMarker]);
    };


    const handleMarkerRightClick = (markerTime: string) => {
        setMarkers((currentMarkers) =>
            currentMarkers.filter((marker) => marker.time !== markerTime)
        );
    };

    return (
        <APIProvider apiKey={mapKey}>
            <Map
                style={{ width: '100%', height: '60vh' }}
                defaultCenter={initialCenter}
                mapId={mapId}
                defaultZoom={18}
                onClick={() => setInfowindowOpen(false)}
                gestureHandling={'greedy'}
                disableDefaultUI={false}
                zoomControl={false}
                
            >
                <AdvancedMarker
                    position={initialCenter}
                    ref={markerRef}
                    onClick={() => setInfowindowOpen(true)}
                    style={{ transform: 'translate(50%, 100%)' }}
                    title={'AdvancedMarker that opens an Infowindow when clicked.'}
                >
                </AdvancedMarker>
                {infowindowOpen && (
                    <InfoWindow
                        anchor={marker}
                        maxWidth={400}
                        onCloseClick={() => setInfowindowOpen(false)}>
                        <div className="p-2 text-xs ">

                            <h2 className="mb-2 text-lg text-left">My Home</h2>
                            <p className="mb-2 text-xs text-center">Hello this is my home, welcome!👋🏻</p>
                            <a
                                href={`https://www.google.com/maps?q=${initialCenter.lat},${initialCenter.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline text-xs text-center"
                            >
                                Ver en Google Maps
                            </a>
                        </div>
                    </InfoWindow>
                )}
            </Map>
        </APIProvider >
    );
};

export default React.memo(MapTest);
