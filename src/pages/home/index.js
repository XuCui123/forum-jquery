import layout from '../../components/layout';
import homeTpl from './home.atpl';
import { timeAgo } from '../../utils';
import  './index.less';
const SIZE = 2;

export default {
  data: {
    timeAgo,
    list: [],
    page: 1,
    size: SIZE,
    count: 0,
    ceil: Math.ceil
  },
  init() {
    this.bind();
    this.load();
    layout();
  },
  bind() {
    $(document).on('click', '.J_topicPager a', (e) => {
      e.preventDefault();
      const dom = $(e.currentTarget);
      this.data.page = dom.data('page');
      this.load();
    });
  },
  load() {
    const { page } = this.data;
    $.get('/topics', {
      limit: SIZE,
      offset: (page - 1) * SIZE
    }).done(({ data, users}) => {
      const { rows, count } = data;
      const userMap = users.reduce((prev, cur) => ({ ...prev, [cur.id]: cur }), {});
      this.data.count = count;
      this.data.list = rows.map(item => {
        return { ...item, user: userMap[item.userId] };
      });
      this.render();
    });
  },
  render() {
    $('.J_main')
      .html(homeTpl(this.data))
      .fadeIn(500);
  }
};