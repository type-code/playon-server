# Playon Server

The server is written on the NodeJS engine in the Javascipt language.

The connection to the server takes place using the multi-platform library **Socket.io**, which was built on the **WebSocket** technology.

## Client-side eventlist:
- [Join](#event-join-to-server) - User join to player
- [Play](#event-play-to-server) - User play video
- [Pause](#event-pause-to-server) - User pause video
- [Load](#event-load-to-server) - User load new video link
- [Rewind](#event-rewind-to-server) - User rewind current video to new time
- [Message](#event-message-to-server) - User send chat message
- [Light](#event-light-to-server) - User change light on player

# <br><br>Events from server:

All data from server receive on **JSON-Object** format, not **JSON-String**.

## <br>Event ``connect`` from server
Receive from the server with a successful connection to it.

#### Response data:

```javascript
{
	video: "VIDEO_ID",
	time: 123,
	play: true,
	light: false
}
```

**Time** - is Integer value of video current time play in **seconds**<br>
**Play** - is Boolean value of video playing status<br>
**Light** - is Boolean value of player light on (true) or off (false)

## <br>Event ``join`` from server
Receive from the server if new user connected to player.

#### Response data:

```javascript
{
	nick: "NICKNAME",
}
```

## <br>Event ``disc`` from server
Receive from the server on user disconnect.

#### Response data:

```javascript
{
	nick: "NICKNAME",
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
	time: 512,
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
	second: 123,
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

**Light** - is Boolean value of player light on (true) or off (false)
- True - white mode of player.
- False - dark mode of player.


<br><br><br><br>


# Events to server:

All data to server need send on **JSON-Object** format, not **JSON-String**.

## <br>Event ``join`` to server
Send to the server with a successful connection to it.

#### Input data:

```javascript
{
	nick: "NICKNAME"
}
```

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
	second: 123
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
