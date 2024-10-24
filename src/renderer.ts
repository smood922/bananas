import './index.css';

import { webRTC } from './lib/WebRTC'

const btn = document.getElementById('startButton') as HTMLButtonElement;

btn.addEventListener('click', async () => {
  await webRTC({
    localVideo: document.getElementById('localVideo') as HTMLVideoElement,
    remoteVideo: document.getElementById('remoteVideo') as HTMLVideoElement,
    localOffer: document.getElementById('localOffer') as HTMLTextAreaElement,
    remoteOffer: document.getElementById('remoteOffer') as HTMLTextAreaElement,
    localOfferButton: document.getElementById('localOfferButton') as HTMLButtonElement,
    remoteOfferButton: document.getElementById('remoteOfferButton') as HTMLButtonElement,
  });
});
