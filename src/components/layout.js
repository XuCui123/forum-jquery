import layoutTpl from './layout.atpl';
import header from './header';

export default () => {
  const auth = {
    isLogin: window.IS_LOGIN,
    user: window.USER
  };
  $('#root').html(layoutTpl());
  header(auth);
};