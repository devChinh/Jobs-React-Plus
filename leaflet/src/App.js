import React, { useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import { useMapEvents } from 'react-leaflet/hooks'
import "leaflet/dist/leaflet.css";

function Map() {

  var latLngs = [
    [45.51, -122.68],
    [37.77, -122.43],
    [34.04, -118.2],
    [36.04, -116.2]
  ]

  const [locationLatLngs, setLocationLatLngs] = useState(latLngs)

  const icon = new L.Icon({
    iconUrl:
      "data:image/png;base64,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", // link đến hình ảnh của biểu tượng
    iconRetinaUrl: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  })

  const handleDragEnd = (event) => {
    const index = event.target.options.title
    const arrMarker = [event.target._latlng.lat, event.target._latlng.lng]
    const newLocation = [...locationLatLngs]
    newLocation.splice(index, 1, arrMarker)
    setLocationLatLngs(newLocation)
  }

  const handleRemoveMarker = (e) => {
    const index = e.target.options.title
    const newLocation = [...locationLatLngs]
    newLocation.splice(index , 1)
    setLocationLatLngs(newLocation)
  }

  return (
    <>
      <MapContainer style={{ width: "100vw", height: "100vh" }} center={[45.51, -122.68]} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          locationLatLngs.map((latLngs, index) => (
            <Marker eventHandlers={{ click: e => handleRemoveMarker(e), dragend: e => handleDragEnd(e) }} key={index} position={latLngs} draggable cursor={'pointer'} title={index} icon={icon}>
            </Marker>
          ))
        }
        <Polygon positions={locationLatLngs} />
        <LocationMarker locationLatLngs={locationLatLngs} setLocationLatLngs={setLocationLatLngs} />
      </MapContainer >,
    </>
  )
}

function LocationMarker(props) {

  const { locationLatLngs, setLocationLatLngs } = props

  const convertObj = (obj) => {
    const arr = Object.keys(obj).map(key => obj[key])
    return arr
  }

  useMapEvents({
    click(e) {

      const clickedLatLng = e.latlng

      console.log(clickedLatLng)
      // console.log(clickedLatLng)
      // const distances = locationLatLngs.map(locationLatLng => {
      //   const latLngs = L.latLng(locationLatLng);
      //   const distance = clickedLatLng.distanceTo(latLngs);
      //   return { distance, latLngs }
      // })

      // distances.sort((a, b) => a.distance - b.distance)
      // console.log('============= distances', distances)
      // const nearestPoints = distances.slice(0, 2).map(item => item.latLngs)
      // console.log(nearestPoints)

      // const nearestPoints1 = convertObj(nearestPoints[0])
      // const nearestPoints2 = convertObj(nearestPoints[1])


      // console.log('============= nearestPoints1', nearestPoints1)

      // console.log('============= nearestPoints[0]', nearestPoints[0].lat)

      // const newLatLngs = [convertObj(nearestPoints[0]), convertObj(nearestPoints[1]), convertObj(clickedLatLng)]
      // console.log('============= newLatLngs', newLatLngs)
      // setLocationLatLngs(newLatLngs, ...locationLatLngs)
    }
  })
}


export default Map;
