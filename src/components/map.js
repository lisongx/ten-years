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
          height: 300,
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

    _renderMarker = () => {
        return (
          <Marker key={`place-1`}
            longitude={this.state.longitude}
            latitude={this.state.latitude} >
            <Pin size={14} />
          </Marker>
        );
      }

    render() {
      const { latitude, longitude } = this.state
      return (
        <MapGL
          width={this.state.width}
          latitude={latitude}
          longitude={longitude}
          mapStyle={'mapbox://styles/seansay/cjketqiiq03hk2smymln8p0c0'}
          {...this.state.viewport}
          mapboxApiAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
          onViewportChange={(viewport) => this.setState({viewport})}
        >
            { this._renderMarker() }
        </MapGL>
      );
    }
  }

export default Map
