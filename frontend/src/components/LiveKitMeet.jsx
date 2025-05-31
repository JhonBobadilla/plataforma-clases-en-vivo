import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";

const LIVEKIT_URL = "ws://localhost:7880";

const LiveKitMeet = ({ roomName, token, onLeave }) => {
  
  console.log('LiveKitMeet.jsx - roomName:', roomName, 'token:', token);

  if (!token) return <div className="text-center py-10 text-lg text-red-500">Conectando...</div>;

  return (
    
    <div style={{ width: "100%", height: "100%" }}>
      <LiveKitRoom
        token={token}
        serverUrl={LIVEKIT_URL} 
        connect={true}
        data-lk-theme="default"
        style={{ height: "100%" }}
        onDisconnected={onLeave}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
};

export default LiveKitMeet;




