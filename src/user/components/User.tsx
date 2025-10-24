import type { User } from "../../model/common";
import './User.css';
export function User({user}:{user: User}){
    const handleClick = ()=>{
        
    }

    return(
        <div className="user" onClick={handleClick}>
            <p>{user.username}</p>
            <div className="user__info">
                <p>{user.last_login}</p>
            </div>
        </div>
    )

}
