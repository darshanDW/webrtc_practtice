import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

function Sender() {
    const [socket, setSocket] = useState(null);
    const roomId = 'room1'; // Example room ID
    const [pc, setPc] = useState();
    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);

        s.emit('join-room', { roomId, type: "sender" });

        s.on('receive-offer', offer => {
            console.log('Received offer in sender:', offer);
        });

        return () => {
            s.disconnect();
        };

        return () => {
            s.disconnect();
        };
    }, []);

    const sendOffer = async () => {
        const offer = 4; // Your offer data
        console.log(offer);

        const pc = new RTCPeerConnection();
        setPc(pc);
        if (socket) {

            pc.onnegotiationneeded = async () => {

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit('create-offer', pc.localDescription);

                console.log('Sent offer:', offer);
                getCameraStreamAndSend(pc);

            }
            socket.on('receive-answer', answer => {
                pc.setRemoteDescription(answer);
                console.log(answer.sdp);
            })

        }

        getCameraStreamAndSend(pc);

    };
    const getCameraStreamAndSend = (pc) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {

            stream.getTracks().forEach((track) => {
                pc.addTrack(track);
            });
        });
    };
    return (
        <div>
            <button onClick={sendOffer}>Send Video</button>
            <video autoPlay id='2'></video>
        </div>
    );
}

export default Sender;
