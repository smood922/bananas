import { FC } from 'react';
import { Navigation } from './../navigation';

export const GUI: FC = () => {
  return <>
    <div className="container">
      <Navigation />
      <button className="button" id="startButton">Start</button>
      <h2>Local</h2>
      <div>
        <video width="250" id="localVideo" controls autoPlay />
        <textarea className="textarea" id="localOffer"></textarea>
        <button className="button" id="localOfferButton">CreateOffer</button>
      </div>
      <h2>Remote</h2>
      <div>
        <video width="250" id="remoteVideo" controls autoPlay />
        <textarea className="textarea" id="remoteOffer"></textarea>
        <button className="button" id="remoteOfferButton">Answer</button>
      </div>
    </div>
  </>;
};
