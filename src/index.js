import { matchPath } from './utils';
import home from './pages/home';
import topic from './pages/topic';
import './index.less';

window.$ = window.jQuery = require('jquery');

$(() => {
  if(matchPath(window.location.pathname, '/')) {
    home.init();
  }
  const matched = matchPath(window.location.pathname, '/topic/:id');
  if(matched) {
    topic.init(matched.params.id);
  }
});