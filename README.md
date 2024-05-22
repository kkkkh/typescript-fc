## typescript-fc

About ts common skills and sum
关于ts的常用技巧以及总结

#### 兼容旧代码
- 场景：
    - 项目迁移，新项目使用ts，为了兼容旧项目的代码，
    - 兼容windows：全局变量、全局方法
- 解决思路：
    - 一个框架，在IIEF模式中使用，方法全部为暴露在window上的，继承其类型 `interface Window extends p5`
    - 自定义方法，则添加到 interface Window 中

```ts
import type p5 from "p5"
declare var read: () => void;
declare var write: (code:string) => void;

declare global {
  interface Window extends p5 {
      read: () => void;
      write:(code:string) => void;
  }
}
export {};
```

#### 泛型使用
- 泛型是什么
    - 泛型其实就是封装相同操作的包裹体
    - 重复实现的过程，进行抽离，每次传入不同的类型值
- 场景：
    - 在react中父组件定义一个响应式的对象
    - 多个子组件对其中部分属性进行更新（非常常见的操作）
- 解决：
    - 更新的操作都是一样的，定义泛型
    - 更新的对象的属性不一样，进行传入
    - 多个地方都可以使用定义的泛型
```ts
// 定义 type 泛型
export type UpdateStateType<T> = (newState: Partial<T>)=> void;
export interface StatePropsType <T>{
    updateState: T
}
// 类型值
export type OrderStateType = { 
    aaa: string ; 
    bbb: number ; 
    ccc: string   
}
// 传入
export type UpdateOrderStateType = UpdateStateType<OrderStateType>
export type OrderStatePropsType  = StatePropsType<UpdateOrderStateType>
```

```ts
// 在react中使用
// 父组件 page.tsx
import Home from "./Home";

import {OrderStateType,UpdateOrderStateType} from "@/type/State"
export default function Home() {
    const [state,setState] = useState<OrderStateType>({
        aaa:"",
        bbb:0,
        ccc:""
    })
    const updateState:UpdateOrderStateType =  (newState) => {
        setState(prevState => ({ ...prevState, ...newState }));
      };
    return (
        <Home updateState={updateState}>
            <div>{state.aaa}</div>
        </Home>
    );
}
// 子组件 Home.tsx
import {OrderStatePropsType} from "./State"

const Home: React.FC<OrderStatePropsType> = ({updateState}) => {
    const handle =  () => {
        updateState({aaa:"111"})
    }
    return <div></div>
}
export default Home
```

#### 函数声明 vs 箭头函数
- 场景
    - react中一个组件可以是函数声明导出，也可以是箭头函数导出
    - 有什么区别吗
- 区别 (写法区别)
```ts
// React.FC<OrderStatePropsType> 是Home这个方法的类型
const Home: React.FC<OrderStatePropsType> = ({updateState}) => {
    const handle =  () => {
        updateState({aaa:"111"})
    }
    return <div></div>
}
export default Home
```
```ts
// 函数声明写法
// 使用 ReturnType<React.FC<OrderStatePropsType>> 函数类型的返回值类型
// 参数类型判断 {updateState}:OrderStatePropsType
export default function Home ({updateState}:OrderStatePropsType):ReturnType<React.FC<OrderStatePropsType>>{
    const handle =  () => {
        updateState({aaa:"111"})
    }
    return <div></div>
}
```

#### 高级类型操作符
- Partial（属性设置为可选）
```ts
interface Person {
  name: string;
  age: number;
  address: string;
}
type PartialPerson = Partial<Person>;
const partialPerson: PartialPerson = {
  name: "Alice"
};
console.log(partialPerson); 
// 输出：{ name: "Alice" }
```
- ReturnType（获取函数类型的返回值类型）
```ts
function add(a: number, b: number): number {
  return a + b;
}
type AddReturnType = ReturnType<typeof add>; // number
const result: AddReturnType = add(3, 5);
console.log(result); // 输出：8
```