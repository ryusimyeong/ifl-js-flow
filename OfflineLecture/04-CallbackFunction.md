# Callback Function

Call : 호출하다

Back : 돌려주다

Function : 함수

호출해서 어떤 결과를 돌려주는 함수.

어떤 특정 함수 등에 콜백함수의 제어권을 넘긴다.

## 콜백함수가 넘겨받는 제어권의 종류

### 1) 실행시점

`setInterval(callback, milliseconds)`
```js
function callback() {
  console.log("1초마다 실행");
  console.log(this)
}

setInterval(callback, 1000);
```

### 2) 인자

`Array.prototype.forEach`

> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

```js
var arr = [1, 2, 3, 4, 5];
var entries = [];
// 현재 처리중인 요소의 값, 현재 처리중인 요소의 인덱스, 현재 처리중인 배열
function callback(value, index, array) {
  entries.push([index, value, this[index]]);
  console.log(array); // [1, 2, 3, 4, 5]
}
// 콜백함수, this로 설정할 값
arr.forEach(callback, [10, 20, 30, 40, 50]);
console.log(entries);
// [[0, 1, 10], [1, 2, 20], [2, 3, 30], [3, 4, 40], [4, 5, 50]]
```

### 3) this binding

`addEventListener` 등은 this를 DOM으로 바꾼다. 그리고 해당 콜백함수의 첫 번째 인자는 이벤트 객체로 넘긴다.

뭔가 새로운 인자를 넘겨주고 싶다면 두 번째 인자부터 새로 정의한다.

```js
document.body.innerHTML += "<div id='a'>클릭하세요</div>"
var obj = { a: 1 };

document.getElementById('a')
  .addEventListener("click", function (e, potato) {
    console.log(e);
    potato = "lalal";
    console.log(potato); // "lalal"
    console.log(this); // document.body.innerHTML
  });
```

화살표 함수일 때는 this는 window고 인자와 관련된 것은 일반함수와 동일하다.

```js
document.body.innerHTML += "<div id='a'>클릭하세요</div>"
var obj = { a: 1 };

document.getElementById('a')
  .addEventListener("click", (e, potato) => {
    console.log(e);
    potato = "lalal";
    console.log(potato); // "lalal"
    console.log(this); // window
  });
```

> https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener


### 정리

다른 함수(A)의 인자로 콜백함수(B)를 전달하면 A가 B의 제어권을 갖는다.

특별한 binding이 없는 한 A에 미리 정해진 방식에 따라 B를 처리한다.

미리 정해진 방식이란, 어떤 시점에 호출할지, 인자에 어떤 값을 지정할지, this에 어떤 것을 바인딩 할지 등등이다.

### 주의

콜백은 함수이다. 메소드가 아니다. 

```js
var arr = [1, 2, 3, 4, 5];
var obj = {
  v: [1, 2, 3],
  logV: function (v, i) {
    if (this.v) {
      console.log(this.v, v, i);
    } else {
      console.log(this, v, i);
    }
  }
};

obj.logV(1, 2); // this === obj
arr.forEach(obj.logV); // this === window
```
따라서 위 코드에서 obj.logV라는 메소드는 forEach의 콜백**함수**이므로 this가 window가 된다.

forEach에서 this를 조정하고 싶다면 bind를 쓰던지, thisArgs 위치에 값을 넣어준다.
```js
var arr = [1, 2, 3, 4, 5];
var obj = {
  v: [1, 2, 3],
  logV: function (v, i) {
    if (this.v) {
      console.log(this.v, v, i);
    } else {
      console.log(this, v, i);
    }
  }
};

obj.logV(1, 2); // this === obj
arr.forEach(obj.logV.bind(obj)); // this === obj
```
```js
// 혹은
arr.forEach(obj.logV, obj);
```

또 화살표함수는 콜백함수가 지정하는 this binding을 무시한다. 즉 위의 코드에서 bind를 쓰든, forEach에 정의된 thisArgs 위치에 다른 값을 집어넣든, this는 기본적으로 window가 된다.
```js
var arr = [1, 2, 3, 4, 5];
var obj = {
  v: [1, 2, 3],
  logV: (v, i) => {
    if (this.v) {
      console.log(this.v, v, i);
    } else {
      console.log(this, v, i);
    }
  }
};

obj.logV(1, 2); // this === obj
arr.forEach(obj.logV, obj); // this === window
```