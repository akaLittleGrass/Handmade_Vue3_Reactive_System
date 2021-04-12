import { isObject, hasOwn, hasChanged } from '../shared/utils'
import { track, trigger } from './effect'
import { reactive } from './reactive'
function createGetter() {
    return function get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver)
        if (isObject(result)) {
            return reactive(result)
        }
        track(target, 'get', key)
        return result
    }
}
function createSetter() {
    return function set(target, key, value, receiver) {
        const hadKey = hasOwn(target, key)
        const oldValue = target[key]
        const result = Reflect.set(target, key, value, receiver)
        if (!hadKey) {
            trigger(target, 'add', key, value)
        } else if (hasChanged(oldValue, value)) {
            trigger(target, 'set', key, value)
        }
        return result
    }
}

const mutableHandlers = {
    get: createGetter(),
    set: createSetter()
}

export {
    mutableHandlers
}