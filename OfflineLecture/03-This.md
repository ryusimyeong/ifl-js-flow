# This

> 정재남 님의 인프런 강좌, JS FLOW를 참고 하여 정리했습니다.

This Binding 은 실행 콘텍스트가 활성화 될 때 된다.

실행 콘텍스트는 함수가 호출될 때(스코프) 실행된다.

## 상황별 this.

### 1) 전역공간

전역 객체 **window**(브라우저), **global**(node.js)

```js
console.log(this); // window
```

### 2) 함수 호출

(일반적으로) 전역 객체

함수를 실행할 때, 함수를 호출하는 주체가 **전역 공간**

```js
function a() {
  console.log(this); // window
}
a(); 

function b() {
  function c() {
    console.log(this); // window
  }
  c();
}
b(); 
```

```js
const a = () => {
  console.log(this); // window
}
a(); 

const b = () =>  {
  const c = () => {
    console.log(this); // window
  }
  c();
}
b(); 
```

arrow function과 일반 function 과는 this binding이 조금 다르다.

일반 함수로서 호출한 this는 전역객체다. 화살표 함수는 별도의 binding을 하지 않고 한 단계 위 콘텍스트의 this를 사용한다. 

> 참고 (MDN 화살표 함수): https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98
> 
> 화살표 함수 표현(arrow function expression)은 function 표현에 비해 구문이 짧고  자신의 this, arguments, super 또는 new.target을 바인딩 하지 않습니다. 화살표 함수는 항상 익명입니다. 이  함수 표현은 **메소드 함수가 아닌 곳에 가장 적합**합니다. 그래서 생성자로서 사용할 수 없습니다.

### 3) 메소드 호출

일반함수의 경우엔 메소드 호출 주체. **.** 바로 앞

화살표 함수는 전역 객체.

```js
const obj = {
  a() {
    console.log(this);
  },
  b: () => {
    console.log(this);
  },
  c: function () {
    console.log(this);
  },
  d: () => {
    function dd() {
      console.log(this);
    }
    dd();
  },
  e() {
    const ee = () => {
      console.log(this);
    }
    ee();
  }
};

obj.a(); // 일반함수 obj
obj.b(); // 화살표 함수 window
obj.c(); // 일반함수 obj
obj.d(); // 화살표 함수 내 일반함수 window
obj.e(); // 일반함수 내 화살표 함수 obj


const obj1 = {
  mtd1() {
    console.log(this);
  },
  obj2: {
    mtd2() {
      console.log(this);
    }
  },
  mtd3: () => {
    console.log(this);
  },
  obj3: {
    mtd4: () => {
      console.log(this);
    }
  }
};
obj1.mtd1(); // this === obj1
obj1.obj2.mtd2(); // this === obj2
obj1.mtd3(); // this === window
obj1.obj3.mtd4(); // this === window
```
즉, 메소드가 일반함수면 **this**는 '.'앞의 **객체**, 화살표 함수면 **window**.

### 3-1) 메소드인 경우, 내부함수에서의 우회법

```js
var a = 10;
var obj = {
  a: 20,
  b() {
    console.log(this); // this === obj. 20 출력

    function c() {
      console.log(this); // this === window. 10 출력
    }
    c();
  }
}

obj.b();
```

obj의 메소드 b의 this는 obj이기 때문에 obj.b()는 20을 출력한다. 

하지만 b 내부에서 선언된 일반함수 c의 전역객체는 window 이기 때문에 c()는 전역공간에서 선언된 a의 값, 10을 출력한다.

c의 this를 obj로 맞춰주는 (ES6+ 이전의) 대표적인 방법은 아래와 같다.

```js
var a = 10;
var obj = {
  a: 20,
  b() {
    var self = this;
    console.log(this.a);

    function c() {
      console.log(self.a); 
    }
    c();
  }
}

obj.b();
```
메소드 b() 내부의 this, 즉 obj를 self 라는 변수에 담아 사용한다.

하지만 ES6+ 시대에선 좀 다르다.

```js
const a = 10;
const obj = {
  a: 20,
  b() {
    console.log(this.a); // this === obj

    function c() {
      console.log(a); // 10
      console.log(this); // window
      console.log(this.a); // undefined
    }
    c();
  }
}

obj.b();
```

일단 function c()에서 this.a가 undefined로 출력된다. 이건 왜인지 잘 모르겠다...

다만 function c()를 화살표 함수로 바꿔주면 함수 c() 내의 this는 obj가 된다. 이는 화살표함수가 별도의 바인딩 없이 자신이 속한 콘텍스트의 this를 가져가기 때문이다.

> MDN: 화살표 함수는 전역 컨텍스트에서 실행될 때 this를 새로 정의하지 않습니다. 대신 코드에서 **바로 바깥의 함수(혹은 class)의 this값이 사용**됩니다. 이것은 this를 클로저 값으로 처리하는 것과 같습니다.

```js
const a = 10;
const obj = {
  a: 20,
  b() {
    console.log(this.a); // this === obj

    const c = () => {
      console.log(a); // 10
      console.log(this); // obj
      console.log(this.a); // 20
    }
    c();
  }
}

obj.b();
```

메소드는 일반함수로, 그 내부에서 함수를 정의해야 한다면 화살표 함수로 정의하는 것이 좋겠다.

### 4) callback 호출 시

기본적으로는 함수 내부와 동일하다.

call, apply, bind 메소드를 먼저 알아보자.

### 4-1) 명시적인 this binding

명시적으로 함수의 this를 지정해줄 수 있다.

```js
function a(x, y, z) {
  console.log(this, x, y, z);
}

var b = {
  c: "eee"
};

a(1, 2, 3); // window, 1, 2, 3
a.call(b, 1, 2, 3); // {c:"eee"}, 1, 2, 3
a.apply(b, [1, 2, 3]); // {c:"eee"}, 1, 2, 3

var c = a.bind(b);
c(1, 2, 3); // {c:"eee"}, 1, 2, 3

var d = a.bind(b, 1, 2);
d(3); // {c:"eee"}, 1, 2, 3
```

> #### Function.prototype.call()
> call() 메소드는 주어진 this 값 및 각각 전달된 인수와 함께 함수를 호출합니다.
> 이 함수 구문은 apply()와 거의 동일하지만, call()은 인수 목록을, 반면에 apply()는 인수 배열 하나를 받는다는 점이 중요한 차이점입니다.
> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/call

> #### Function.prototype.apply()
> apply() 메서드는 주어진 this 값과 배열 (또는 유사 배열 객체) 로 제공되는 arguments 로 함수를 호출합니다.
> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply

> #### call()과 apply() 의 차이
> **call()**은 인수 목록을 받는다(ex. 1, 2, 3). **apply()**는 인수 배열 하나를 받는다.(ex. [1,2,3])

> #### Function.prototype.bind()
> bind() 메소드가 호출되면 새로운 함수를 생성합니다. 받게되는 첫 인자의 value로는 this 키워드를 설정하고, 이어지는 인자들은 바인드된 함수의 인수에 제공됩니다.
> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

하지만 화살표 함수는 call, apply, bind가 지정해주는 this를 무시합니다.

```js
const a = (x, y, z) => {
  console.log(this, x, y, z);
}

const b = {
  c: "eee"
};

a(1, 2, 3); // window, 1, 2, 3
a.call(b, 1, 2, 3); // window, 1, 2, 3
a.apply(b, [1, 2, 3]); // window, 1, 2, 3

const c = a.bind(b);
c(1, 2, 3); // window, 1, 2, 3

const d = a.bind(b, 1, 2);
d(3); // window, 1, 2, 3
```

> MDN: 화살표 함수에서는 this가 바인딩되지 않았기 때문에, call() 또는 apply() 메서드는  인자만 전달 할 수 있습니다. this는 무시됩니다.

### 4-2) 콜백함수에서의 this

콜백함수는 기본적으로 window를 this로 본다.

```js
var callback = function () {
  console.log(this);
};

var obj = {
  a: 1,
  b: function (cb) {
    cb(this); // window
  }
};

obj.b(callback);
```

하지만 아래와 같이 call 메소드를 써주면 this를 지정할 수 있다.

```js
var callback = function () {
  console.log(this);
};

var obj = {
  a: 1,
  b: function (cb) {
    cb.call(this); // obj
  }
};

obj.b(callback);
```

콜백함수를 화살표 함수로 지정해주면 call()로 지정한 this는 무시되고 this가 window로  설정된다.

```js
var callback = () => {
  console.log(this);
};

var obj = {
  a: 1,
  b: (cb) => {
    cb.call(this); // window
  }
};

obj.b(callback);
```

콜백함수의 this를 따로 지정해주고 싶다면 콜백함수를 일반함수로 정의하자.

```js
function callback() {
  console.log(this);
};

var obj = {
  a: 1
};

setTimeout(callback, 1000); // 1초 후 window 출력
setTimeout(callback.bind(obj), 2000); // 2초후 obj 출력
```

setTimeout 등에서 활용할 땐, call이나 apply말고 bind를 사용한다. call과 apply는 함수를 즉시 호출시키기 때문에 setTimeout과 setInterval의 기능을 제대로 활용할 수 없다. 

bind는 호출이 아니라 그저 새로운 함수값을 반환하기 때문에 더 적합하다.

```js
document.body.innerHTML += "<div id='a'>클릭하세요</div>"
var obj = { a: 1 };

document.getElementById('a')
  .addEventListener("click", function () {
    console.log(this); // document.body.innerHTML
  });
```
**addEventListener**는 콜백함수의 this를 해당 DOM 객체로 설정한다. 

```js
document.body.innerHTML += "<div id='a'>클릭하세요</div>"
var obj = { a: 1 };

document.getElementById('a')
  .addEventListener("click", function () {
    console.log(this); // obj
  }.bind(obj));
```
위와 같이 bind를 이용해 this를 obj로 바꿔줄 수 있다.

콜백함수가 화살표 함수면 window를 출력한다.

```js
document.body.innerHTML += "<div id='a'>클릭하세요</div>"
var obj = { a: 1 };

document.getElementById('a')
  .addEventListener("click", () => {
    console.log(this); // window
  });
```
#### 정리

콜백함수에서의 this는

1. 기본적으로 함수의 this와 같다.
2. 제어권을 가진 함수가 callback의 this를 명시한 경우 그에 따른다.
3. 개발자가 this를 바인딩한 채로 callback을 넘기면 그에 따른다.
4. 화살표 함수는 call, apply, bind 등에 영향을 받지 않고(위의 2, 3번의 조건을 무시하고) window를 this로 가지며 바로 바깥 함수나 클래스의 this를 사용한다.

### 5) 생성자 함수 호출

인스턴스를 가리킨다.

```js
function Person(n, a) {
  console.log(this); // Person {}
  this.name = n;
  this.age = a;
  console.log(this); // Person {name: "고무곰", age: 30}
}

var gomugom = new Person("고무곰", 30);
console.log(gomugom); // Person {name: "고무곰", age: 30}
```

화살표 함수는 생성자 함수로 사용할 수 없다.

**메소드는 일반 함수로 정의한다. 콜백 함수의 this를 따로 지정해주고 싶을 때 일반함수로 정의한다. 나머지는 화살표 함수로 정의한다.**