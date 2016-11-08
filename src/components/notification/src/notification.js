import Vue from 'vue';
let NotificationConstructor = Vue.extend(require('./notification.vue'));

let Notification = (function() {
    let self = {};
    const defOptions = {
        type: 0, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: '信息',
        content: '',
        area: 'auto',
        offset: 'auto',
        icon: -1,
        btn: '确定',
        time: 0,
        shade: true,
        yes: '',
        cancel: '',
    }
    self.instances = {};
    let seed = 1;

    self.open = function(options) {
        options = mergeJson(options, defOptions);
        let id = 'notification_' + seed++;
        options.id = id;
        let instance = new NotificationConstructor({
            data: options
        });
        instance.id = id;
        instance.vm = instance.$mount();
        self.instances[id] = instance;
        document.body.appendChild(instance.vm.$el);
        return id;
    };
    /**
     * alert
     * @param  {[type]} content [description]
     * @param  {[type]} options [description]
     * @param  {[type]} yes     [description]
     * @return {[type]}         [description]
     */
    self.alert = function(content, options, yes) {
            switch (typeof(options)) {
                case "function":
                    yes = options;
                    options = {};
                    break;
                case "object":
                    break;
                default:
                    options = {};
                    break;
            }
            yes = typeof(yes) == 'function' ? yes : '';

            options.content = content || '';
            options.yes = yes;
            return self.open(options);
        }
        /**
         * alert
         * @param  {[type]} content [description]
         * @param  {[type]} options [description]
         * @param  {[type]} yes     [description]
         * @return {[type]}         [description]
         */
        self.confirm = function(content, options, yes, cancel) {
                switch (typeof(options)) {
                    case "function":
                        yes = options;
                        options = {};
                        break;
                    case "object":
                        break;
                    default:
                        options = {};
                        break;
                }
                yes = typeof(yes) == 'function' ? yes : '';
                cancel = typeof(cancel) == 'function' ? cancel : '';

                options.content = content || '';
                options.yes = yes;
                options.cancel = cancel;
                return self.open(options);
            }

        /**
         * 关闭一个弹窗
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
    self.close = function(id) {
            delete self.instances[id];
            document.getElementById(id).remove();
        }
        /**
         * 关闭一个弹窗
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
    self.closeAll = function() {
            for (var k in self.instances) {
                document.getElementById(k).remove();
            }
            self.instances = {};
        }
        /**
         * get offset
         */
    function getOffset() {
        let offset = [];
        offset.push(document.body.clientWidth);
        offset.push(document.body.clientHeight);
        return offset;
    }

    /**
     * 合并json
     * @method mergeJson
     * @param  {[type]}  optons [description]
     * @param  {[type]}  def    [description]
     * @return {[type]}         [description]
     */
    function mergeJson(options, def) {
        for (let key in def) {
            if (options[key] == undefined) {
                options[key] = def[key];
            }
        }
        return options;
    }

    return self;
}());

module.exports = Notification;
