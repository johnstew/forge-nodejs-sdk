var azure = require("azure");

const URL = "Endpoint=sb://test-davide-forge.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=hSePQJmEL+y2V0XcH0utFj66Gv3JPw/m3gTIY8zawPM=";
var serviceBusService = azure.createServiceBusService(URL);

var count = 0;
function checkMessages(){
	serviceBusService.receiveSubscriptionMessage("testNotifications", "AllMessages", function(error, receivedMessage){
		if(!error){
			// Message received and deleted
			count++;
			console.log(count, receivedMessage);
		}
		else {
			console.log(error, receivedMessage);
		}

		checkMessages();
	});
}

serviceBusService.createSubscription("testNotifications","AllMessages",function(error){
	if (!error){
		// subscription created
	}
	else if (error.statusCode == 409) {
		// subscription already exists
	}
	else {
		console.log(error);
		return;
	}

	checkMessages();
});
