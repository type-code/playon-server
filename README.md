# Playon Server

The server is written on the NodeJS engine in the Javascipt language.

The connection to the server takes place using the multi-platform library **Socket.io**, which was built on the **WebSocket** technology.

## How to start connection on client:
After client success connect to server socket, he must send [join](#event-join-to-server) event to server with him userdata. If server success compute this request, and connect user to room, he emit [joined](#event-joined-from-server) with room & video data. After that, the server and the client can communicate with any other events.


## Server-side eventlist:
- [Join](#event-join-from-server) - Any user connect to server
- [Joined](#event-joined-from-server) - User connected to socket and send his data
- [Disc](#event-disc-from-server) - Any user disconnect from server
- [Sync](#event-sync-from-server) - Server synchronize event
- [Play](#event-play-from-server) - Any user play video
- [Pause](#event-pause-from-server) - Any user pause video
- [Load](#event-load-from-server) - Any user load new video link
- [Rewind](#event-rewind-from-server) - Any user rewind video to new time
- [Message](#event-message-from-server) - Any user send chat message
- [Light](#event-light-from-server) - Any user change light on player
- [Click](#event-click-from-server) - Any user click on video
- [Error Message](#event-error_message-from-server) - Emit on any error from server-side


## Client-side eventlist:
- [Join](#event-join-to-server) - User join to player
- [Play](#event-play-to-server) - User play video
- [Pause](#event-pause-to-server) - User pause video
- [Load](#event-load-to-server) - User load new video link
- [Rewind](#event-rewind-to-server) - User rewind current video to new time
- [Message](#event-message-to-server) - User send chat message
- [Light](#event-light-to-server) - User change light on player
- [Click](#event-click-to-server) - User click on video

# <br><br>Events from server:

All data from server receive on **JSON-Object** format, not **JSON-String**.

## <br>Event ``join`` from server
Receive from the server if new user connected to player room.

#### Response data:

```javascript
{
	nick: "NICKNAME",
}
```

## <br>Event ``joined`` from server
Receive from the server if current user success joined to room and server.

#### Response data:

```javascript
{
	video: "VIDEO_ID",
	time: 123,
	play: true,
	light: false
}
```

**video** - Video ID (Example: `YVcroDDi24s`)
**time** - is Integer value of video current time play in **seconds**<br>
**play** - is Boolean value of video playing status<br>
**light** - is Boolean value of player light on (true) or off (false)

## <br>Event ``disc`` from server
Receive from the server on user disconnect from room or server.

#### Response data:

```javascript
{
	nick: "NICKNAME",
}
```

## <br>Event ``sync`` from server
Receive from the server info about video play, every 2 min.

#### Response data:

```javascript
{
	video: "VIDEO_ID",
	time: 123
}
```

## <br>Event ``play`` from server
Receive from the server if any user press play.

#### Response data:

```javascript
{
	video: "VIDEO_ID",
	time: 123,
	nick: "NICK_WHO_PRESS_PLAY"
}
```

## <br>Event ``pause`` from server
Receive from the server if any user press pause.

#### Response data:

```javascript
{
	time: 123,
	nick: "NICK_WHO_PRESS_PAUSE"
}
```

## <br>Event ``load`` from server
Receive from the server if server change video.

#### Response data:

```javascript
{
	video: "VIDEO_ID",
	nick: "NICK_WHO_PRESS_PAUSE"
}
```

## <br>Event ``rewind`` from server
Receive from the server if any user rewind video.

#### Response data:

```javascript
{
	time: 123,
	nick: "NICK_WHO_REWIND_VIDEO"
}
```

## <br>Event ``message`` from server
Receive from the server new message from users.

#### Response data:

```javascript
{
	nick: "NICKNAME",
	text: "MESSAGE_TEXT",
	color: "#HEX"
}
```

## <br>Event ``light`` from server
Receive from the server, if any user click change light button.

#### Receive data: 
```javascript
{
	light: true
}
```

**light** - is Boolean value of player light on (true) or off (false)
- true - white mode of player.
- false - dark mode of player.

## <br>Event ``click`` from server
Receive from the server, if any user click on video.

#### Receive data: 
```javascript
{
	x: 123,
	y: 123,
	color: "#HEX"
}
```

**x** and **y** - is percent value (0 - 100)<br>
**color** - user main color and mark color

## <br>Event ``error_message`` from server
Receive from the server, on any server-side error.

#### Receive data: 
```javascript
{
	type: "TYPE_ERROR",
	message: "MESSAGE_ERROR"
}
```


<br><br><br><br>


# Events to server:

All data to server need send on **JSON-Object** format, not **JSON-String**.

## <br>Event ``join`` to server
Send to the server with a successful connection to it (After init socket and on event `connect`).

#### Input data:

```javascript
{
	nick: "NICKNAME",
	room: "ROOMNAME"
}
```

If server successfully compute you data he emit back ["joined" event](#event-joined-from-server), else server emit to you ["error_message" event](#event-error_message-from-server)<br>
If server receive this event, he emit ["join" event](#event-join-from-server) to all users

## <br>Event ``play`` to server
Send to the server what user click play video button.

#### Input data: `empty`
If server receive this event, he emit ["play" event](#event-play-from-server) to all users

## <br>Event ``pause`` to server
Send to the server what user click pause video button.

#### Input data: `empty`
If server receive this event, he emit ["pause" event](#event-pause-from-server) to all users

## <br>Event ``load`` to server
Send to the server new video link.

#### Input data:

```javascript
{
	link: "LINK_TO_YOUTUBE_VIDEO",
	playlist: false
}
```
The **playlist** property takes two values, true and false. <br>
- True - indicates that the video is selected from a playlist.  <br>
- False - indicates that the video is loaded from an external link

If server receive this event, he emit ["load" event](#event-load-from-server) to all users

## <br>Event ``rewind`` to server
Send to the server time in seconds to rewind video.

#### Input data:

```javascript
{
	time: 123
}
```

If server receive this event, he emit ["rewind" event](#event-rewind-from-server) to all users

## <br>Event ``message`` to server
Send new message to the server.

#### Input data:

```javascript
{
	text: "MESSAGE_TEXT",
	color: "#HEX"
}
```

Message text can not exceed **150 characters**<br>
If server receive this event, he emit ["message" event](#event-message-from-server) to all users

## <br>Event ``light`` to server
Send to server if user want change light.

#### Input data: `empty`
If server receive this event, he emit ["light" event](#event-light-from-server) to all users

## <br>Event ``click`` to server
Send to the server, if user click on video.

#### Input data: 
```javascript
{
	x: 123,
	y: 123,
	color: "#HEX"
}
```

**x** and **y** - is percent value (0 - 100)<br>
**color** - user main color and mark color<br>
If server receive this event, he emit ["click" event](#event-click-from-server) to all users