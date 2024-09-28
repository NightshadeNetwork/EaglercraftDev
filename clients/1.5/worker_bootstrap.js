onmessage = function(o) {
	importScripts("/clients/1.5/classes_server.js");
	eaglercraftServerOpts = o.data;
	main();
};
