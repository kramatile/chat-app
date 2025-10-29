import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { fetchMessages } from "../store/messagesSlice";
import { sessionSelector, clearSession } from "../store/sessionSlice";
import { useNavigate } from "react-router-dom";
import type { Message as MessageType } from "../model/common";
import { Message } from "./components/Message";
import { messageSelector, addMessage } from "../store/messagesSlice";

export function Chat({ type, id, name }: { type: string; id: number, name: string | undefined }) {
  const [input, setInput] = useState("");

  const session = useSelector(sessionSelector);
  const {messages, status} = useSelector(messageSelector);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  const token = session.token || sessionStorage.getItem("token");
  const externalId = session.externalId || sessionStorage.getItem("externalId");
  const username = session.username || sessionStorage.getItem("username");
  const cur_id = sessionStorage.getItem("id");

  useEffect(() => {
    if (!token || !externalId || !username || !cur_id) {
      dispatch(clearSession());
      navigate("/login");
      return;
    }
    let convKey =""
    if (type === "room"){
            convKey = `${type}:${id}`;
    }
    else {
        const left_id = Math.min(id, parseInt(cur_id))
        const right_id = Math.max(id,parseInt(cur_id))
        convKey = `${left_id}:${right_id}`;
    }

    dispatch(fetchMessages({ token, conv_id: convKey }))
      
      .catch((err) => {
        console.error("Failed to fetch messages:", err);
      });
  }, [token, externalId, username, type, id, cur_id,dispatch, navigate]);


    const handleClick = async () => {
      if (!input.trim()) return;
        if (!token || !externalId || !username || !cur_id) {
          dispatch(clearSession());
          navigate("/login");
          return;
        }      
        const newMessage = {
          text: input,
          sender_name: username,
          sender_id: parseInt(cur_id),
          sent_time: new Date().toISOString(),
          key: type === "room"
            ? `${type}:${id}`
            : `${Math.min(id, parseInt(cur_id))}:${Math.max(id, parseInt(cur_id))}`,
        } ; 

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
    const chatBody = document.querySelector(".chat__body");
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }, [messages]);

  
  return (
    <div className="chat">
      <div className="chat__header">
                <h3>Chat {type === "room" ? "in" : "with"} : {name}</h3>
      </div>
      {status === "idle" && <div className="chat__body">
            
        {/*    <Message text=" i love aya" username="test" sendTime="now"/>
        <Message text=":)))" username="Aya" sendTime="now"/>*/}
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
}
    {
      status === "loading" && <div className="chat__body">
        <div className="chat__body__loading">
           Loading the messages . . . 
        </div>
      </div>
    }
    {
      status === "failed" && <div className="chat__body">
        <div className="chat__body__failed">
          An error has occured
        </div>
      </div>
    }
      <div className="chat__footer">
        <input value={input} type="text" placeholder="Type a message..." onChange={(e)=>setInput(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
    </div>
  );
}
