"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * @param  {} config unity loader config, see examples on readme at https://github.com/Multi-Sync/webgl-nextjs
 * @param  {} onLoaded callback function to be called when unity application is loaded
 * @param  {} onMessage callback function to be called when unity application sends a message to JS layer
 * @param  {} style style object to be applied to the unity container
 * @param  {} ref reference to the unity container
 */
var WebGL = function WebGL(_ref, ref) {
  var config = _ref.config,
    onLoaded = _ref.onLoaded,
    onMessage = _ref.onMessage,
    style = _ref.style;
  var unityContainerRef = (0, _react.useRef)(null);
  var unityInstanceRef = (0, _react.useRef)(null);
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
        //Todo track progress here
        if (progress === 1) {
          // Trigger the callback prop once the application is loaded.
          //Todo for tracking end of progress
        }
      }).then(function (instance) {
        if (instance) {
          unityInstanceRef.current = instance;
          onLoaded();
        }
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
        if (unityInstanceRef && unityInstanceRef.current) {
          unityInstanceRef.current.SendMessage('HandleJSMessages', 'ReceiveMessage', "".concat(type, "\n").concat(content));
        } else {
          console.error("unityInstanceRef is null, send messages after OnLoaded callback");
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