import { useEffect, useState } from "react";
import Header from "./main/Header";
// import { Navigate } from "react-router-dom";
import RoomsList from "./main/RoomsList";
import { send_data } from "../utils/posts";
import { useAuth } from "../context/AuthContext";

interface TypeRoom {
  room: number;
  _id: string;
  user: string;
  occupied: boolean;
}

export default function Main() {
  const [showRoom, setShowRoom] = useState(false);
  // @ts-ignore
  const [room, setRoom] = useState<TypeRoom>({});
  const { user } = useAuth();

  const getRoom = async () => {
    const res = await send_data("/api/rooms", {
      getRoom: { user_id: user._id },
    });
    if (res?._id) {
      setRoom(res);
    }
  };

  useEffect(() => {
    getRoom();
  }, []);

  useEffect(() => {
    // console.log(room);
  }, [room]);

  return (
    <>
      <Header setShowRoom={setShowRoom} />
      {showRoom ? (
        <>
          <RoomsList setShowRoom={setShowRoom} />
        </>
      ) : (
        <div className="main-panel">
          {room?._id ? (
            <div className="menu">
              <h1>Room {room.room}</h1>
              <button>Payment Logs</button>
              <button>Support</button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowRoom(true)}>Rent Room</button>
              <button>Inquiries</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
