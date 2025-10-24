import { useState } from "react";
import { Message } from "./components/Message";
import { useSelector } from "react-redux";

interface Message {
text:string,
sender: string,
sendTime: string
}
export function Chat({type,id}: {type:string,id:number}){
    const [messages, setMessages] = useState<Message[]>([])

    return (
        <>
            <div className="chat__body">
                <Message text="hii" username="test" sendTime="21222"/>
                <Message text="hii" username="aya" sendTime="21222"/>

                {
                    messages.map((message)=>{
                       return  <Message text={message.text} username={message.sender} sendTime={message.sendTime}/>
                    })
                }
            </div>
            <div className="chat__footer">
                <input/>
                <button>Send</button>
            </div>
        </>
        
    )
}