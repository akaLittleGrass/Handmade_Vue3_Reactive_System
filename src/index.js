// import { reactive, effect } from '@vue/reactivity' // Vue3原版响应式系统
import { reactive, effect } from "./reactivity"; // 手写简版响应式系统

const obj = reactive({
  name: "ming",
  age: 18,
  arr: [0, 1, 2], //vue2响应式不能监听数组的索引和长度，vue3可以
});
effect(() => {
  console.log(obj.name);
});
obj.name = "lin";

effect(() => {
  console.log(JSON.stringify(obj.arr));
});
obj.arr[0] = 100;
obj.arr.push(88);
obj.arr.length = 5;
