import { useState, useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import SimpleVoiceAssistant from "./SimpleVoiceAssistant";

const LiveKitModal = ({ setShowSupport }) => {
  const [isSubmittingName, setIsSubmittingName] = useState(true);
  const [name, setName] = useState("");
  const [token, setToken] = useState(null);

  const getToken = useCallback(async (userName) => {
    try {
      const response = await fetch(`/api/getToken?name=${encodeURIComponent(userName)}`);
      const token = await response.text();
      setToken(token);
      setIsSubmittingName(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      getToken(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1000]">
      <div className="bg-[#181818] p-8 rounded-lg relative w-[80%] max-w-[800px] h-[40vh] lg:h-[50vh] xl:h-[35vh]">
        {/* Close button at top-right of the modal */}
        <button
          type="button"
          aria-label="Close"
          className="absolute top-3 right-3 p-2 rounded-full text-[#e2e2e2] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          onClick={() => setShowSupport(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="h-full w-full">
          {isSubmittingName ? (
            <form onSubmit={handleNameSubmit} className="flex flex-col items-center gap-4 p-8 max-w-[400px] mx-auto">
              <h2 className="text-[#e2e2e2] text-center mb-4">Enter your name to connect with support</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full p-3 border-2 border-[#615e5e] rounded text-base text-white placeholder:text-[#615e5e]"
              />
              <button type="submit" className="w-full p-3 bg-white text-black rounded text-base transition-colors hover:bg-gray-200">
                Connect
              </button>
              {/* removed inline close button */}
            </form>
          ) : token ? (
            <LiveKitRoom
              serverUrl={import.meta.env.VITE_LIVEKIT_URL}
              token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTY5MDg0NTksImlkZW50aXR5IjoiSEFSU0hBIiwiaXNzIjoiQVBJWEdmRDVVcXNWc1c2IiwibmJmIjoxNzU2OTA3NTU5LCJzdWIiOiJIQVJTSEEiLCJ2aWRlbyI6eyJjYW5QdWJsaXNoIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJyb29tIjoiUk9PTTEiLCJyb29tSm9pbiI6dHJ1ZX19.0pN86BJ1xMV7GgvTrnsMOVE-_0yr_gCRGIQmuotCJs8"
              connect={true}
              video={false}
              audio={true}
              onDisconnected={() => {
                setShowSupport(false);
                setIsSubmittingName(true);
              }}
            >
              <RoomAudioRenderer />
              <SimpleVoiceAssistant />
            </LiveKitRoom>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LiveKitModal;