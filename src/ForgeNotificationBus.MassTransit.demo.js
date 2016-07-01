"use strict";

const ForgeNotificationBus = require("./ForgeNotificationBus.MassTransit.js");

const bus = new ForgeNotificationBus({url:"amqp://localhost:5672"});

bus.startReceiving()
.then(() =>{
	bus.on("CommandSuccessNotification", (msg) => console.log(msg));
})
.then(null, console.warn);

bus.waitOnce((name) => {
	return (name === "SitePageAddedNotification");
})
.then((body) => {
	console.log("Site page added: ", body);
});
