// ts 内的vue文件规则
declare module '*.vue' {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module '*.png'
interface Window {
  result?: Uint8Array,
  subCanvas?: any,
  subCtx?: any,
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
interface ReaderEvent extends Event {
  target: ReaderEvent & EventTarget;
}