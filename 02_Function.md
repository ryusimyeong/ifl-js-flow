# Function

## 1) HOISTING

사전적 정의: 끌어올리다.

**변수의 선언과 함수의 선언**을 끌어올린다.

자바스크립트 엔진은 코드를 실행하기 전에, 코드 전반을 훑어 선언된 것들을 발견하는 족족 끌어올린다.

```js
console.log(a());
console.log(b());
console.log(c());

function a() {
    return "a";
}

let b = function bb() {
    return "bb";
}

let c = function() {
    return "c";
}

```
자바스크립트 엔진은 이 코드를

```js
function a() {
    return "a";
}

let b;
let c:

console.log(a());
console.log(b());
console.log(c());

b = function bb() {
    return "bb";
}

c = function() {
    return "c";
}
```
이렇게 읽는다.

함수 선언문은 통째로 올라가고, 함수 표현식은 선언 부분만 올라간다. 할당은 hoisting의 대상이 아니다.

## 2) 함수 선언문과 함수 표현식

```js
// 함수 선언문 function declaration
function a() {
    return "a";
}

// 기명 함수 표현식 named function expression
let b = function bb() {
    return "bb";
}

// (익명) 함수 표현식 (unnamed/annonymous) function expression
let c = function() {
    return "c";
}
```

예전에는 에러가 났을 때 브라우저들이 기명함수 표현식의 경우엔 함수의 이름을 알려주고 익명 함수는 보여주지 않았다. 하지만 최근의 브라우져들은 익명 함수의 name property에, 자동으로 변수명을 할당하고 해당 변수명을 보여줘 디버깅하기에 편해졌다. 따라서 요즘은 **익명함수**를 주로 쓴다.


##### 익명 함수 표현식의 선언되고 정의되는 방식
```js
// (익명) 함수 표현식 (unnamed/annonymous) function expression
let c = function() {
    return "c";
}
```
1. 변수 c 선언
2. 익명함수 선언
3. 선언된 함수를 변수 c에 할당.

선언한 함수를 선언한 변수에 할당한다. -> 함수표현식의 개념. 

**함수 선언문과 함수 표현식의 차이는 할당 여부에 있다.**

함수가 할당되지 않으면 함수 전체가 호이스팅되고, 할당되면 함수는 그 자리에 있고 변수만 호이스팅된다.

#### 호이스팅 여부가 실무에 미치는 영향

```js
function a() {
    return "a";
}
/* 중략, 대략 5000 줄*/
function a() {
    return "b";
}
```

위 코드를 실행하면 두 개의 함수가 모두 호이스팅되어 두 번째로 선언된 함수만 사용되고, 5000줄에 있던 함수가 맨 위로 올라가져서 코드를 위에서부터 아래로 읽는데 가독성이 떨어진다. 

```js
let a = function() {
    return "a";
}
/* 중략, 대략 5000 줄*/
let b = function() {
    return "b";
}
```

이렇게 하면 선언부만 올라가고 함수는 그 자리에 남아서 가독성에 좋고, 변수 이름을 다르게 선언하여 함수끼리 겹칠 일도 없다.

따라서, **무조건 함수 표현식을 사용하는 것이 좀더 예측 가능하고 안전한 코드를 위해 좋다.** arrow function은 이러한 이유와 기타 성능상의 이유로 사용된다.

## 3) 함수 스코프, 실행 컨텍스트

- scope: 변수의 유효범위
- execution context: 실행되는 코드 덩어리(추상적인 개념)

가장 큰 차이는 발생하는 시점이다.

스코프는 함수가 **정의**될 때 결정되고, 실행 컨텍스트는 함수가 **실행**될 때 생성된다.

실행 컨텍스트는 호이스팅이 이루어진 이후의 코드 전문과 this 바인딩(this가 가리키는 것이 무엇인지) 등의 정보가 담긴 코드 덩어리이다.

호이스팅 이후에 위에서부터 아래로 읽고 변수 할당 등이 시작된다.

스코프 내에서 선언된 변수는 해당 스코프에서만 접근이 가능하다. 변수에 접근할 때 일단 스코프 내에서 해당 변수를 찾고 없으면 그 밖에서 찾는다.

```js
var a = 1;

function outer() {
    console.log(a);

    function inner() {
        console.log(a);
        var a = 3;
    }

    inner();

    console.log(a);
}

outer();
console.log(a);
```

## 2-4) Method

간략하게 말해서, 함수처럼 생겼는데 실행할 때 앞에 `.`이 붙어있으면 메소드

즉, 객체에 프로퍼티로서 존재하면 메소드.

메소드와 함수의 가장 큰 차이는 this 바인딩 여부이다. **메소드는 this 바인딩을 한다.**

```js
var obj = {
    a: 1,
    b: function bb() {
        console.log(this);
    }
    c: function() {
        console.log(this.a);
    }
}

obj.b();
obj.c();

console.dir(obj.b());
console.dir(obj.c());
```

에서 function bb() 내부에 있는 this 는 `obj.b()`의 `.`이전까지가 된다. 즉 b()의 this는 `obj`가 된다. 

## 2-5) callback function

call / back

somthing will CALL this function BACK sometime somehow.

무언가가 이 (콜백)함수를 호출해서 언젠가 어떻게든 돌려줄 거야.

함수의 제어권을 넘겨주는 것이다.

```js
var cdf = function() {
    console.log("1초마다 실행된다.");
}

// cdf 변수에 담긴 함수의 제어권은 setInterval이다.
setInterval(cdf, 1000)
```

MDN 이 정의한 setInterval = setInterval(callback, milliseconds)

```js
var arr = [1, 2, 3, 4, 5];
var entries = [];
arr.forEach(function(v, i) {
    entries.push([i, v, this[i]]);
}, [10, 20, 30, 40, 50]);

console.log(entries);
```

```
callback 함수와 this 로 인식할 것.
arr.forEach(callback[, thisArg]);

이 callback의 매개변수에는 (currentValue, index, array)
```

forEach를 위한 콜백함수를 만들 때는 forEach가 정의한 규칙에 따라 만들어야 한다. 즉, 콜백함수에 대한 제어권이 forEach에 있다.

##### 콜백함수의 특징

다른 함수A의 매개변수로 콜백함수 B를 전달하면, A가 B의 제어권을 갖는다.

특별한 요청(bind)이 없는 한 A에 미리 정해진 방식에 따라 B를 호출한다.

미리 정해진 방식이란 this에 무엇을 바인딩할지, 매개변수로는 어떤 값을 지정할지, 어떤 타이밍에 콜백을 호출할지 등이다.

**콜백함수는 메소드가 아니라 함수다.**

```js
var arr = [1,2,3,4,5];
var obj = {
    vals: [1,2,3],
    logValues: function(v, i) {
        if (this.vals) {
            console.log(this.vals, v, i);
        } else {
            console.log(this, v, i);
        }
    }
}

obj.logValues(1, 2);
arr.forEach(obj.logValues);
```

위의 코드에서 `obj.logValues(1, 2)`의 this는 `obj` 다.

하지만 `arr.forEach(obj.logValues)`의 this 는 forEach가 정한 값(window)이다. 메소드 형태여도 함수다. `arr.forEach(obj.logValues)` 주소가 가리키는 함수만 호출한다고 된다.