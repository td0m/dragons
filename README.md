# NOTE TO SELF (AFTER EXAMS)
The already existing implementation ISNT following the spec below, the spec is also not fully finalised so feel free to make changes. You need to reimplement all the modules, look at the mock ups on samsung notes.

# Dragons
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
| ⬜️          | **SCREENSHOT**            | Screenshot a screen                                                 |
| ⬜️          | **EXEC**                  | Shell session executes a (powershell) command                       |
| ⬜️          | **WEBCAM_SNAP**           | Snap a picture of the webcam                                        |
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
| ⬜️          | **DOWNLOAD**              | Receive file from client                                            |
| ⬜️          | **UPLOAD**                | Requests file at a given path to be uploaded to server              |

## Server API
The server uses the websocket protocol for handling its requests. You can imagine it as a bridge between the client and the server just with a few extra added utilities. I decided to go with websockets as it allows real time communication and allows the server to see when a device has disconnected.

```typescript
interface Clients {
 [id: string]: {
   ws: Websocket,
   target: string, // target id of the target client is connected to
 }
}
```

```typescript
interface Targets {
 [id: string]: {
   ws: Websocket,
   client: string, // client id of the client target is connected to
 }
}
```

## Requests
|Name|Payload Type|Description|
|----|------------|-----------|
|**CONNECT_CLIENT**|`None`|Sent by the client in order to listen for targets connecting / disconnecting. Client gets a random generated id and used as a key when adding the `ws` instance to the client dictionary.|
|**CONNECT_TARGET**|`TargetInfo`|Sent by the client in order to acknowledge its existence & inform the users. `TargetConnection.deviceInfo.name` is used as a key when adding the target's `ws` to the target dictionary. Will send **UPDATE_TARGETS** to all the clients. |
|**CONNECT_TO_TARGET**|`string`|Sent by a client to connect to a target. If successful, the client id will be sent to the target using **CONNECT_TO_TARGET** request action and client will receive **TARGET_CONNECTED**. The `target` id in the `Clients` dictionary will be set to that id and sets the `client` id in the `Targets` dictionary. If connection error occured, a **TARGET_DISCONNECTED** response will be sent and the `target` in `Clients` will be cleared.|
|**CONNECT_TO_TARGET**|`ApprovedTargetConnection`|Server will send the id of the client connected to the target for it to store it in a variable and use it to send its responses|
|**TARGET_CONNECTED**|`string`|Sends the id of the target that the client successfully connected to|
|**TARGET_DISCONNECTED**|`None`|Tells the client that the target has been disconnected or client has been disconnected from the target|
|**{{ACTION}}**|`Action`|Sent by a client to a target or by a target to a client. Server simply passes through the message.|
|**UPDATE_TARGETS**|`TargetInfo[]`|Sends an array of targets|
### Types
```typescript
interface TargetInfo {
  actions: string[]; // list of actions supported by the client
  deviceInfo: {
    name: string;
    localIp: string;
  };
}
```
```typescript
interface Action {
  type: string;
  payload: string;
}
```
