# Prototype

## `prototype`, `constructor`, `__proto__`

`prototype`, `constructor`, `__proto__`

Constructor.prototype 과 instance.__proto__가 같은 객체를 바라본다.

생성자 함수를 new 연산자를 이용해 instance를 만들면, 그 인스턴스에는 Constructor의 prototype이라는 프로퍼티의 내용이, `instance.__proto__`로 참조되어 전달된다.

근데 이때 `__proto__`는 생략이 가능해서, instance가 Constructor의 내용 뿐만 아니라 Constructor.prototype의 내용(메소드 등)을 사용할 수 있다.

```js
console.dir([1, 2, 3].constructor);
console.dir([1, 2, 3].__proto__.constructor);
```
위의 결과는 Array로 같다. 

```js
function Person(n, a) {
  this.name = n;
  this.age = a;
}

var gomu = new Person("고무곰", 30);

var gomuC1 = new gomu.__proto__.constructor("고무곰_클론1", 10);

var gomuC2 = new gomu.constructor("고무곰_클론2", 25);

var gomuProto = Object.getPrototypeOf(gomu);
var gomuC3 = new gomuProto.constructor("고무곰_클론3", 20);

var gomuC4 = new Person.prototype.constructor("고무곰_클론4", 15);
```

`Constructor.prototype`

`instance.__proto__`

`instance`

`Object.getPrototypeOf(instance)`

위 네 가지로 생성자 함수의 prototype에 접근이 가능하다.

`Constructor`

`Constructor.prototype.constructor`

`instance.__proto__.constructor`

`instance.constructor`

`Object.getPrototypeOf(instance).constructor`

으로 생성자 함수에 접근 가능하다.

instance에서 생성자 함수로 직접 접근은 불가하다. prototype을 거쳐서 갈 수 있다.

```js
function Person(n, a) {
  this.name = n;
  this.age = a;
}

var liam = new Person("리암", 50);
var noel = new Person("노엘", 54);

liam.setOlder = () => {
  this.age += 1;
};

liam.getAge = function () {
  return this.age;
};

noel.setOlder = function () {
  this.age += 1;
}

noel.getAge = function () {
  return this.age;
};
```
위 함수에서 setOlder와 getAge가 반복된다.

```js
function Person(n, a) {
  this.name = n;
  this.age = a;
}

Person.prototype.setOlder = function () {
  this.age += 1;
}
Person.prototype.getAge = function () {
  console.log(this);
  return this.age;
}

var liam = new Person("리암", 50);
var noel = new Person("노엘", 54);
```
이렇게 바꿔주면 instance는 constructor의 prototype에 접근할 수 있으므로 sm, noel 모두 사용 가능해진다.

인스턴스가 직접 달고 있을 필요가 없는 메소드들을 prototype에 올려버린 것

```js
function Person(n, a) {
  this.name = n;
  this.age = a;
}
Person.prototype.setOlder = function () {
  this.age += 1;
}
Person.prototype.getAge = function () {
  return this.age;
}

var liam = new Person("리암", 50);
var noel = new Person("노엘", 54);

Person.prototype.age = 100;
liam.setOlder(); // this === liam. (Person의 인스턴스)
liam.getAge(); // 51
liam.__proto__.setOlder(); // this === liam.__proto__ (Person.prototype의 인스턴스)
liam.__proto__.getAge(); // 101
```

하지만 Person의 인스턴스가 prototype의 프로퍼티들을 사용할 수 있다고 해서 this까지 같아지는 것은 아니다. `__proto__`가 엄연히 살아있기 때문이다.

### 6-3) Prototype Chaining

```js
console.dir([1,2,3]);
```
해보면 `Array` 안에 `__proto__` 안에 또 `__proto__`가 있는 것을 확인할 수 있다. 첫번째는 Array.prototype이고 두 번째는 Object.prototype 이다.

Array든 Number든 String이든 Boolean이든 `__proto__`를 두 번만 거치면 `Object.prototype`과 만난다. 즉, 자바스크립트 내 모든 데이터 타입은 Object.prototype의 프로퍼티를 사용할 수 있다.

또한 각자의 prototype, 즉 Array.prototype이나 String.prototype에 별도의 메소드를 지정하여 Array만 사용 가능한 메소드, String만 사용 가능한 메소드를 만들 수 있다.

그런데, `{a:1, b:2}`와 같은 객체는 중간에 prototype이 존재하지 않는다. `__proto__` 오직 한 번만 사용할 수 있고 Object.prototype에 프로퍼티를 추가하면 객체만 사용 가능한 것이 아니라 모든 타입의 데이터들이 사용 가능해진다.

그래서 `Object.create()`와 같이 생성자 함수에 속한 메소드가 많다.

```js
var arr = [1, 2, 3];

console.log(arr.toString()); // 1,2,3
```
`toString()`는 `Object.prototype`의 메소드이지만 `array`도 사용할 수 있다.

```js
var arr = [1, 2, 3];
var num = 123;
arr.toString = function () {
  return this.join("_");
}

console.log(arr.toString()); // 1_2_3
console.log(arr.__proto__.toString.call(arr)); // 1,2,3
console.log(num.toString()); // "123"
console.log(arr.__proto__.__proto__.toString.call(arr)); // [Object Array]
```

인스턴스에 새로운 메소드를 직접 만들어버리면 `__proto__` 체이닝을 하지 않고 직접 만든 메소드를 사용한다.

그래서 `arr.__proto__` 와 `num`에는 새로 만든 메소드가 적용되지 않는다.

```js
var arr = [1, 2, 3];
var num = 123;

Array.prototype.toString = function () {
  return this.join("_");
}

console.log(arr.toString()); // 1_2_3 this
console.log(arr.__proto__.toString.call(arr)); // 1_2_3
console.log(num.toString()); // "123"
console.log(arr.__proto__.__proto__.toString.call(arr)); // [Object Array]
```

배열에는 모두 적용이 되지만 여전히 num에는 적용되지 않는다. 

Array.prototype에 속한 메소드로 Array만 사용 가능하다.