import { Cookies } from '../utils';

/**
 * 使用cookie檢查是否為登入狀態
 */
export default () => Number(Cookies.get('loggedIn'));
