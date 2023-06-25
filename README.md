# Render your unity webgl apps in next.js projects


## System Requirements:

- [Node.js 16.8](https://nodejs.org) or later.
- macOS, Windows (including WSL), and Linux are supported.


## Getting Started

In your terminal/git-bash run the following commands
1. In a new directory create a new nextJS project
```bash
npx create-next-app@latest
```

2. Install webgl-nextjs package to your project
```bash
npm i webgl-nextjs
```

3. Create a new ```pages``` directory in your next project -if it wasn't generated-, create a new file at ./pages/test.js and copy and paste the following code.

```javascript
//filename: /pages/test.js
import { WebGL } from 'webgl-nextjs'
import React, { useRef } from 'react';

export default function TestMePage() {
  const webGLRef = useRef(null);
  
  var buildUrl = "https://storage.googleapis.com/multisync/multisync/app-builds"; //replace with your CDN
  let config = {
    dataUrl: buildUrl + "/webgl-test-js.data",//replace with your build file name
    frameworkUrl: buildUrl + "/webgl-test-js.framework.js",//replace with your build file name
    codeUrl: buildUrl + "/webgl-test-js.wasm",//replace with your build file name
    loaderUrl: buildUrl + "/webgl-test-js.loader.js",//replace with your build file name
  };

  return (
      <WebGL
        ref={webGLRef}
        config={config}
        onLoaded={()=>console.log('webgl loaded')}
        onMessage={()=>console.log('msg received')}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      />
  )
}
```
4. You should see this in your browser under http://localhost:3000/test 
<img width="1496" alt="Screenshot 2023-06-24 at 9 13 28 PM" src="https://github.com/Multi-Sync/webgl-nextjs/assets/24863504/b9e56879-06dc-492d-800a-3ba948780d68">

🥳 You just added WebGL game/app to the next project 🥳

## Usage
```javascript
  <WebGL
    ref={webGLRef} //reference used to send messages to Unity WebGL app
    config={config} //config unity loader config
    onLoaded={onLoaded}//onLoaded callback function to be called when unity application is loaded
    onMessage={onMessage}//onMessage callback function to be called when unity application sends a message to JS layer
    style={{ width: '100%', height: '100%', position: 'relative' }}//add your style
    />
```
#### Rendering
 - In UnityEditor, In your Build Settings Set your target platform to WebGL.
 - Once the project is built locate the following directory ```Build```, your should have 4 files
    - ~.wasm.
    - ~.data.
    - ~.framework.
    - ~.loader.

- Host these 4 files remotely or locally and save their absolute addresses to be used in the config.
```javascript
  let config = {
    dataUrl: "",//replace with your build file name
    frameworkUrl: "",//replace with your build file name
    codeUrl: "",//replace with your build file name
    streamingAssetsUrl: "StreamingAssets",//replace with StreamingAssets path
    loaderUrl: "",//replace with your build file name
  };
```


#### Loading
- To run any code after the unity webgl app is loaded, utilize the `onLoaded` callback, it gets triggered once the application is loaded.
```javascript
   const onLoaded = () => {
    console.log(`Loaded`);
  };
```
#### Messaging between JS and Unity
- In your Unity project, create Plugins folders ```(Assets/Plugins)``` and add protocol.jslib.


#####  Assets/Plugins/protocol.jslib 

```javascript
mergeInto(LibraryManager.library, {
    SendMessageToJS: function(messageType, messageContent) {
        // This method can be called from Unity to send messages to JS.

        // Convert pointer to string.
        var messageTypeStr = Pointer_stringify(messageType);
        var messageContentStr = Pointer_stringify(messageContent);

        // Forward the message to your nextjs app or handle it here.
        console.log(`Received message of type ${messageTypeStr}: ${messageContentStr}`);
    },
    SendMessageToUnity: function(messageType, messageContent) {
        // This method can be called from JS to send messages to Unity.
        // You'll need to implement a corresponding method in your Unity C# script.
        SendMessage('HandleJSMessages', 'ReceiveMessage', `${messageType}\n${messageContent}`);
    }
});

```

##### Receiving and Sending messages from Unity to NextJS
- In your Unity Project, create a game object called  `HandleJSMessages` and  the following script to `HandleJSMessages` gameobject.

```csharp

using System.Runtime.InteropServices;
using UnityEngine;

public class HandleJSMessages : MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("HandleJSMessages Activated");//look for this message in the browser to ensure its working, delete before production
        DontDestroyOnLoad(this);
    }

    [DllImport("__Internal")]
    private static extern void SendMessageToJS(string messageType, string messageContent);

    /// <summary>
    /// Sends a message from Unity WebGL build to the nextjs app that has webgl-nextjs package
    /// </summary>
    /// <param name="type">any type you want</param>
    /// <param name="content">the content for the message</param>
    public void SendToJS(string type, string content)
    {
        SendMessageToJS(type, content);
    }

    /// <summary>
    /// Receive message from the nextjs app that has webgl-nextjs package
    /// </summary>
    /// <param name="message"></param>
    public void ReceiveMessage(string message)
    {
        Debug.Log("Received message");
        var parts = message.Split('\n');//type\ncontent
        var type = parts[0];
        var content = parts[1];

        // Handle the message here. This will be called from JS.
        Debug.Log($"Received message of type {type}: {content}");//look for this message in the browser to ensure its working, delete before production

        //Some Logic ...
    }
}


```

##### Receiving and Sending messages from NextJS to Unity 
- To Send a message from NextJS to Unity, utilize the reference to the WebGL component.
    ```webGLRef.current.sendMessage('MyMessageType', 'Hello, Unity!');// customize the type and the content of the message```
- Upon receiving a message from Unity Webgl, you can utilize the onMessage listener
```javascript
  const onMessage = (type, content) => {
    console.log(`Received message of type ${type}: ${content}`);// you should see in chrome console
    switch(type)
      {
          //logic based on the type
      }
  };
```


## Full Example 
```javascript
//This file is created in a nextjs projet under /pages/testme.js
//Used for testing it should render your unity webgl app

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

  var buildUrl = "https://storage.googleapis.com/multisync/multisync/app-builds"; //replace with your CDN
  let config = {
    dataUrl: buildUrl + "/webgl-test-js.data",//replace with your build file name
    frameworkUrl: buildUrl + "/webgl-test-js.framework.js",//replace with your build file name
    codeUrl: buildUrl + "/webgl-test-js.wasm",//replace with your build file name
    streamingAssetsUrl: "StreamingAssets",//replace with StreamingAssets path
    loaderUrl: buildUrl + "/webgl-test-js.loader.js",//replace with your build file name
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

