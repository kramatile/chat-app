import { useEffect, useState, useMemo } from "react"; // <-- 1. Import useMemo
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { fetchMessages } from "../store/messagesSlice";
import { sessionSelector, clearSession } from "../store/sessionSlice";
import { useNavigate } from "react-router-dom";
import type { Message as MessageType } from "../model/common";
import { Message } from "./components/Message";
import { messageSelector, addMessage } from "../store/messagesSlice";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { userIdSelector,userSelector } from "../store/userSlice";

export function Chat({
  type,
  id,
  name,
}: {
  type: string;
  id: number;
  name: string | undefined;
}) {
  const [input, setInput] = useState("");
  
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: import.meta.env.VITE_PUSHER_INSTANCE_ID || "",
  });
  
  const session = useSelector(sessionSelector);
  const { messages, status } = useSelector(messageSelector);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, status: userStatus } = useSelector(userSelector);
  const destinataire_ext_id = useMemo(() => {
    if (type !== 'user') return "";
    console.log(users)
    const destinataire = users.find(user => user.user_id === id);
    
    return destinataire?.external_id || "";

  }, [type, id, users]); 
  const token = session.token || sessionStorage.getItem("token");
  const externalId = session.externalId || sessionStorage.getItem("externalId");
  const username = session.username || sessionStorage.getItem("username");
  
  const currentUserId = parseInt(sessionStorage.getItem("id") || "0"); 
  
  const conversationKey = useMemo(() => {
    if (type === "room") {
      return `${type}:${id}`;
    }
    const left_id = Math.min(id, currentUserId);
    const right_id = Math.max(id, currentUserId);
    return `${left_id}:${right_id}`;
  }, [type, id, currentUserId]); 

  useEffect(() => {
    if (!token || !externalId || !username || !currentUserId) {
      dispatch(clearSession());
      navigate("/login");
      return;
    }
    
    dispatch(fetchMessages({ token, conv_id: conversationKey })).catch((err) => {
      console.error("Failed to fetch messages:", err);
    });
    
  }, [token, externalId, username, conversationKey, dispatch, navigate, currentUserId]); 

  const handleClick = async () => {
    if (!input.trim()) return;
    
    if (!token || !externalId || !username || !currentUserId) {
      dispatch(clearSession());
      navigate("/login");
      return;
    }

    const newMessage = {
      text: input,
      sender_name: username,
      sender_id: currentUserId,
      sent_time: new Date().toISOString(),
      key: conversationKey, 
      sent_to_ext_id: type === "user" ? destinataire_ext_id : "",
      type: type
    };

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${token}`,
      },
      body: JSON.stringify(newMessage),
    });

    if (res.ok) {
      dispatch(addMessage(newMessage));
      setInput("");
    }
  };
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            const sw = navigator.serviceWorker;
            
            if (sw != null) {
                sw.onmessage = (event) => {
                    console.log("Got event from sw : ", event.data.message);
                    
                  if (event.data.type === 'NEW_PUSH_MESSAGE') {
                      let newMessage = {
                        text : event.data.message.text,
                        sender_name: event.data.message.sender_name,
                        sender_id: event.data.message.sender_id,
                        sent_time: event.data.message.sent_time
                      } as MessageType
                      if (newMessage.sender_id != currentUserId){
                          dispatch(addMessage(newMessage));
                      }
                 }
                };

            }
        } else {
            console.warn("Service Workers not supported in this browser.");
        }
        
        return () => {
            if ("serviceWorker" in navigator && navigator.serviceWorker) {
                navigator.serviceWorker.onmessage = null; 
            }
        };

    }, [dispatch]);

  useEffect(() => {
    const chatBody = document.querySelector(".chat__body");
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat__header">
        <h3>
          Chat {type === "room" ? "in" : "with"} : {name}
        </h3>
      </div>
      {status === "idle" && (
        <div className="chat__body">
          {messages.length === 0 ? (
            <div className="chat__placeholder">No messages yet</div>
          ) : (
            messages.map((message, index) => (
              <Message
                key={index} 
                text={message.text}
                username={message.sender_name}
                sendTime={message.sent_time}
              />
            ))
          )}
        </div>
      )}
      {status === "loading" && (
        <div className="chat__body">
          <div className="chat__body__loading">Loading the messages . . .</div>
        </div>
      )}
      {status === "failed" && (
        <div className="chat__body">
          <div className="chat__body__failed">An error has occurred</div>
        </div>
      )}
      <div className="chat__footer">
        <input
          value={input}
          type="text"
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()} // Added Enter key send
        />
        <button onClick={handleClick}>Send</button>
      </div>
    </div>
  );
}

