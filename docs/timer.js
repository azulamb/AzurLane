let timer = 0;
onmessage = (event) => {
	const second = event.data.second;
	if (second) {
		// Start
		if (timer) {
			clearInterval(timer);
		}
		timer = setInterval(() => {
			postMessage(null);
		}, second * 1000);
	} else {
		// Stop
		if (timer) {
			clearInterval(timer);
		}
	}
};
