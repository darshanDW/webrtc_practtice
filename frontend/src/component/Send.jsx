import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

function Sender() {
    const [socket, setSocket] = useState(null);
    const roomId = 'room1'; // Example room ID
    const [pc, setPc] = useState();
    const [isNegotiating, setIsNegotiating] = useState(false);

    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);

        s.emit('join-room', { roomId, type: "sender" });

        return () => {
            s.disconnect();
        };
    }, []);

    const sendOffer = async () => {
        const pc = new RTCPeerConnection();
        setPc(pc);

        if (socket) {
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', event.candidate);
                    console.log("candidate created");
                }
            };

            pc.onnegotiationneeded = async () => {
                if (isNegotiating) return;
                setIsNegotiating(true);

                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('create-offer', pc.localDescription);
                    console.log("offer sent");
                    getCameraStreamAndSend(pc);


                } finally {
                    setIsNegotiating(false);

                }
            };

            socket.on('receive-answer', answer => {
                pc.setRemoteDescription(answer);
                console.log("answer received");
            });

            socket.on('receive-candidate', candidate => {
                pc.addIceCandidate(candidate);
                console.log("candidate received");
            });

            getCameraStreamAndSend(pc);
        }
    };

    const getCameraStreamAndSend = (pc) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });
            const video = document.getElementById('2');
        });
    };

    return (
        <div>
            <button onClick={sendOffer}>Send Video</button>
        </div>
    );
}

export default Sender;
