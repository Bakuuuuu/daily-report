class Person {
  constructor(age) {
    this.age = age
  }
  getAge () {
    return '我的年龄是：' + this.age;
  }
}

class demo extends Person {
  constructor(name, age, sex) {
    super(age);
    this.sex = sex;
    this.name = name;
  }
  fn () {
    return this.name + ' ' + super.getAge();
  }
}
let d = new demo('里斯', 18, '男');
console.log(d.fn());