import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CaliCenter = [3.4516, -76.5320];

const MapComponent = ({ stations = [], onStationSelect }) => {
    return (
        <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <MapContainer center={CaliCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {stations.map((station) => (
                    <Marker
                        key={station.id}
                        position={[station.lat, station.lng]}
                        eventHandlers={{
                            click: () => onStationSelect(station),
                        }}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-gray-800">{station.name}</h3>
                                <p className="text-sm text-gray-600">Institución: {station.institution}</p>
                                <div className="mt-2 text-xs">
                                    <span className="font-semibold">ICA: </span>
                                    <span className={`px-2 py-0.5 rounded text-white ${getICAColor(station.ica)}`}>
                                        {station.ica}
                                    </span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

const getICAColor = (value) => {
    if (value < 50) return 'bg-green-500';
    if (value < 100) return 'bg-yellow-500';
    if (value < 150) return 'bg-orange-500';
    return 'bg-red-500';
};

export default MapComponent;
