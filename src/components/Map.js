import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import "../Map.css"
import geoJSON from '../cryptids.json';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


mapboxgl.accessToken = 'pk.eyJ1IjoibmljaG9sYXNkYnJvb2tzIiwiYSI6ImNsNWJnMmN0bjA3NjEzb210ejZ2OTI3aXEifQ.juy7aPIUS_YV9flaucjNfw';

function CryptidMap() {
  const mapRef = useRef(null);

  // initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [0, 10],
      zoom: 1.75,
      setMaxPitch: 0,
      dragRotate: false
    });

    // create markers and popups

    geoJSON.features.map((cryptid) => 
      new mapboxgl.Marker().setLngLat([cryptid.geometry.coordinates[1], cryptid.geometry.coordinates[0]]).setPopup(new mapboxgl.Popup()
      .setHTML(`<div className='popname'>${cryptid.properties.name}</div>
      <img width="200" src=${cryptid.properties.picture} alt={cryptid.properties.name} />
      <p>Paragraph on Cryptid (microservice will populate)</p>
      <a target=${"_new"} href=${cryptid.properties.wiki}>Wikipedia (new tab)</a>`)).addTo(map)
    );
    
    const geocoder = (q) => {
      const matching = [];
      for (const feature of geoJSON.features) {
        if (feature.properties.name
              .toLowerCase()
              .includes(q.toLowerCase())) {
                feature['place_name'] = `${feature.properties.name}`;
                feature['center'] = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
                feature['place_type'] = ["cryptid location"];
                matching.push(feature);
              }
            }
          return matching;
      }
    

    // add nav controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
    map.addControl(new mapboxgl.GeolocateControl(), 'top-left');
    map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Find a Cryptid',
      localGeocoder: geocoder,
      localGeocoderOnly: true,
      marker: false,
      zoom: 12
    }));

    return () => map.remove();
  }, []);

  return (
    <>
      <div className='mapcontainer' ref={mapRef} />
    </>
  );
}

export default CryptidMap;