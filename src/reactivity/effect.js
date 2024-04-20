export function effect(fn, options = {}) {
    const effect = createReactiveEffect(fn, options)
    if (!options.lazy) {//lazy为真则需要手动执行effect返回的函数才能开启effect
        effect()
    }
    return effect
}

let uid = 0, activeEffect
const effectStack = []
function createReactiveEffect(fn, options) {
    const effect = function () {
        if (!effectStack.includes(effect)) {
            try {
                effectStack.push(effect)
                activeEffect = effect
                return fn()
            } finally {
                effectStack.pop()
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    }
    effect.options = options
    effect.id = uid++
    effect.deps = []
    return effect
}

const targetMap = new WeakMap()
export function track(target, type, key) {
    if (activeEffect === undefined) {
        return
    }
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)//属性记录effect
        activeEffect.deps.push(dep)//effect记录dep属性
    }
}

export function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return
    }
    const run = (effects) => {
        if (effects) {
            effects.forEach(effect => effect())
        }
    }
    if (key !== null) {
        run(depsMap.get(key))
    }
    if (type === 'add') {//数组新增属性会出发length对应依赖，取值的时候会对length属性进行依赖收集
        run(depsMap.get(Array.isArray(target) ? 'length' : ''))
    }
}