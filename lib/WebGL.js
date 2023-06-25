"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var WebGL = function WebGL(_ref, ref) {
  var config = _ref.config,
    onLoaded = _ref.onLoaded,
    onMessage = _ref.onMessage,
    style = _ref.style;
  var unityContainerRef = (0, _react.useRef)(null);
  var unityInstance = null;
  (0, _react.useEffect)(function () {
    var canvas = document.createElement("canvas");
    canvas.id = config.id;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    unityContainerRef.current.appendChild(canvas);
    var script = document.createElement("script");
    script.src = config.loaderUrl;
    script.onload = function () {
      createUnityInstance(canvas, config, function (progress) {
        if (progress === 1) {
          // Trigger the callback prop once the application is loaded.
          onLoaded();
        }
      }).then(function (instance) {
        // unityInstance.SetFullscreen(1); //for full screen option
        // sendDataToUnity(unityInstance);
        unityInstance = instance;
      })["catch"](function (message) {
        alert(message);
      });
    };
    document.body.appendChild(script);
    var currentRef = unityContainerRef.current;
    if (window !== undefined) {
      window.SendMessageToJS = function (type, content) {
        onMessage(type, content);
      };
    }
    return function () {
      document.body.removeChild(script);
      currentRef.removeChild(canvas);
    };
  }, [config, onLoaded]); // Include 'onLoaded' in the dependency array
  (0, _react.useImperativeHandle)(ref, function () {
    return {
      sendMessage: function sendMessage(type, content) {
        // Use unityInstance to send a message to Unity
        if (unityInstance) {
          unityInstance.SendMessage('HandleJSMessages', 'ReceiveMessage', "".concat(type, "\n").concat(content));
        }
      }
    };
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: unityContainerRef,
    style: style
  });
};
var _default = /*#__PURE__*/(0, _react.forwardRef)(WebGL);
exports["default"] = _default;