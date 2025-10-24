import { DefaultMessage } from "./DefaultMessage";
import { Chat } from "./Chat";
import { UseSelector } from "react-redux";
import { userIdSelector } from "../store/userSlice";
import { useSelector } from "react-redux";
import { roomIdSelector } from "../store/roomSlice"
import "./Message.css"

export function Message({type,id}:{type:string | undefined ,id:string | undefined}){
    if (type === "room" && id){
        const room = useSelector(roomIdSelector)(parseInt(id))
        return( 
        <div className="chat">
            <div className="chat__header">
                <h3>Chat in : {room?.name}</h3>
            </div>
            <Chat type="room" id={parseInt(id)}/>
        </div>);
    } else if (type === "user" && id){
        const user = useSelector(userIdSelector)(parseInt(id));
        return( 
        <div className="chat">
            <div className="chat__header">
                <h3>Chat with : {user?.username}</h3>
            </div>
            <Chat type="user" id={parseInt(id)}/>
        </div>);
    
    }
    return(
        <DefaultMessage/>
    )
}