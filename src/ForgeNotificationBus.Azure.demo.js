"use strict";

const ForgeNotificationBus = require("./ForgeNotificationBus.Azure.js");

const bus = new ForgeNotificationBus({url:"Endpoint=sb://webplu-forge.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=Z6vCTjK0LBYVNqwGnglrM30pcWFuf7SNwdcwV4cpjX8="});

bus.startReceiving()
.then(() =>{
	bus.on("CommandSuccessNotification", (msg) => console.log(msg));
})
.then(null, console.warn);

bus.waitOnce((name) => {
	return (name == "SitePageAddedNotification");
})
.then((body) => {
	console.log("Site page added: ", body);
});
