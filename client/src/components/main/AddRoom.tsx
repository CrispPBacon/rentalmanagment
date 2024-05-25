import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

// @ts-ignore
interface AddRoomType {
  back: (boolean: boolean) => void;
}
export default function AddRoom({ back }: AddRoomType) {
  return (
    <>
      <span className="back" style={{ left: "0", top: "5rem" }}>
        <IonIcon icon={arrowBack} onClick={() => back(false)} />
      </span>
      <div>AddRoom</div>
    </>
  );
}
