import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector } from "../store/sessionSlice";
import { roomSelector, fetchRooms } from "../store/roomSlice";
import type { AppDispatch } from "../store/store";
import { User } from "./components/User";
import { Room } from "./components/Room";
import './RoomList.css'

export function RoomList() {
   const dispatch = useDispatch<AppDispatch>();
  const session = useSelector(sessionSelector);
  const { rooms, status } = useSelector(roomSelector);

  const token = session.token || sessionStorage.getItem("token") || "";

  useEffect(() => {
    if (!token) return; 
    dispatch(fetchRooms(token));
  }, [dispatch, token]);

    return(
    <div className="rooms">
      {status === "idle" && <h3>ROOMS</h3>}
      {status === "loading" && <p>Loading rooms...</p>}
      {status === "failed" && <p>Failed to load rooms.</p>}
      {status === "idle" && rooms.length === 0 && <p>No rooms found.</p>}

      {rooms.map((room) => (
        <Room key={room.name} room={room} />
      ))}
    </div>
    )


}
