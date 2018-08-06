import React, { Component }  from 'react'
import MapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
import Pin from './pin'

import 'mapbox-gl/dist/mapbox-gl.css';

class Map extends Component {
    constructor(props) {
      super(props);
      this.state = {
        width: 0,
        longitude: this.props.longitude,
        latitude: this.props.latitude,
        viewport: {
          isDragging: false,
          height: 230,
          zoom: 13,
        }
      };
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({
        width: window.innerWidth,
      })
    }

    _renderMarker = (longitude, latitude) => {
        return (
          <Marker key={`place-1`}
            longitude={longitude}
            latitude={latitude} >
            <Pin size={24} />
          </Marker>
        );
      }

    render() {
      const { latitude, longitude } = this.props
      return (
        <MapGL
          width={this.state.width}
          latitude={latitude}
          longitude={longitude}
          attributionControl={false}
          mapStyle={'mapbox://styles/seansay/cjkhype7i352a2so5shgtgjb3'}
          {...this.state.viewport}
          mapboxApiAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
        //   disable dragging
        //   onViewportChange={(viewport) => this.setState({viewport})}
        >
            { this._renderMarker(longitude, latitude) }
        </MapGL>
      );
    }
  }

export default Map
