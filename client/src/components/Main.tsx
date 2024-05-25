import { useEffect, useRef, useState } from "react";
import Header from "./main/Header";
// import { Navigate } from "react-router-dom";
import RoomsList from "./main/RoomsList";
import { send_data } from "../utils/posts";
import { useAuth } from "../context/AuthContext";
import { IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";

interface TypeRoom {
  room: number;
  _id: string;
  user: string;
  occupied: boolean;
  date_started: string;
  date_due: string;
}

export default function Main() {
  const { user } = useAuth();
  const [showRoom, setShowRoom] = useState(user.isAdmin ? true : false);
  const [room, setRoom] = useState<TypeRoom>();
  const [showPopUp, setPopUp] = useState(false);
  const [screenName, setScreen] = useState("");

  const writeBoxRef = useRef(null);

  const getRoom = async () => {
    const res = await send_data("/api/rooms", {
      getRoom: { user_id: user._id },
    });
    if (res?._id) {
      setRoom(res);
    }
  };

  const handleWriteBox = () => {
    // @ts-ignore
    const text = writeBoxRef.current.innerText;
  };

  const onSend = async () => {
    // @ts-ignore
    const text = writeBoxRef.current.innerText;
    if (!text) {
      alert("Please enter your message!");
      return;
    }

    const res = await send_data("/api/rooms", {
      sendMessage: { message: text, user_id: user._id, room_id: room?._id },
    });
    console.log(res);
    // @ts-ignore
    writeBoxRef.current.innerText = "";
    alert("Message sent!");
  };

  const handleKeyDown = (event: any) => {
    // @ts-ignore
    if (event.keyCode === 13 && event.shiftKey) {
      event.preventDefault();
      document.execCommand("insertHTML", false, "<br><br>");
      return;
    }
    if (event.keyCode === 13) {
      event.preventDefault();
      // @ts-ignore
      const text = writeBoxRef.current.innerText;
      if (text) {
        onSend();
      }
      // @ts-ignore
      return;
    }
  };

  useEffect(() => {
    getRoom();
  }, []);

  useEffect(() => {
    console.log(room);
  }, [room]);

  const details = (
    <>
      <span className="profile">
        <h3>
          <span style={{ color: "rgb(92, 92, 193)" }}>Tenant: </span>
          {user.fullname.toTitleCase()}
        </h3>
      </span>
      <span className="profile">
        <h4>
          <span style={{ color: "rgb(92, 92, 193)" }}>Started</span>:{" "}
          {room?.date_started}
        </h4>
      </span>
      <span className="profile">
        <h4>
          <span style={{ color: "rgb(92, 92, 193)" }}>Next Bill:</span>{" "}
          {room?.date_due}
        </h4>
      </span>
    </>
  );

  const support = (
    <>
      <span className="writeBox">
        <div
          id="writeBox"
          contentEditable
          ref={writeBoxRef}
          onInput={handleWriteBox}
          onKeyDown={handleKeyDown}
          data-placeholder="Enter your concern here..."
        />
      </span>
      <button onClick={() => onSend()} style={{ padding: "1rem" }}>
        Send
      </button>
    </>
  );

  const payment_logs = (
    <>
      <span className="profile">
        <h4>No payment record</h4>
      </span>
    </>
  );

  const popUp = (
    <div className="popup">
      <span className="head">
        <h1>
          {screenName == "details"
            ? "Details"
            : screenName == "support"
            ? "Support"
            : "Payment Logs"}
        </h1>
      </span>
      <IonIcon
        icon={add}
        onClick={() => {
          setPopUp(false);
          setScreen("");
        }}
      />
      {screenName == "details" ? details : null}
      {screenName == "support" ? support : null}
      {screenName == "payment_logs" ? payment_logs : null}
    </div>
  );

  const userPanel = (
    <>
      {room?._id ? (
        <div className="menu">
          <h1>Room {room.room}</h1>
          <button
            onClick={() => {
              setPopUp(true);
              setScreen("payment_logs");
            }}
          >
            Payment Logs
          </button>
          <button
            onClick={() => {
              setPopUp(true);
              setScreen("support");
            }}
          >
            Support
          </button>
          <button
            onClick={() => {
              setPopUp(true);
              setScreen("details");
            }}
          >
            Details
          </button>
        </div>
      ) : (
        <>
          <button onClick={() => setShowRoom(true)}>
            {user.isAdmin ? "Manage Rooms" : "Rent Room"}
          </button>
          {user.isAdmin ? null : <button>Inquiries</button>}
        </>
      )}
    </>
  );

  return (
    <>
      <Header setShowRoom={setShowRoom} />
      {showRoom ? (
        <>
          <RoomsList setShowRoom={setShowRoom} />
        </>
      ) : (
        <div className="main-panel">{userPanel}</div>
      )}
      {showPopUp ? popUp : null}
    </>
  );
}
