# Closure

> 정재남 님의 인프런 강좌, JS FLOW를 참고하여 정리하였습니다.

닫힘/폐쇄/완결성.

> MDN 정의: 함수와 그 함수가 선언될 당시의 lexical environment의 결합.
> https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Closures

실행 콘텍스트 A와 그 내부에서 선언된 함수 B가 결합되어 만들어내는 무언가라고 할 수있다.

이때 내부함수 B의 입장에서는 environmentRecord(이하 ER)가 아니라 outerEnvironmentReference(이하 OER)만 closure에 관여한다. 

ER은 함수 B에서만 사용가능하고, OER이 실행콘텍스트와 함수 B 자신의 관계와 관련된 것이다. 

B의 OER은 A의 ER을 참조한다. 

즉, 콘텍스트에서 선언한 변수를 내부함수 B에서 접근할 경우에 발생하는 특수한 현상이다.

```js
var outer = function () {
  var a = 1;
  var inner = function () {
    console.log(++a);
  };
  inner();
}
outer(); // 2
```
위의 코드는 아래와 같이 진행된다.
```
- 전역 콘텍스트 시작
  1. ER: {outer: f},
  2. outer() 호출
  - outer 콘텍스트 시작
    1. ER: {a: 1, inner: function}
    2. inner() 호출
    - inner 콘텍스트 시작
      1. ++a. outer 콘텍스트에서 a를 가져와 1 증가. a === 2
      2. 콘텍스트 종료
  - outer 콘텍스트 복귀 및 종료
- 전역 콘텍스트 복귀 및 종료
```
```js
var outer = function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  return inner;
}
var outer2 = outer();
console.log(outer2()); // 2
console.log(outer2()); // 3
```
```
- 전역 콘텍스트 시작
  1. ER: {outer: f, outer2: undefined}
  2. outer() 호출
  - outer 콘텍스트 시작
    1. ER: {a:1, inner: f} / OER: {outer: f}
    2. inner 리턴
  - outer 콘텍스트 불완전 종료. 내보내진 inner가 참조하는 a 때문에 완전히 종료되지 않는다.
- 전역 콘텍스트 복귀
  1. ER: {outer: f, outer2 = inner}
  2. outer2() 실행
  - outer2 === inner 콘텍스트 실행
    1. outer 콘텍스트의 ER인 a의 값이 2로 증가
    2. 2 리턴 후 종료
- 전역 콘텍스트 복귀
  1. ER: {outer: f, outer2 = inner}
  2. outer2() 실행
  - outer2 === inner 콘텍스트 실행
    1. outer 콘텍스트의 ER인 a의 값이 3으로 증가
    2. 3 리턴 후 종료
- 전역콘텍스트 복귀 및 종료
- outer 콘텍스트 종료.
```

여기서 outer를 전역 콘텍스트 종료 전에 완전히 종료하려면 outer2에 할당된 값을 다른 것으로 변경해야 한다.

콘텍스트 A에서 선언한 변수를 내부함수 B에서 접근할 경우에만 발생하는 특수한 현상 -> outer에서 선언된 변수 a를 inner가 접근하여 변수 a가 사라지지 않는 현상

컨텍스트 A에서 선언된 변수 a를 참조하는 내부함수 B가 A의 외부로 전달될 경우, A가 종료된 이후에도 변수 a가 사라지지 않는 현상.

이를 통해 **함수 종료 후에도 사라지지 않는 지역변수를 만들 수 있다.**

또 함수 내의 지역 변수에 대한 **외부의 접근을 자유자재로 통제**할 수 있다. 

```js
function a() {
  var localA = 1;
  var localB = 2;
  var localC = 3;
  return {
    get a() { return localA; },
    set a(v) { localA = v; },
    get b() { return localB + localC; },
    set b(v) { throw Error("read only"); }
  }
}

var obj = a();

// console.log(localA); // localA에 직접 접근은 불가하다.
// console.log(localB); // localB에 직접 접근은 불가하다.
// console.log(localC); // localC에 직접 접근은 불가하다.

console.log(obj.a); // localA. 1 출력
obj.a = 3; // localA = 3;
console.log(obj.a); // localA. 3 출력
console.log(obj.b); // localB + localC. 5 출력
obj.b = 9; // Error. read only.
```

외부에서는 클로저가 부여한 기능을 통해서만 함수 내부의 지역 변수에 접근할 수 있게되는 것이다.