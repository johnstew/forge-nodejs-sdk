var azure = require("azure");

const URL = "Endpoint=sb://test-davide-forge.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=hSePQJmEL+y2V0XcH0utFj66Gv3JPw/m3gTIY8zawPM=";
var serviceBusService = azure.createServiceBusService(URL);

function checkMessages(){
	serviceBusService.receiveSubscriptionMessage("forgenotifications", "AllMessages", function(error, receivedMessage){
		if(!error){
			// Message received and deleted
			console.log(receivedMessage);
		}
		else {
			console.log(error, receivedMessage);
		}

		checkMessages();
	});
}

serviceBusService.createSubscription("forgenotifications","AllMessages",function(error){
	if (!error){
		// subscription created
		checkMessages();
	}
	else {
		console.log(error);
	}
});
