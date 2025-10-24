import type { Room } from "../../model/common";
import "./Room.css"
export function Room({room}:{room: Room}){
    const handleClick = ()=>{
        
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