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
  date_started: string;
  date_due: string;
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
  const [showViewPanel, setViewPanel] = useState(false);
  const [view, setView] = useState("");
  const [dateDue, setDateDue] = useState<Date>();
  const [dateStarted, setDateStarted] = useState<Date>();
  const [started, setStarted] = useState("");
  const [nextBill, setNext] = useState("");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    setAdmin(user.isAdmin);
  }, [user]);

  useEffect(() => {
    if (room.user) {
      handleName(room.user);
      setDateDue(new Date(room.date_due));
      setDateStarted(new Date(room.date_due));
    }
  }, [room.user]);

  useEffect(() => {
    if (dateStarted && dateDue) {
      setStarted(
        `${
          monthNames[dateStarted.getMonth() - 1]
        } ${dateStarted.getDate()}, ${dateStarted.getFullYear()}`
      );
      setNext(
        `${
          monthNames[dateDue.getMonth()]
        } ${dateDue.getDate()}, ${dateDue.getFullYear()}`
      );
    }
  }, [dateDue]);

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
          <button
            onClick={() => {
              setViewPanel(true);
              setView("Profile");
            }}
          >
            Profile
          </button>
          <button
            onClick={() => {
              setViewPanel(true);
              setView("Payment Logs");
            }}
          >
            Payment Logs
          </button>
          <button
            onClick={() => {
              setViewPanel(true);
              setView("Concerns");
            }}
          >
            View Concerns
          </button>
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

  const Profile = (
    <>
      <h4 style={{ padding: "1rem" }}>
        Full Name:{" "}
        <span style={{ background: "black", color: "white", padding: ".5rem" }}>
          {name.toTitleCase()}
        </span>
      </h4>
      <h4 style={{ padding: "1rem" }}>
        Date Started:{" "}
        <span style={{ background: "black", color: "white", padding: ".5rem" }}>
          {started}
        </span>
      </h4>
      <h4 style={{ padding: "1rem" }}>
        Next Bill:
        <span style={{ background: "black", color: "white", padding: ".5rem" }}>
          {nextBill}
        </span>{" "}
      </h4>
    </>
  );

  const Support = <>No Concerns</>;

  const PaymentLogs = <h4>No Payment Record</h4>;

  const viewPanel = (
    <>
      <IonIcon
        icon={add}
        style={{
          transform: "rotate(45deg)",
          fontSize: "2rem",
        }}
        onClick={() => setViewPanel(false)}
      />
      <h2 style={{ color: "black", margin: "1rem 0" }}>{view}</h2>
      {view == "Profile"
        ? Profile
        : view === "Payment Logs"
        ? PaymentLogs
        : Support}
    </>
  );

  return (
    <div className="item">
      {!showViewPanel ? (
        <>
          <h1>
            {isAdmin
              ? `Room ${room.room}`
              : room.user
              ? null
              : `Room ${room.room}`}
          </h1>

          <span className="head">
            <img
              src="images/city-apartment-building-59846.jpg"
              alt="city-apartment-building"
            />
          </span>
        </>
      ) : (
        viewPanel
      )}

      {showViewPanel ? null : isAdmin ? adminPanel : clientPanel}
    </div>
  );
}
