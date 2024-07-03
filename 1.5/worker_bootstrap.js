onmessage = function(o) {
	importScripts("/1.5/classes_server.js");
	eaglercraftServerOpts = o.data;
	main();
};
