# kaspersky-nplus1

Тестовые задачи [kaspersky и nplus1](https://nplus1.ru/material/2017/12/05/kaspersky-js)

## Задача 1

Скрутить счётчик быстро недорого
Недобросовестный владелец авто пытается продать свою машину с пробегом как новую, воспользовавшись услугами хакера, который подкручивает ему пробег. Восстановите справедливость: сделайте так, чтобы машину нельзя было взломать. Абсолютно правильного ответа нет, цели можно добиться разными путями. Задача не сложная, но с огромным простором для креатива (да и для юмора :) ). Все зависит только от вас. 
Выкидывать персонажей нельзя, но можно добавлять своих. Исправьте ошибки, если они вам попадутся. И вообще, отшлифуйте код, добавьте, если хотите, новую логику, напишите все настолько круто, насколько вы это можете. Нам интересно любое решение. В идеале, вместе с решением мы ждем краткого объяснения, почему были сделаны те или иные изменения.

```javascript
function Car (name) {
  this.name = name
  this._distancePassed = 0
  this.driveHistory = []
 
  this.beep = function (message) {
    console.log(this.name + ': ' + 'Beeeeep!' + (message ? ' ' : '') + message)
  }
 
  this.drive = function (distance) {
    this.beep()
    this._distancePassed += distance
    let that = this
    this.driveHistory.push(function () {
      return { time: new Date().getTime(), currentDistance: distance, overallDistance: that._distancePassed }
    })
    console.log('Done. Kilometers passed: ' + distance + '. Overall: ' + this._distancePassed)
  }
}
 
var hacker = {
  hackCar: function (car) {
    var hackedHistory = []
    let ctr = 0
    for (var i = 0; i < car.driveHistory.length; i++) {
      var historyRecord = car.driveHistory[i]()
      hackedHistory.push(function () {
        let item = {
          time: historyRecord.time,
          currentDistance: 100,
          overallDistance: 100 * ++ctr
        }
        return item
      })
    }
    car.driveHistory = hackedHistory
    return car
  }
}
 
var owner = {
  sellCar: function () {
    var customer = getCustomer()
    if (customer.buyCar(this.car)) {
      console.log("Yay, I'm happy! I sold my old car!")
    } else {
      console.log("Aha. Let's hack this car and try to sell it again.")
      this.car = hacker.hackCar(this.car)
      this.sellCar()
    }
  },
  useCar: function () {
    this.car.drive(18000)
    this.car.drive(22500)
    this.car.drive(98118)
    console.log('Enough. I want to sell this car.')
    this.sellCar()
  }
}
 
var superCar = new Car('Supercar')
owner.car = superCar
owner.useCar()
 
var getCustomer = function () {
  var customer = {
    buyCar: function (car) {
      var summ = 0
      for (var i = 0; i < car.driveHistory.length; i++) {
        var historyRecord = car.driveHistory[i]()
        summ += historyRecord.overallDistance - historyRecord.currentDistance
      }
      if (summ > 100000) {
        console.log("I don't want to buy an old car")
        return false
      } else {
        console.log('OK! I like your car. I buy it.')
        return true
      }
    }
  }
  return customer
}
```

## Задача 2

Притча о ленивом программисте
Один ленивый веб-программист, которому не хотелось назначать обработчики для HTML-элементов, упростил себе жизнь, создав Принципиально Новую Фичу для DOM. Теперь, если в html-коде попадётся элемент <button data-exec="Worker.run"></button>, то по клику на него выполнится Worker.run(). 
Довольный веб-программист не сказал тимлиду о нововведении и коммит ушёл в продакшн. Однако программист не учёл, что dataset не фильтруется XSS-фильтрами, поэтому у каждого пользователя, способного написать комментарий, есть возможность создать элемент с этими атрибутами, вызвав тем самым любую из статических функций сайта. 

Помогите веб-программисту: нужно написать патч на js в свободной форме, который решит эту проблему. Иначе беднягу уволят.

```javascript
document.addEventListener('click', ev => {
    if (ev.target.dataset['exec']) {
        let call = ev.target.dataset['exec'];
        let fn = window;
 
        call.split('.').forEach(k => {fn = fn[k] || []});
        if (typeof fn !== 'function') fn = eval(call);
 
        return false !== fn.apply(el);
    } else {
        return true;
    }
}, true);
```
## Задача 3

Вы б ещё аудиорекламу ввели
Создатели одного малоизвестного сайта, распространяющего неформатную музыку, заметили, что вместо прослушивания песен непосредственно на сайте, некоторые пользователи используют роботов для скачивания треков напрямую. Поэтому создатели сайта решили усложнить схему получения ссылки на mp3 файл. 
После изменения кода пользователи деобфусцировали код и, увидев следующее, поняли, что им достаточно добавить небольшую прослойку для повторения атаки. 

Предложите свой вариант защиты от таких пользователей и помните, что капча уж точно будет сильно мешать простым пользователям.

```javascript
class Player {
    get list() { return this._list }
 
    getPlaylist(userID) {
        ajax('/getPlaylist', {
            userID: userID
        }, response => {
            if (response.list)
                this._list = response.list
        });
    }
 
    static getCode(token) {
        let str = "abcdefghijklmnopqrstuvwxyz" 
                + "ABCDEFGHIJKLMN0PQRSTUVWXYZ"
                + "O123456789+/=";
        if (!token || token.length % 4 == 1) {
            return false;
        }
        let out = "";
        for (let i, e, o = 0, s = 0; e = token.charAt(s++);) {
            e = str.indexOf(e);
            ~e &&
            (i = o % 4 ? 64 * i + e : e, o++ % 4) &&
            (out += 255 & i >> (-2 * o & 6));
        }
        return out;
    }
 
    play(id) {
        let _url = this.list[id];
        if (!_url) return false;
 
        let [url, token] = _url.split("?token=");
        let code = Player.getCode(token);
        if (!code) return false; 
 
        url = url + '?code=' + code;
        HTMLPlayer.play(url);
    }
}
```
