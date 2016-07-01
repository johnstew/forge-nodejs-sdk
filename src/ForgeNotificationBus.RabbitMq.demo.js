"use strict";

const ForgeNotificationBus = require("./ForgeNotificationBus.RabbitMq.js");

const bus = new ForgeNotificationBus({url:"amqp://guest:guest@localhost:5672"});

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
