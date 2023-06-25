import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const WebGL = ({ config, onLoaded, onMessage, style }, ref) => {
  const unityContainerRef = useRef(null);
  let unityInstance = null;

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = config.id;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    unityContainerRef.current.appendChild(canvas);


    const script = document.createElement("script");
    script.src = config.loaderUrl;
    script.onload = () => {
      createUnityInstance(canvas, config, (progress) => {
        if (progress === 1) {
          // Trigger the callback prop once the application is loaded.
          onLoaded();
        }
      })
        .then((instance) => {
          // unityInstance.SetFullscreen(1); //for full screen option
          // sendDataToUnity(unityInstance);
          unityInstance = instance;
        })
        .catch((message) => {
          alert(message);
        });
    };

    document.body.appendChild(script);
    const currentRef = unityContainerRef.current;

    if (window !== undefined) {
      window.SendMessageToJS = (type, content) => {
        onMessage(type, content);
      };
    }
    return () => {
      document.body.removeChild(script);
      currentRef.removeChild(canvas);
    };
  }, [config, onLoaded]); // Include 'onLoaded' in the dependency array
  useImperativeHandle(ref, () => ({
    sendMessage: (type, content) => {
      // Use unityInstance to send a message to Unity
      if (unityInstance) {
        unityInstance.SendMessage('HandleJSMessages', 'ReceiveMessage', `${type}\n${content}`);
      }
    },
  }));


  return (
    <div ref={unityContainerRef} style={style}>
    </div >
  );
};

export default forwardRef(WebGL);
