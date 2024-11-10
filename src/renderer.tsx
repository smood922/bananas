import React from 'react'
import { createRoot } from 'react-dom/client';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma/css/bulma.min.css';
import './index.css';

import { webRTC } from './lib/WebRTC'
import { GUI } from './components/gui';

const startFunc =  async () => {
  await webRTC({
    localVideo: document.getElementById('localVideo') as HTMLVideoElement,
    remoteVideo: document.getElementById('remoteVideo') as HTMLVideoElement,
    localOffer: document.getElementById('localOffer') as HTMLTextAreaElement,
    remoteOffer: document.getElementById('remoteOffer') as HTMLTextAreaElement,
    localOfferButton: document.getElementById('localOfferButton') as HTMLButtonElement,
    remoteOfferButton: document.getElementById('remoteOfferButton') as HTMLButtonElement,
  });
};

const rootNode = document.getElementById('root') as HTMLElement;

createRoot(rootNode).render(
  <React.StrictMode>
    <GUI />
  </React.StrictMode>,
)
