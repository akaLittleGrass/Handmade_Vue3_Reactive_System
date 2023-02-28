import { reactive, effect } from "./reactivity";

const state = reactive({
  count: 0,
  list: [],
});

effect(() => {
  console.log(state.count);
});

effect(() => {
  console.log(JSON.stringify(state.list));
});

effect(() => {
  state.count = state.count++;
});

state.count++;
state.list.push("a");
