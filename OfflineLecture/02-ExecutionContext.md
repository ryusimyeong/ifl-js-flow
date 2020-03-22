# 실행 콘텍스트 Execution Context 와 변수 선언 방식

동일한 조건/환경을 지니는 코드 뭉치(scope)를 실행할 때 필요한 조건/환경 정보 혹은 그것을 담은 객체

## 관련 개념

1. 호출스택
2. Lexical Environment
   1. environment records
      - hoisting         
      - TDZ
   2. outer environment reference
      - scope chain
3. this binding

### 1) 호출 스택 call stack 

- 현재 어떤 함수가 동작하고 있는지, 다음에 어떤 함수가 호출되어야 하는지 등을 제어하는 자료구조.

- stack은 **FILO**(First In Last Out) 정책이다.
- 가장 먼저 호출된 함수가 가장 마지막에 끝나고, 가장 마지막에 호출된 함수가 가장 먼저 끝난다.

```js
var a = 1;

function outer() {
  console.log(a); // 첫 번째로 실행. 1 출력

  function inner() {
    console.log(a); // 두 번째로 실행. undefined 출력
    var a = 3;
  }
  inner();
  console.log(a); // 세 번째로 실행. 1 출력
}

outer();
console.log(a); // 네 번째로 실행. 1 출력
```

### 2) Lexical Environment

- 실행 콘텍스트의 구성요소 중 하나.
- 사전 정의: 어휘적/사전적 환경. 
- 식별자 환경. 해당 콘텍스트에서 어떤 변수와 함수를 어떻게 사용할 수 있는가.
- 구성 요소
  - Environment Record
  - Outer Environment Reference

> 참고: 실행콘텍스트 구성요소
>1. Variable Environment: 가변적인 스냅샷. 별로 의미없다.
>2. **Lexical Environment**
>3. **This Binding**

#### 2-1) Environment Record

- 현재 문맥의 식별자 정보. 선언된 변수와 함수.
- **Hoisting**의 방식으로 선언된 변수와 함수를 코드 실행 전에 수집한다.
  - 끌어 올리다, 라는 뜻. 
  - 코드 실행 전에 선언된 식별자 정보(변수, 기명함수)를 먼저 수집하여 (가상으로) 코드 최상단에 끌어올린다.
  - 즉, 코드 전체를 읽고 식별자들을 선언부터 한 다음 코드를 실행하는 것.
  - `var`로 선언된 변수와 기명함수 선언문이 실질적으로 해당.
  - `const`와 `let`으로 선언된 변수와 함수 표현식들은 **TDZ** 때문에 실질적으로 해당되지 않는다.

#### 2-1-1) TDZ와 변수 선언 방식들의 차이

`var`와 `const` / `let`의 결정적 차이 중 하나.
```js
console.log(a);
var a = 3;
```
위 코드는 hosting으로 인해
```js
var a;
console.log(a); // undefined
a = 3;
```
위와 같이 읽히며 에러 없이 `undefined`가 출력된다.

```js
console.log(a);
const a = 3;
// let a = 3;
```
하지만 위와 같이 `const` 혹은 `let`으로 변수를 선언하면 Temporaly Dead Zone, `TDZ`가 발생하여 error가 발생한다.

이는 `var`로 선언하면 선언과 동시에 `undefined`로 값이 초기화되지만, `const`나 `let`으로 선언하면 값이 할당되기 전에는 값이 초기화 되지 않기 때문이다. 

즉, `var`는 변수를 `선언+초기화 -> 할당` 순으로 선언 및 할당한다면 `const`나 `let`은 `선언 -> 초기화+할당` 순으로 하는 것이다. 

선언 이후 초기화되기 전 값의 공백 상태를 `TDZ`라고 한다.

`var`, `let`, `const`의 차이를 정리하면 아래 표와 같다.

|         | 재선언 | 재할당 | Hoisting | TDZ | 스코프    |
| ------- | --- | --- | -------- | --- | ------ |
| `var`   | O   | O   | O        | X   | 함수 스코프 |
| `let`   | X   | O   | O        | O   | 블록 스코프 |
| `const` | X   | X   | O        | O   | 블록 스코프 |

#### 2-1-2) 함수 선언문과 함수 표현식
함수 선언문. 통째로 호이스팅된다.
```js
function name() {
  
}
```
함수 표현식
```js
var func1 = function () {
  
}
```
위 함수는 var 로 선언되었기 때문에 아래와 같이 읽힌다.
```js
var func1;

func1 = function() {

}
```

#### 2-2) Outer Environment Reference

- 현재 스코프에 관련 있는 외부 식별자 정보. 외부 스코프들의 식별자.
- **Scope Chain** 현상을 발생시킨다.
  - 현재 스코프에서 변수를 찾고 없으면 한 단계 밖 스코프에서 변수를 찾고 또 없으면 그 다음 스코프에서 변수를 찾는 현상

```js
// global에서 선언된 변수는 모든 곳에서 사용 가능
var a = 1;

function outer() {
  // outer에서 선언된 변수는 inner와 outer에서 사용 가능
  console.log(a);

  function inner() {
    // inner에서 선언된 변수는 inner에서만 사용 가능
    console.log(a);
    var a = 3;
  }
  inner();
  console.log(a);
}

outer();
console.log(a);
```

## 정리

변수의 스코프는 결국 실행 콘텍스트에 의해 결정이 된다.

```js
// global context
var a = 1;

function outer() {
  // outer context
  console.log(a);

  function inner() {
    // inner context
    console.log(a);
    var a = 3;
  }

  inner();
  console.log(a);
}

outer();
console.log(a);
```

위의 코드는 아래와 같이 실행된다.

- 전역 콘텍스트 시작
  1. 변수, 함수(기명함수) 선언 수집 (environment records)
  2. 코드 실행 시작
  3. outer() 함수 호출
  - outer 콘텍스트 시작
    1. 변수, 함수 선언 수집
    2. 코드 실행
    3. inner()함수 호출
    - inner 콘텍스트 시작
      1. 변수, 함수 선언 수집
      2. 코드 실행
      3. return 되거나 코드가 끝나면 inner 실행 콘텍스트 종료
    4. outer 콘텍스트 복귀 inner() 다음부분 실행
    5. return 되거나 코드가 끝나면 outer 콘텍스트 종료
  4. 전역 스코프로 복귀. 종료될 때까지 남은 코드 실행.