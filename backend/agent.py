from __future__ import annotations
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
    llm
)
from livekit.agents import AgentSession
from livekit.plugins import openai
from dotenv import load_dotenv
from api import AssistantFnc
from prompts import WELCOME_MESSAGE, INSTRUCTIONS, LOOKUP_VIN_MESSAGE
import os
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import openai, deepgram, noise_cancellation, silero

load_dotenv()

async def entrypoint(ctx: JobContext):
    await ctx.connect(auto_subscribe=AutoSubscribe.SUBSCRIBE_ALL)
    await ctx.wait_for_participant()
    
    model = openai.realtime.RealtimeModel(
        # instructions=INSTRUCTIONS,
        voice="shimmer",
        temperature=0.8,
        modalities=["audio", "text"]
    )

    
    rt_session = model.session()
    await rt_session.update_instructions(INSTRUCTIONS)

    assistant_fnc = AssistantFnc()
    # assistant = MultimodalAgent(model=model, fnc_ctx=assistant_fnc)
    # assistant.start(ctx.room)
    
    agent_session = AgentSession(
        stt=deepgram.STT(),
        llm=openai.LLM(),
        tts=openai.TTS(),
        vad=silero.VAD.load(),
    )
    await agent_session.start(
        room=ctx.room,
        agent=Agent(instructions="You are a helpful voice AI assistant."),
        room_input_options=RoomInputOptions(noise_cancellation=noise_cancellation.BVC()),
    )

    agent_session.conversation.item.create(
    llm.ChatMessage(role="assistant", content=WELCOME_MESSAGE)
    )
    agent_session.response.create()
        
    @rt_session.on("response")
    def on_response(resp):
        print("Assistant replied:", resp.output_text)

    # send a welcome message
    await rt_session.input_text(WELCOME_MESSAGE)

    
    @rt_session.on("user_speech_committed")
    def on_user_speech_committed(msg: llm.ChatMessage):
        if isinstance(msg.content, list):
            msg.content = "\n".join("[image]" if isinstance(x, llm.ChatImage) else x for x in msg)
            
        if hasattr(assistant_fnc, "has_car") and assistant_fnc.has_car():
            handle_query(msg)
        else:
            find_profile(msg)
        
    def find_profile(msg: llm.ChatMessage):
        rt_session.conversation.item.create(
            llm.ChatMessage(role="system", content=LOOKUP_VIN_MESSAGE(msg))
        )
        rt_session.response.create()
        
    def handle_query(msg: llm.ChatMessage):
        rt_session.conversation.item.create(
            llm.ChatMessage(role="user", content=msg.content)
        )
        rt_session.response.create()
    
if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))