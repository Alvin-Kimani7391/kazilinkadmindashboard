import { getDataConnect } from "firebase/data-connect";
import app from "./firebase";
import { connectorConfig } from "./dataconnect-generated";

export const dataConnect = getDataConnect(app, connectorConfig);

// Commented out emulator connection to fetch real production data:
/*
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  connectDataConnectEmulator(
    dataConnect,
    "127.0.0.1",
    9399
  );
  console.log("Connected to Data Connect Emulator");
}
*/