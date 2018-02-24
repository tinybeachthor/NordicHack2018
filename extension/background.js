const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");

const options = {
  cellSize: 4,    // length of cell in px
  blockSize: 2,   // length of block in number of cells
  blockStride: 1, // number of cells to slide block window by (block overlap)
  bins: 6,        // bins per histogram
  norm: 'L2'      // block normalization method
}

chrome.webRequest.onCompleted.addListener(
  function(info) {
    var img = new Image();
		img.onload = function() {
			//resize canvas to the new image
			canvas.width  = img.width;
			canvas.height = img.height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0);

			let descriptor = hog.extractHOG(canvas, options);

			let descStr = 0;
			for (let i = descriptor.length - 1; i >= 0; i--) {
				descStr += descriptor[i];
			}

			const hash = sha256(descStr.toString());

			console.log("Descriptor: ", hash);

			sendHashToServer(hash, info.url)
				.then(isValid => {
					if(!isValid) {
						showWasBlocked(info.url);
					}
				});
		};
		img.src = info.url;
  },
  // filters
  {
    urls: ["<all_urls>"],
    types: ["image"]
  }
);

function showWasBlocked(url) {
	//send local notification
 	var options = {
	  type: "basic",
	  title: "Stolen image detected!",
	  message: url,
	  iconUrl: "icon.png"
	}
 	chrome.notifications.create(options);
}

const serverAddress = "https://permapic-196223.appspot.com";
function sendHashToServer(hash, url) {
	return fetch(serverAddress, {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json'
	  },
	  body: JSON.stringify({
	    hash: hash,
	    url: url
	  })
	})
	.then(response => response.json())
	.then(json => json.validURL);
}
