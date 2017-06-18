import headerTpl from './header.atpl';

export default (auth) => {
  $('.J_header').html(headerTpl(auth));
};