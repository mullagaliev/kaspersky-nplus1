const HTMLPlayer = {
  play: function (url) {
    console.log(`play track from url:${url}`);
  }
};

const ajax = function (url, data, cb) {
  switch (url) {
    case '/getPlaylist':
      cb({
        list: [
          'http://site.com?token=1234',
          'http://site.com?token=1235',
          'http://site.com?token=1236'
        ]
      });
      break;
    default:
      cb({
        url: ['http://site.com/originalUrl']
      });
  }
};

class Player {
  constructor(userID) {
    this.userID = userID;
    this._list = ['http://site.com?token=2342'];
    this._UrlList = [];
  }

  get list() {
    return this._list;
  }

  /**
   * Метод для получения списка token'ов композиций для метода '/getTrackUrl'
   */
  getPlaylist() {
    ajax('/getPlaylist', {
      userID: this.userID
    }, response => {
      if (response.list)
        this._list = response.list
    });
  }

  /**
   * Метод для получения оригинальной ссылки на трек
   * TODO На стороне сервера должно стоять ограничение на кол-во запросов к методу '/getTrackUrl'
   * TODO Параметр 'userID' добавлен для ограничения кол-во запросов для пользователя
   * @param trackId - id композиции
   * @param token - уникальный токен пользователя для получения трека с trackId
   * @param cb - callback
   */
  getTrackUrl(trackId, token, cb) {
    ajax('/getTrackUrl', {
      userID: this.userID,
      token: token
    }, (response) => {
      if (response.url) {
        this._UrlList[trackId] = response.url;
        cb(response.url);
      }
    });
  }

  play(id) {
    if (Boolean(this._UrlList[id])) {
      HTMLPlayer.play(url);
    }
    else {
      let _url = this.list[id];
      if (!_url) {
        return false;
      }
      let [url, token] = _url.split("?token=");

      this.getTrackUrl(id, token, (url) => {
        HTMLPlayer.play(url);
      });
    }
  }
}

const player = new Player();

player.play(0);