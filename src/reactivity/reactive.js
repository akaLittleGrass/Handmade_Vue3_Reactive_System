import { isObject } from '../shared/utils'
import { mutableHandlers } from './baseHandler'
function reactive(target) {
    return createReactiveObject(target, mutableHandlers)
}
function createReactiveObject(target, baseHandler) {
    if (!isObject(target)) return target
    return new Proxy(target, baseHandler)
}
export {
    reactive
}