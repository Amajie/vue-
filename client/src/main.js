import Vue from 'vue'
import App from './App'
import MintUi from 'mint-ui'


// 文件
import router from './router'
import store from './store'
import './assets/index.less'
// 适配插件
import 'lib-flexible'
// mintui
Vue.use(MintUi)
import {Toast, Indicator, MessageBox, Tabbar, TabItem, Cell, Field, Button, 
  Radio, Popup, Picker, Badge, Switch, IndexList, IndexSection} from 'mint-ui'
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Cell.name, Cell)
Vue.component(Field.name, Field)
Vue.component(Button.name, Button)
Vue.component(Radio.name, Radio)
Vue.component(Popup.name, Popup)
Vue.component(Picker.name, Picker)
Vue.component(Badge.name, Badge)
Vue.component(Switch.name, Switch)
Vue.component(IndexList.name, IndexList)
Vue.component(IndexSection.name, IndexSection)

Vue.prototype.Toast = Toast
Vue.prototype.Indicator = Indicator
Vue.prototype.MessageBox = MessageBox

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
