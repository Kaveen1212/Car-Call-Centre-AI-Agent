import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";

const Message = ({ type, text }) => {
  return (
    <div className={`mb-2.5 flex ${type === "agent" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] p-3 px-5 rounded-lg ${
        type === "agent" 
          ? "bg-blue-600 text-white ml-auto" 
          : "bg-gray-700 text-white mr-auto"
      }`}>
        <strong className="block mb-1">
          {type === "agent" ? "Agent" : "You"}
        </strong>
        <span>{text}</span>
      </div>
    </div>
  );
};

const SimpleVoiceAssistant = ({ onClose }) => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  return (
      <div className="fixed inset-0 w-full min-h-[100svh] bg-[#0b0b0b] overflow-auto">
      <button
        type="button"
        aria-label="Close"
        className="fixed top-3 right-3 z-50 p-2 rounded-full text-[#e2e2e2] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
        onClick={() => {
          onClose?.();
          window.location.assign("/"); // redirect to App.jsx (root)
        }}
      >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="flex flex-col items-center justify-start w-full max-w-[1200px] mx-auto px-5 pb-5 text-white">
          <div className="w-full max-w-[1200px] h-[40vh] mx-auto">
            <BarVisualizer state={state} barCount={7} trackRef={audioTrack} />
          </div>
          <div className="w-full max-w-[1200px] mt-5">
            {/* Force white color on buttons/icons inside the control bar */}
            <VoiceAssistantControlBar className="text-white [&_*]:text-white [&_svg]:fill-white" />
            <div className="p-5 max-h-[450px] overflow-y-auto w-full h-full rounded-lg mt-5 bg-transperent scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {messages.map((msg, index) => (
                <Message key={msg.id || index} type={msg.type} text={msg.text} />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default SimpleVoiceAssistant;