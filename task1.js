"use strict";

class Car {
  constructor(name = '') {
    this.name = name;
    if (!Boolean(this.name)) {
      this.name = 'new Car';
    }
    this._distancePassed = 0;
    this._driveHistory = [];
    return this;
  }

  get distancePassed() {
    return this._distancePassed;
  }

  get driveHistory() {
    return this._driveHistory;
  }

  beep(message = '') {
    const { name } = this;
    console.log(`${name}: Beeeeep!${Boolean(message) ? ' ' + message : ''}`);
  }

  drive(distance = 0) {
    if (Number(distance) < 0)
      return false;
    this.beep();
    this._distancePassed += Number(distance);
    const record = {
      time: new Date().getTime(),
      currentDistance: Number(distance),
      overallDistance: this._distancePassed
    };

    this._driveHistory.push(() => {
      return record;
    });
    console.log(`Done. Kilometers passed: ${Number(distance)}. Overall: ${this.distancePassed}`);
    return true;
  }
}

const hackMethod1 = function (car) {
  let hackedHistory = car.driveHistory.map((record, key) => {
    let historyRecord = record();
    return function () {
      let item = {
        time: historyRecord.time,
        currentDistance: 100,
        overallDistance: 100 * (key + 1)
      };
      return item;
    };
  });
  car.driveHistory = hackedHistory;
  return car;
};

const hackMethod2 = function (car) {
  for (let i = 0; i < car.driveHistory.length; i++) {
    let historyRecord = car.driveHistory[i]();
    car.driveHistory[i] = () => {
      return {
        time: historyRecord.time,
        currentDistance: 100,
        overallDistance: 100 * (i + 1)
      }
    };
  }
};

class Hacker {
  hackCar(car) {
    // hackMethod1(car);
    hackMethod2(car);
    return car;
  }
}

class People {
  constructor(car = null) {
    this.car = car;
    this.distanceMaxLimit = 100000;
    return this;
  }

  chkCar(car) {
    let sum = 0;
    let finalOverallDistance = 0;
    for (let i = 0; i < car.driveHistory.length; i++) {
      let historyRecord = car.driveHistory[i]();
      sum += Number(historyRecord.currentDistance);
      finalOverallDistance = Number(historyRecord.overallDistance);
    }
    if (Number(sum) !== Number(finalOverallDistance) ||
        Number(finalOverallDistance) !== Number(car.distancePassed) ||
        sum > this.distanceMaxLimit) {
      return false;
    } else {
      return true;
    }
  }

  useCar() {
    if (!this.car) {
      console.log("I don't have a car!");
      return;
    }
    this.car.drive(100);
    this.car.drive(200);
    this.car.drive(300);
  }
}

class Customer extends People {
  constructor() {
    super(null);
  }

  buyCar(car) {
    if (this.chkCar(car)) {
      console.log('OK! I like your car. I buy it.');
      return true;
    }
    else {
      console.log("I don't want to buy an old car");
      return false;
    }
  }
}

class Owner extends People {
  constructor(car) {
    super(car);
  }

  sellCar() {
    if (!Boolean(this.car)) {
      console.log("I don't have a car!");
    }
    const customer = new Customer();
    if (customer.buyCar(this.car)) {
      console.log("Yay, I'm happy! I sold my old car!");
    } else {
      console.log("Aha. Let's hack this car and try to sell it again.");
      const hacker = new Hacker();
      this.car = hacker.hackCar(this.car);
      if (this.chkCar(this.car)) {
        this.sellCar();
      }
      else {
        console.log("F*ck ;(");
      }
    }
  }

  useCar() {
    this.car.drive(18000);
    this.car.drive(22500);
    this.car.drive(98118);
    console.log('Enough. I want to sell this car.');
    this.sellCar();
  }
}

const superCar = new Car('Supercar');
const owner = new Owner(superCar);
owner.useCar();
