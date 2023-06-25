# Render your unity webgl apps in next.js projects

## Installation

```bash
npm i webgl-nextjs
```

## Usage

```javascript
import { WebGL } from 'webgl-nextjs'
import React, { useRef } from 'react';

export default function TestMePage() {
  const webGLRef = useRef(null);

  const onMessage = (type, content) => {
    console.log(`Received message of type ${type}: ${content}`);// you should see in chrome console
  };
  const onLoaded = () => {
    webGLRef.current.sendMessage('MyMessageType', 'Hello, Unity!');// you should see in chrome console
    console.log(`Loaded`);
  };

  var gcpUrl = "https://storage.googleapis.com/multisync/multisync/app-builds";
  let buildUrl = gcpUrl;
  let config = {
    id: "unity-webgl-canvas",
    dataUrl: buildUrl + "/webgl-test-js.data",
    frameworkUrl: buildUrl + "/webgl-test-js.framework.js",
    codeUrl: buildUrl + "/webgl-test-js.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "multisync",
    productName: "interworky",
    productVersion: "2.1",
    showBanner: false,
    loaderUrl: buildUrl + "/webgl-test-js.loader.js",
  };

  return (
    <>
      <WebGL
        ref={webGLRef}
        config={config}
        onLoaded={onLoaded}
        onMessage={onMessage}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      />
    </>
  )
};
```

