export function effect(fn, options = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    //lazy为真则需要手动执行effect返回的函数才能开启effect监听
    effect();
  }
  return effect;
}

let activeEffect;
const effectStack = [];
function createReactiveEffect(fn, options) {
  const effect = function createReactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect; //△ △ △
        return fn(); //△ △ △
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect.deps = [];
  return effect;
}

const targetMap = new WeakMap();
export function track(target, type, key) {
  if (activeEffect === undefined) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map())); //△ △ △
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set())); //△ △ △
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect); //△ △ △
    activeEffect.deps.push(dep);
  }
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const run = (effects) => {
    if (effects) {
      effects.forEach((effect) => effect());
    }
  };
  if (key !== null) {
    run(depsMap.get(key)); //△ △ △
  }
  if (type === "add") {
    run(depsMap.get(Array.isArray(target) ? "length" : ""));
  }
}
