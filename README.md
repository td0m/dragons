# Dragons

## TODO

- [ ] Script for disabling antivirus, downloading the backdoor exe file, executing it, enabling antivirus after making that one file an exception

## This repo contains:

- an implementation of the **server** for the dragons infrastructure, built with Go.
- an implementation of the **client** that allows the user to interface with the framework, built with React and Typescript.
- a Go-based, open-source implementation of the **target** service (background console applicaiton) used to demonstrate the abilities of dragons. It DOES NOT aim to support all the listed features / be stable as it IS NOT actively maintained. It's here for demonstration / testing purposes, and if you are looking for a FUD (Fully UnDetectable) implementaition, you'll have to write it yourself. If you do decide to implement one yourself, feel free to interface it with the already existing server, as long as you follow the API it will work flawlessly with any implementation.

## This repo is not:

- malware. The only purpose of this is to provide penetration testers with a well built core framework they can use.

## Actions

Here is a list of actions / request types that are supported by the client. As the server is just be a simple framework allowing clients and targets to communicate with each other, each one of those features only need to be implemented by the client and the target. The following table only shows whether the feature has been implemented on the client, the built-in Go-based target is not included in the following table.

| Implemented? | Type                      | Description                                                         |
| ------------ | ------------------------- | ------------------------------------------------------------------- |
| ✅           | **SCREENSHOT**            | Screenshot a screen                                                 |
| ⬜️          | **EXEC**                  | Shell session executes a (powershell) command                       |
| ✅           | **WEBCAM_SNAP**           | Snap a picture of the webcam                                        |
| ⬜️          | **NOTIFY**                | Display a notification to the user                                  |
| ⬜️          | **DUMP_CLIPBOARD_LOG**    | Dump the clipboard log                                              |
| ⬜️          | **DUMP_KEY_LOG**          | Dump key log                                                        |
| ⬜️          | **WRITE_CLIPBOARD_TEXT**  | Write string to clipboard                                           |
| ⬜️          | **WRITE_CLIPBOARD_IMAGE** | Send image to clipboard                                             |
| ⬜️          | **DUMP_WINDOW_LOG**       | Window logger                                                       |
| ⬜️          | **SET_VOLUME**            | Set audio volume                                                    |
| ⬜️          | **GET_VOLUME**            | Get audio volume                                                    |
| ⬜️          | **RECORD_AUDIO_START**    | Play audio                                                          |
| ⬜️          | **RECORD_AUDIO_END**      | Stop recording audio,save it in a file and upload it                |
| ⬜️          | **RECORD_AUDIO_DURATION** | Equivalent of RECORD_AUDIO_START, sleep x seconds, RECORD_AUDIO_END |
| ⬜️          | **PLAY_AUDIO_FILE**       | Play audio from target's local file                                 |
| ⬜️          | **PLAY_AUDIO**            | Send audio file and play it                                         |
| ⬜️          | **GET_DEVICE_INFO**       | Get device information (name, local ip)                             |
| ⬜️          | **LS**                    | List files and directories in a given directory                     |
| ⬜️          | **FILE**                  | Receive file from client/target                                     |
| ⬜️          | **REQUEST_FILE**          | Requests file at a given path to be uploaded to server              |

## Server API

The server uses the websocket protocol for handling its requests. You can imagine it as a bridge between the client and the server just with a few extra added utilities. I decided to go with websockets as it allows real time communication and allows the server to see when a device has disconnected.

```typescript
interface Clients {
  [id: string]: {
    socket: Websocket;
    target: string; // target id of the target client is connected to
  };
}
```

```typescript
interface Targets {
  [id: string]: {
    socket: Websocket;
    client: string; // client id of the client target is connected to
  };
}
```

## Requests

| Name                  | Payload Type | Description                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CONNECT_CLIENT**    | `None`       | Sent by the client in order to listen for targets connecting / disconnecting. Client gets a random generated id and used as a key when adding the `ws` instance to the client dictionary.                                                                                                                                                                                                                                                      |
| **CONNECT_TARGET**    | `None`       | Sent by the client in order to acknowledge its existence & inform the users. `TargetConnection.deviceInfo.name` is used as a key when adding the target's `ws` to the target dictionary. Will send **UPDATE_STATE** to all the clients.                                                                                                                                                                                                        |
| **CONNECT_TO_TARGET** | `string`     | Sent by a client to connect to a target. If successful, the client id will be sent to the target using **CONNECT_TO_TARGET** request action and client will receive **TARGET_CONNECTED**. The `target` id in the `Clients` dictionary will be set to that id and sets the `client` id in the `Targets` dictionary. If connection error occured, a **TARGET_DISCONNECTED** response will be sent and the `target` in `Clients` will be cleared. |  |

TODO: document rest of requests

### Flow

```
(T) -> (S) CONNECT_TARGET / DISCONNECT
        |
    ____|_____  UPDATE_STATE
   |    |    |
  (C)  (C)  (C)

(C) -> (S) CONNECT_CLIENT   -   (C) will now listen for and receive UPDATE_STATE events

(C) -> (S) CONNECT_TO_TARGET(targetID)    -    If possible, devices will be connected and all their events will be passed through to each other

(C/T) -> (S) DISCONNECT   -   clear the connections / associations that involve the (C/T). Delete that (C/T) from the map, we don't need to keep track of terminated communications.

(C) <-> (S) <-> (T)    -    ACTION,   action usually started by (C) will go to the server and be passed through to (T) and the response, if there is any, will go back to (S) and be passed through to (C).

```

### Types

```typescript
interface Action {
  type: string;
  payload: string;
}
```
