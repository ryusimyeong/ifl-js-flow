# 1. data type

## 종류

### 1) 기본형 Primitive Type

1. Number
2. String
3. Boolean
4. null
5. undefined
6. Symbol (ES6+)
7. ...

### 2) 참조형 Reference Type

- Object
  1. Array
  2. Function
  3. RegExp
  4. Map / WeakMap (ES6+)
  5. Set / WeakSet (ES6+
  6. ...

## 작동 원리

### 1) 기본형

```js
var a; // 특정 메모리 공간 확보. 해당 메모리의 이름을 a라고 지정
a = "abc"; // 특정 메모리에 "abc"값 저장. 그 메모리의 주소를 메모리 a에 할당.
a = "abcdf"; // 또 다른 특정 메모리에 "abcdf"값 저장. 그 메모리의 주소를 a에 재할당(덮어씌우기)
```

1. 값이 재할당되면 변수 자체의 주소값이 바뀐다.
2. 어떤 것도 지칭하지 않는 `"abc"`값은 Garbage Collector에 의해 삭제된다.

### 2) 참조형

```js
var obj; // 특정 메모리 공간 확보. 해당 메모리의 이름을 obj라고 지정
obj = { // 또다른 특정 메모리 공간 확보(@5002). 그 공간에 다른 프로퍼티들을 저장될 주소를 확보.
  a: 1, // 확보된 공간의 이름을 a. 
  b: "bbb"
};

obj.a = 2;
```

```js
var obj = {
  x: 3,
  arr: [3, 4]
};

obj.arr = "str";
```

기본형이든 참조형이든 참조 카운트가 0이면 가비지 콜렉팅 대상이 된다.

## 값 복사

```js
var a = 10;
var b = a;
var obj1 = { c: 10, d: "ddd" };
var obj2 = obj;
b = 15;
console.log(a);
obj2.c = 20;
console.log(obj1.c);
```

b의 값이 변해도 a의 값은 변하지 않는다.

그러나 obj2의 값이 변하면 obj1의 값도 변한다.

따라서 객체는 원본 객체를 변하게 하지 않으면서 복사하는 것, **불변객체**를 만드는 것이 중요하다.

동일한 값을 메모리 내에 존재하지 않는다. 메모리 내의 값은 반드시 하나만 존재한다. 즉
```js
var a = 3;
var b = [3, 4];
```
라고 하면, `a`나 `b[0]`은 똑같은 3을 사용하기 때문에 똑같은 주소를 가리킨다.