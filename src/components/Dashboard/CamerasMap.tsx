import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { useMemo } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { MapContainer, TileLayer } from 'react-leaflet';

import { buildVisionPolygon, DEFAULT_CAM_RANGE_KM } from '@/utils/cameraVision';

import type { CameraType } from '../../services/camera';
import CameraMarkerMap from '../Common/Map/CameraMarkerMap';
import { CameraViewPolygon } from '../Common/Map/CameraViewPolygon';
import type { CameraWithPositionType } from '../Live/useDataLive';

interface CameraMapProps {
  cameras: (CameraType | CameraWithPositionType)[];
  height?: string;
  setMapRef: (map: LeafletMap) => void;
  markerRefs: RefObject<Map<number, LeafletMarker>>;
  setSelectedCameraId: Dispatch<SetStateAction<number | null>>;
}

export const CameraMap = ({
  cameras,
  height = '100%',
  setMapRef,
  markerRefs,
  setSelectedCameraId,
}: CameraMapProps) => {
  const camerasWithPolygons = useMemo(() => {
    return cameras.map((camera) => {
      let polygons: { visionPolygon: L.LatLng[]; azimuth: number }[] = [];
      if (camera.angle_of_view != null) {
        const angleOfView = camera.angle_of_view;
        const azimuths = (camera as CameraWithPositionType).azimuths ?? [];
        polygons = azimuths.map((azimuth) => {
          return {
            azimuth,
            visionPolygon: buildVisionPolygon(
              camera.lat,
              camera.lon,
              azimuth,
              angleOfView,
              DEFAULT_CAM_RANGE_KM
            ),
          };
        });
      }
      return {
        ...camera,
        polygons,
      };
    });
  }, [cameras]);

  const bounds = useMemo(() => {
    const allPolygonPoints = camerasWithPolygons
      .flatMap((cam) => cam.polygons)
      .map((polygon) => polygon.visionPolygon)
      .flatMap((p) => p);
    const allCamerasPoints = cameras.map(
      (c) => [c.lat, c.lon] as L.LatLngExpression
    );
    return L.latLngBounds(
      allPolygonPoints.length > 0 ? allPolygonPoints : allCamerasPoints
    );
  }, [cameras, camerasWithPolygons]);

  return (
    <MapContainer
      bounds={bounds}
      key={bounds.toBBoxString()}
      boundsOptions={{ padding: [20, 20] }}
      style={{ height, width: '100%', borderRadius: 4 }}
      ref={(m: LeafletMap) => setMapRef(m)} // give map ref to parent component
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {camerasWithPolygons.map((camera) => (
        <Fragment key={camera.id}>
          <CameraMarkerMap
            camera={camera}
            markerRefs={markerRefs}
            onClick={() => setSelectedCameraId(camera.id)}
          />
          {camera.polygons.map((polygon) => (
            <CameraViewPolygon
              key={`${camera.id}_${polygon.azimuth}`}
              visionPolygonPoints={polygon.visionPolygon}
            />
          ))}
        </Fragment>
      ))}
    </MapContainer>
  );
};

export default CameraMap;
