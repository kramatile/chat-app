import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../store/sessionSlice";
import { userSelector,filteredUsers } from "../store/userSlice";
import { fetchUsers } from "../store/userSlice";
import type { AppDispatch } from "../store/store";
import { User } from "./components/User";
import "./UserList.css";

export function UserList() {
   const dispatch = useDispatch<AppDispatch>();
  const session = useSelector(sessionSelector);
  const {status } = useSelector(userSelector);
  const token = session.token || sessionStorage.getItem("token") || "";
  const username = session.username || sessionStorage.getItem("username") || "";
  const users = useSelector(filteredUsers)(username);

  useEffect(() => {
    if (!token) return; 
    dispatch(fetchUsers(token));

  }, [dispatch, token]);


    return(
    <div className="users">
      <h3>USERS</h3>
      {status === "loading" && <p className="default">Loading users...</p>}
      {status === "failed" && <p className="default">Failed to load users.</p>}
      {status === "idle" && users.length === 0 && <p className="default">No users found.</p>}
      {users.map((user) => (
        <User key={user.user_id} user={user} />
      ))}
    </div>
    )


}
