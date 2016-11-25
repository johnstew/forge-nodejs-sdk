var azure = require("azure");

const AMQPClient = require("amqp10").Client;
const Policy = require("amqp10").Policy;

const topicName = "forgenotifications";
const subscriptionName = "AllMessages";

const URL = "Endpoint=sb://test-davide-forge.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=hSePQJmEL+y2V0XcH0utFj66Gv3JPw/m3gTIY8zawPM=";

const hostNameRegEx = /sb\:\/\/(.*?)\;/;
const sasNameRegEx = /SharedAccessKeyName=(.*?)(\;|$)/;
const sasKeyRegEx = /SharedAccessKey=(.*?)(\;|$)/;

const sasName = URL.match(sasNameRegEx)[1];
const sasKey = URL.match(sasKeyRegEx)[1];
const serviceBusHost = URL.match(hostNameRegEx)[1];
var amqpUrl = `amqps://${encodeURIComponent(sasName)}:${encodeURIComponent(sasKey)}@${serviceBusHost}`;
console.log(amqpUrl);

function connectAmqp(){
	var client = new AMQPClient(Policy.ServiceBusTopic);

	return client.connect(amqpUrl)
	.then(() => {
		return client.createReceiver(`${topicName}/Subscriptions/${subscriptionName}`);
	});
}

var serviceBusService = azure.createServiceBusService(URL);
serviceBusService.createSubscription(topicName, subscriptionName,function(error){
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

	connectAmqp()
	.then((receiver) => {
		console.log("connected...");
		receiver.on("message", function(message) {
			console.log("received: ", message);
		});
	});
});
