
import React from 'react'
import { Howler } from 'howler'
import Slider, { Range } from 'rc-slider';

import 'rc-slider/assets/index.css';

class AudioControl extends React.Component {
  constructor(props) {
    super(props);
    this.defaultVol = 0.7
  }

  updateVol(vol) {
    Howler.volume(vol)
  }

  render() {
    return (<div className={"audio-control"}>
          <a alt="turn up the volume" onClick={()=> {
            this.updateVol(1)
          }}>🔊</a>
          <Slider
              trackStyle={{
                backgroundColor: "rgb(85, 48, 48)",
              }}
              handleStyle={{
                border: "4px solid rgb(85, 48, 48)",
              }}
              vertical={true}
              min={0} max={1} step={0.005} defaultValue={this.defaultVol}
              onChange={(vol) => {
                this.updateVol(vol)
          }}/>
          <a alt="mute!" onClick={()=> {
            this.updateVol(0)
          }}>🔇</a>
      </div>)
  }
}

export default AudioControl
