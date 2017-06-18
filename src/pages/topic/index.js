import layout from '../../components/layout';
import { timeAgo } from '../../utils';
import mainTpl from './main.atpl';
import topicTpl from './topic.atpl';
import repliesTpl from './replies.atpl';
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
  init(id) {
    this.data.id = id;
    this.render();
    this.bind();
    this.loadTopic();
    this.loadReplies();
  },
  bind() {
    $(document).on('click', '.J_replyPager a', (e) => {
      e.preventDefault();
      const dom = $(e.currentTarget);
      this.data.page = dom.data('page');
      this.loadReplies();
    });
  },
  loadTopic() {
    const { id } = this.data;
    $.get(`/topics/${id}`).done((topic) => {
      this.data.topic = topic;
      this.renderTopic();
    });
  },
  loadReplies() {
    const { id, page } = this.data;
    $.get(`/topics/${id}/replies`, {
      limit: SIZE,
      offset: (page - 1) * SIZE
    }).done(({ data, users }) => {
      const { rows, count } = data;
      const userMap = users.reduce((prev, cur) => ({ ...prev, [cur.id]: cur }), {});
      this.data.count = count;
      this.data.list = rows.map(item => {
        return { ...item, user: userMap[item.userId] };
      });
      this.renderReplies();
    });
  },
  renderTopic() {
    $('.J_topic')
      .html(topicTpl(this.data));
  },
  renderReplies() {
    $('.J_replies')
      .html(repliesTpl(this.data));
  },
  render() {
    layout();
    $('.J_main')
      .html(mainTpl())
      .fadeIn(500);
  }
}