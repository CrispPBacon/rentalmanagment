import { IonIcon } from "@ionic/react";
import { add, arrowBack, person } from "ionicons/icons";
import "./RoomsList.css";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { send_data } from "../../utils/posts";

interface TypeRoom {
  room: number;
  _id: string;
  user: string;
  occupied: boolean;
}

interface RoomsProps {
  setShowRoom: (boolean: boolean) => void;
}
export default function RoomsList({ setShowRoom }: RoomsProps) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<TypeRoom[]>([]);

  async function getRooms() {
    const res = await send_data("/api/rooms", { getRooms: {} });
    if (res.length > 0) {
      if (!rooms.equals(res)) {
        console.log("HERE");
        setRooms(res);
      }
    } else {
      setRooms([]);
    }
  }

  async function addRoom() {
    if (!user.isAdmin) {
      return alert("You are not permitted to do the task!");
    }
    const res = await send_data("/api/rooms", { addRoom: {} });
    if (res?.success) {
      return getRooms();
    }
  }

  useEffect(() => {
    getRooms();
  }, []);
  useEffect(() => {
    getRooms();
  }, [addRoom]);

  const template = (
    <div className="container">
      <span className="back">
        <IonIcon icon={arrowBack} onClick={() => setShowRoom(false)} />
      </span>
      {rooms.length > 0
        ? rooms.map((object, index) =>
            !object.user ? (
              <Room getRooms={getRooms} room={object} key={index} />
            ) : user.isAdmin ? (
              <Room getRooms={getRooms} room={object} key={index} />
            ) : null
          )
        : null}
      {user.isAdmin ? (
        <div className="item add">
          <IonIcon
            icon={add}
            onClick={() => {
              addRoom();
            }}
          />
        </div>
      ) : null}
    </div>
  );

  return template;
}

interface Props {
  room: TypeRoom;
  getRooms: () => void;
}

function Room({ room, getRooms }: Props) {
  const { user } = useAuth();
  const [isAdmin, setAdmin] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setAdmin(user.isAdmin);
  }, [user]);

  useEffect(() => {
    if (room.user) {
      handleName(room.user);
    }
  }, [room.user]);

  const handleName = async (user_id: string) => {
    const res = await send_data("/api/users", { user: { _id: user_id } });
    if (res?._id) {
      setName(res.fullname);
    }
  };

  const delRoom = async () => {
    const res = await send_data("/api/rooms", { delRoom: { _id: room._id } });
    if (res) {
      // console.log(res);
      getRooms();
    }
  };

  const rentRoom = async () => {
    const res = await send_data("/api/rooms", {
      rentRoom: { room_id: room._id, user_id: user._id },
    });
    if (res._id) {
      console.log(res);
      getRooms();
      window.location.reload();
    }
  };

  const adminPanel = (
    <>
      <span className={`details ${name ? null : "pad-0"}`}>
        {name ? <IonIcon icon={person} /> : null}
        <h2>{name ? name.toTitleCase() : "Unoccupied"}</h2>
      </span>
      {name ? (
        <>
          <button>Profile</button>
          <button>Payment Logs</button>
          <button>Support</button>
        </>
      ) : null}
      <button
        style={{ backgroundColor: "rgb(225, 63, 63)" }}
        onClick={() => delRoom()}
      >
        Delete
      </button>
    </>
  );

  const clientPanel = (
    <>
      <span className="detail">
        <h2 style={{ color: "green" }}>Available</h2>
      </span>
      <button onClick={() => rentRoom()}>Rent Room</button>
      <button>Schedule For Viewing</button>
    </>
  );

  return (
    <div className="item">
      <h1>
        {isAdmin ? `Room ${room.room}` : room.user ? null : `Room ${room.room}`}
      </h1>

      <span className="head">
        <img
          src="images/city-apartment-building-59846.jpg"
          alt="city-apartment-building"
        />
      </span>
      {isAdmin ? adminPanel : clientPanel}
    </div>
  );
}
