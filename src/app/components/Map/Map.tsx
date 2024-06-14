'use client';
import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const initialCenter = {
    lat: 10.916598461452587,
    lng: -74.81070847861618
};

const Map = () => {
    const mapKey = process.env.MAP_API_KEY || '';
    const [markers, setMarkers] = useState<{ lat: number; lng: number; time: string }[]>([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: mapKey,
    });

    const handleMapClick = (event: any) => {
        const { latLng } = event;
        const newMarker = {
            lat: latLng.lat(),
            lng: latLng.lng(),
            time: new Date().toISOString(), // Unique key for each marker
        };
        setMarkers((currentMarkers): any => [...currentMarkers, newMarker]);
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps</div>;
    }

    const handleMarkerRightClick = (markerTime: string) => {
        setMarkers((currentMarkers) =>
            currentMarkers.filter((marker) => marker.time !== markerTime)
        );
    };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={initialCenter}
            zoom={15}
            onClick={handleMapClick} // Agrega un marcador haciendo clic en el mapa
        >
            {/* Marcador fijo inicial */}
            <Marker
                position={initialCenter}
                draggable={false} // El marcador no se puede arrastrar
            />

            {/* Marcadores adicionales */}
            {markers.map((marker: any) => (
                <>
                    <Marker
                        key={marker.time}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        onClick={() => handleMarkerRightClick(marker.time)}
                    />
                </>
            ))}

        </GoogleMap>
    );
};

export default React.memo(Map);
