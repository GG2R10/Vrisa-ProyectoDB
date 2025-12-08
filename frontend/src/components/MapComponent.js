import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Badge } from 'react-bootstrap';
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
        <div className="rounded shadow border" style={{ height: '500px', width: '100%', overflow: 'hidden' }}>
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
                                <h6 className="fw-bold mb-1">{station.name}</h6>
                                <p className="small text-muted mb-2">
                                    Institución: {station.institution}
                                </p>
                                <div>
                                    <span className="fw-semibold small me-1">ICA:</span>
                                    <Badge bg={getICAColorBadge(station.ica)}>
                                        {station.ica}
                                    </Badge>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

const getICAColorBadge = (value) => {
    if (value < 50) return 'success';
    if (value < 100) return 'warning';
    if (value < 150) return 'danger';
    return 'dark';
};

export default MapComponent;
