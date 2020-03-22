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
  this.superClass(name, age);
  this.position = position || "직책 모름";
}


extendsClass(Person, Employee);

// subclass method.
Employee.prototype.getPostion = function () {
  return this._postion;
}

var noel = new Employee("noel", 55, "Chief");

console.log(noel);