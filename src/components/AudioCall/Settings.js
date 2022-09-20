import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import {AGORA} from "../../constants/index"

export const config = { mode: "rtc", codec: "vp8", appId: AGORA.API_ID, token: AGORA.TEMP };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = AGORA.NAME;
