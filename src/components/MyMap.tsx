import { APIProvider, Map } from "@vis.gl/react-google-maps"

interface Position {
  lat: number;
  lng: number;
}

const MyMap: React.FC<{ position: Position }> = ({ position }) => {
  return (
    <APIProvider apiKey={import.meta.env.VITE_MAPS_API}>
      <div style={{height: '500px', width: '500px'}}>
        <Map zoom={9} center={position}></Map>
      </div>
    </APIProvider>
  )
}

export default MyMap