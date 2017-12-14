const Worker = {
  run: function () {
    alert(1);
  },
  sendMoney: function () {
    alert('Sent');
  }
};

const el = {};

document.addEventListener('click', ev => {
  if (ev.target.dataset['exec']) {
    let call = ev.target.dataset['exec'];
    if (call !== 'Worker.run')
      return true;
    let fn = window;
    call.split('.').forEach(k => {
      fn = fn[k] || [];
    });
    if (typeof fn !== 'function') {
      fn = eval(call);
    }
    return false !== fn.apply(el);
  } else {
    return true;
  }
}, true);
