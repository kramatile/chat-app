import {Session, SessionCallback, ErrorCallback, User} from "../model/common";
import {CustomError} from "../model/CustomError";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

const beamsClient = new PusherPushNotifications.Client({
        instanceId: import.meta.env.VITE_PUSHER_INSTANCE_ID||"",
});

    
export function loginUser(user: User, onResult: SessionCallback, onError: ErrorCallback) {
   
    fetch("/api/login",
        {
            method: "POST", // ou 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then(async (response) => {
            if (response.ok) {
                const session = await response.json() as Session;
                sessionStorage.setItem('token', session.token);
                sessionStorage.setItem('externalId', session.externalId);
                sessionStorage.setItem('username', session.username || "");
                sessionStorage.setItem("id",""+session.id);
                const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
                    url: `/api/beams`,
                    headers: {
                        Authentication: "Bearer " + session.token, // Headers your auth endpoint needs
                    },
                });

                beamsClient.start()
                    .then(() => beamsClient.addDeviceInterest('global'))
                    .then(() => beamsClient.setUserId(session.externalId, beamsTokenProvider))
                    .then(() => {
                        beamsClient.getDeviceId().then((deviceId: string) => console.log("Push id : " + deviceId));
                    })
                    .catch(console.error);
                onResult(session)
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        }, onError);
}


