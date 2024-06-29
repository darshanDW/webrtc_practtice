import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

function Receiver() {
  const [socket, setSocket] = useState(null);
  const roomId = 'room1'; // Example room ID

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    s.emit('join-room', { roomId, type: "receiver" });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      const pc = new RTCPeerConnection();

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate);
          console.log("candidate created");
        }
      };

      socket.on('receive-offer', async (offer) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        console.log("offer received");

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('create-answer', pc.localDescription);
        console.log("answer sent");
      });

      socket.on('receive-candidate', (candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("candidate received");
      });

      const video = document.getElementById('1');
      pc.ontrack = (event) => {
        if (!video.srcObject) {
          video.srcObject = new MediaStream();
        }
        video.srcObject.addTrack(event.track);
      };
    }
  }, [socket]);

  return (
    <div>
      <video autoPlay id='1'></video>
    </div>
  );
}

export default Receiver;
