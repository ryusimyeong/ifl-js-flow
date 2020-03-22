# this

## 1) 위치에 따른 this

1. 전역공간에서
   - window(브라우저) / global(node.js) (전역 객체)
2. 함수 내부에서
   - window(브라우저) / global(node.js) (전역 객체)
   - 기본값이며, 바뀔 수 있다.
       - 정확한 표현은 아니지만, 함수는 전역객체의 메소드라고 생각하자.
3. 메소드 호출 시
   - 메소드 호출 주체. 메소드 명 앞. `.`이전까지.
   - 내부 함수에서의 우회법
```js
var a = 10;
var obj = {
    a: 20,
    b: function() {
        console.log(this.a); // obj.a = 20

        function c() {
            console.log(this.a); // c()는 메소드가 함수라서 전역 스코프에서 선언된 a = 10
        }
        c();
    }
}
obj.b();

// scope chain 으로 우회
var a = 10;
var obj = {
    a: 20,
    b: function() {
        var self = this;
        console.log(this.a); // obj.a = 20

        function c() {
            console.log(self.a); // self는 b()의 this. 즉 obj.a = 20
        }
        c();
    }
}
obj.b();
```
4. callback 에서 
   - 기본적으로는 함수 내부와 동일
   - call, apply, bind를 통해 달라진다.
   - 제어권을 가진 함수가 callback의 this를 명시한 경우 그에 따른다.
   - 개발자가 this를 바인딩한 채로 callback을 넘기면 그에 따른다.
5. 생성자함수에서
   - 인스턴스


### call apply, bind 메소드

```js
function a(x, y, z) {
    console.log(this, x, y, z);
}

var b = {
    c: "eee"
};

a.call(b, 1, 2, 3); // Object {c:"eee"} 1 2 3
a.apply(b, [1, 2, 3]); // Object {c:"eee"} 1 2 3

var c = a.bind(b); // a를 호출하는데, this를 b로 해줘
c(1, 2, 3); // Object {c:"eee"} 1 2 3

var d = a.bind(b, 1, 2); // a를 호출하는데, this를 b로 해주고, 첫 번째 두 번째 인자는 미리 넣어줄게. 
d(3); // Object {c:"eee"} 1 2 3

// ------
```
```js
// thisArg은 이걸 this로 인식하게 해줘.
func.call(thisArg[, arg1[, arg2, ...]])
func.apply(thisArg, [arg1, arg2, ...])
// call 과 apply는 동일한데, call은 매개변수를 하나하나 넣어주고, apply는 그 매개변수들을 하나의 배열로 묶어서 넣는다. 
func.bind(thisArg[, arg1[, arg2, ...]])
// call과 apply는 즉시 호출하는데, bind는 생성만 한다.
```

#### 생성자 함수에서
```js
function Person(n, a) {
    this.name = n;
    this.age = a;
}
var gomugom = new Person("고무곰", 30);
console.log(gomugom);

// this는 gomugom
```
