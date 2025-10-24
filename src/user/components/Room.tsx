import type { Room } from "../../model/common";
import { useNavigate } from "react-router-dom";
import "./Room.css"
export function Room({room}:{room: Room}){
     let navigate = useNavigate();
    const handleClick = ()=>{
        navigate(`/messages/room/${room.room_id}`)
    }
    return(
        <div className="room" onClick={handleClick}>
            <p>{room.name}</p>
            <div className="room__info">
                <p>{room.created_on}</p>
            </div>
        </div>
    )

}