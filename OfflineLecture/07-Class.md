# class

계급. 집단. 집합.

인스턴스: 클래스가 지닌 속성을 모두 갖고 있는 구체적인 객체

### 컴퓨터

상위 클래스(superclass), 하위 클래스(subclass)

Constructor 안에 있는 프로퍼티와 메소드를 static properties, method 라고 한다.

prototype 안에 있는 것들은 (prototype)method 라고 한다.

instance에서 methods는 한 번에 접근이 가능하며 instance 자신이 this가 된다.

근데 static method, properties로는 한 방에 접근할 수 없고 this는 생성자 함수가 된다.

```js
function Person(name, age) {
  this._name = name;
  this._age = age;
}

// static method
Person.getInformations = function (instance) {
  return {
    name: instance._name,
    age: instance._age
  };
}
// method
Person.prototype.getName = function () {
  return this._name;
}
// method
Person.prototype.getAge = function () {
  return this._age;
}

var noel = new Person("노엘", 55);

console.log(noel.getName()); // "고무"
console.log(noel.getAge()); // 55

console.log(noel.constructor.getInformations(noel)); // {name: "노엘", age: 55}
console.log(Person.getInformations(noel)); // {name: "노엘", age: 55}

console.log(noel.getInformations(noel)); // TypeError
```
`getName()`, `getAge()`는 (prototype) method 이기 때문에 instance로 직접 접근 가능하고 this 또한 instance다.

`getInformations()`는 생성자 함수에 정의된 static method 이기 때문에 instance인 `noel`로 한 번에 접근할 수 없고 생성자 함수인 `Person`이나 `noel.constructor` 등으로 접근할 수 있다. 이때 this는 `Person`, 생성자 함수 자신이다.

### 상속

프로토 타입 체이닝을 이용해 상속을 구현할 수 있다.

```js
function Person(name, age) {
  this._name = name || "이름 없음";
  this._age = age || "나이 모름";
}

// method
Person.prototype.getName = function () {
  return this._name;
}
// method
Person.prototype.getAge = function () {
  return this._age;
}

function Employee(name, age) {
  this._name = name || "이름 없음";
  this._age = age || "나이 모름";
  this._postion = postion || "직책 모름";
}

// method
Employee.prototype.getName = function () {
  return this._name;
}
// method
Employee.prototype.getAge = function () {
  return this._age;
}
// method
Employee.prototype.getPostion = function () {
  return this._postion;
}
```
위의 코드에서 Employee 함수는 Person과 겹치는 것이 많다. Person 에 상속 시켜보자.

```js
function Person(name, age) {
  this._name = name || "이름 없음";
  this._age = age || "나이 모름";
}

// method
Person.prototype.getName = function () {
  return this._name;
}
// method
Person.prototype.getAge = function () {
  return this._age;
}

function Employee(name, age, position) {
  this._name = name || "이름 없음";
  this._age = age || "나이 모름";
  this.position = position || "직책 모름";
}

function Bridge() { }

Bridge.prototype = Person.prototype;
Employee.prototype = new Bridge();
Employee.prototype.constructor = Employee; // 덮어씌워진 constructor 살리기

// method.
// 맨 마지막에 정의한다. 정확히는 Employee.prototype = new Bridge(); 이후
Employee.prototype.getPostion = function () {
  return this._postion;
}

var noel = new Employee("noel", 55, "Chief");

console.log(noel);
```
상속시키기 위해 비어있는 함수인 Bridge 함수를 생성하여 연결해준다.

비어있는 함수를 이용하지 않고 하위 클래스의 protoype에 상위 클래스의 인스턴스를 직접 연결하면 하위 클래스의 `__proto__`에 상위 클래스의 프로퍼티가 남아있어 좋지 않다. 반드시 빈 함수를 통해 연결해야 한다.



이런 복잡한 과정을 한 방에 끝내는 함수
```js
var extendsClass = (function() {
  function Bridge(){}
  return function(Parent, Child) {
    Bridge.prototype = Parent.prototype;
    Child.prototype = new Bridge();
    Child.prototype.constructor = Child;
  }
})();
```
위 함수를 적용하고 Person에도 있는 name 과 age 등의 프로퍼티를 상속하려면,
```js
var extendsClass = (function () {
  function Bridge() { }
  return function (Parent, Child) {
    Bridge.prototype = Parent.prototype;
    Child.prototype = new Bridge();
    Child.prototype.constructor = Child;
    Child.prototype.superClass = Parent; // 부모의 프로퍼티 상속
  }
})();

function Person(name, age) {
  this._name = name || "이름 없음";
  this._age = age || "나이 모름";
}

// method
Person.prototype.getName = function () {
  return this._name;
}
// method
Person.prototype.getAge = function () {
  return this._age;
}

function Employee(name, age, position) {
  this.superClass(name, age); // 부모의 프로퍼티 상속
  this.position = position || "직책 모름";
}


extendsClass(Person, Employee);

// subclass method.
Employee.prototype.getPostion = function () {
  return this._postion;
}

var noel = new Employee("noel", 55, "Chief");

console.log(noel);
```

ES6+ 에서 Class 가 등장해서 prototype으로 class를 흉내내는 것은 실무에서 의미가 없을 수도 있으나 자바스크립트 기본 원리를 이해하는 데는 탁월하다.

#### 참고 

즉시 실행 함수 작성법.
> https://developer.mozilla.org/ko/docs/Glossary/Function

```js
(function () = {

})()

(function () = {

}())
```