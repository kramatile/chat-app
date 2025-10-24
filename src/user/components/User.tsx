import { useNavigate } from "react-router-dom";
import type { User } from "../../model/common";
import './User.css';
export function User({user}:{user: User}){
    let navigate = useNavigate();
    const handleClick = ()=>{
        navigate(`/messages/user/${user.user_id}`)
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
