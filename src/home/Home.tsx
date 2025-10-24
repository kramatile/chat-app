import { UserList } from "../user/UserList";
import {RoomList} from "../user/RoomList";
import "./Home.css";
import {Message } from "../messages/Message";
import { useParams } from "react-router";

export function Home(){
    let {type, id} = useParams();
    return(
        <div className="home">
            <div className="lists">
                <UserList/>
                <RoomList/>
            </div>
            <div className="messages">        
                <Message id={id} type={type}/>
            </div>
        </div>
    )
}