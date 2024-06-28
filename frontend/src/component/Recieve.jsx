import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

function Receiver() {
  const [socket, setSocket] = useState(null);
  const roomId = 'room1'; // Example room ID
  const videoRef = useRef(null);
  // const videoRef = useRef(HTMLVideoElement);
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    s.emit('join-room', { roomId, type: "receiver" });


    return () => {
      s.disconnect();
    };

    return () => {
      s.disconnect();
    };
  }, []);

  if (socket) {
    socket.on('receive-offer', async offer => {
      console.log(offer);
      const pc = new RTCPeerConnection();
      pc.setRemoteDescription(offer);


      const video = document.getElementById('1');


      // If not, create a new MediaStream and assign it to srcObject
      pc.ontrack = (event) => {
        console.log(event.track);
        video.srcObject = new MediaStream([event.track]);

        console.log(video.srcObject);
        console.log(1);


        // Add the new track to the existing MediaStream
        video.srcObject.addTrack(event.track);
        console.log(video.srcObject);

      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log(answer);
      socket.emit('create-answer', pc.localDescription);
    });
  }


  return (
    <div>
      <video autoPlay id='1'></video>
    </div>
  );
}

export default Receiver;
