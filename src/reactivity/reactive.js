import { track, trigger } from "./effect";

function createGetter() {
  return function get(target, key, receiver) {
    const result = Reflect.get(target, key, receiver);
    if (typeof result === "object") {
      return reactive(result);
    }
    track(target, "get", key);
    return result;
  };
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const hadKey = Object.prototype.hasOwnProperty.call(target, key);
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, receiver);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (oldValue !== value) {
      trigger(target, "set", key, value);
    }
    return result;
  };
}

const handlers = {
  get: createGetter(),
  set: createSetter(),
};

function reactive(target) {
  return createReactiveObject(target, handlers);
}
function createReactiveObject(target, baseHandler) {
  if (typeof target !== "object") return target;
  return new Proxy(target, baseHandler);
}
export { reactive };
