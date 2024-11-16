const conf = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

function errHandler(err: unknown): void {
  console.log(err)
}

type WebRTCOptions = {
  localVideo: HTMLVideoElement
  remoteVideo: HTMLVideoElement
  localOffer: HTMLTextAreaElement
  remoteOffer: HTMLTextAreaElement
  localOfferButton: HTMLButtonElement
  remoteOfferButton: HTMLButtonElement
}

export const webRTC = async (opts: WebRTCOptions): Promise<void> => {
  const pc = new RTCPeerConnection(conf)
  let _chatChannel: RTCDataChannel

  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
  // pc.addStream(stream)
  opts.localVideo.srcObject = stream
  opts.localVideo.muted = true

  // function sendMsg(text: string): void {
  //   _chatChannel.send(text)
  // }

  pc.ondatachannel = function (e): void {
    if (e.channel.label == 'chatChannel') {
      console.log('chatChannel Received -', e)
      _chatChannel = e.channel
      chatChannel(e.channel)
    }
  }

  pc.onicecandidate = function (e): void {
    const cand = e.candidate
    if (!cand) {
      console.log('iceGatheringState complete\n', pc.localDescription.sdp)
      opts.localOffer.value = JSON.stringify(pc.localDescription)
    } else {
      console.log(cand.candidate)
    }
  }
  pc.oniceconnectionstatechange = function (): void {
    console.log('iceconnectionstatechange: ', pc.iceConnectionState)
  }

  pc.ontrack = function (e): void {
    console.log('remote ontrack', e.streams)
    opts.remoteVideo.srcObject = e.streams[0]
  }

  opts.remoteOfferButton.onclick = function (): void {
    const _remoteOffer = new RTCSessionDescription(JSON.parse(opts.remoteOffer.value))
    console.log('remoteOffer \n', _remoteOffer)
    pc.setRemoteDescription(_remoteOffer)
      .then(function () {
        console.log('setRemoteDescription ok')
        if (_remoteOffer.type == 'offer') {
          pc.createAnswer()
            .then(function (description) {
              console.log('createAnswer 200 ok \n', description)
              pc.setLocalDescription(description)
                .then(function () {
                  // do nothing
                })
                .catch(errHandler)
            })
            .catch(errHandler)
        }
      })
      .catch(errHandler)
  }
  opts.localOfferButton.onclick = function (): void {
    _chatChannel = pc.createDataChannel('chatChannel')
    chatChannel(_chatChannel)
    pc.createOffer()
      .then((des) => {
        console.log('createOffer ok ')
        pc.setLocalDescription(des)
          .then(() => {
            setTimeout(function () {
              if (pc.iceGatheringState == 'complete') {
                return
              } else {
                console.log('after GetherTimeout')
                opts.localOffer.value = JSON.stringify(pc.localDescription)
              }
            }, 2000)
            console.log('setLocalDescription ok')
          })
          .catch(errHandler)
        // For chat
      })
      .catch(errHandler)
  }

  function chatChannel(cc: RTCDataChannel): void {
    cc.onopen = function (e): void {
      console.log('chat channel is open', e)
    }
    cc.onmessage = function (e): void {
      console.log('chat channel message', e.data)
    }
    cc.onclose = function (): void {
      console.log('chat channel closed')
    }
  }
}
