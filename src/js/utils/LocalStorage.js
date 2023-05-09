/**
 * 當瀏覽器不支援 local storage 則使用 cookie
 */
import Cookies from 'js-cookie';
import ls from 'local-storage';

const hasStorage = ls.set('foo', 'bar');
ls.remove('foo');

export default {
  set: hasStorage
    ? ls.set
    : (name, value) => Cookies.set(name, JSON.stringify(value)),
  get: hasStorage
    ? ls.get
    : ((name) => JSON.parse(Cookies.get(name))),
  removeItem: hasStorage ? ls.remove : Cookies.remove,
  clear: ls.clear,
};
