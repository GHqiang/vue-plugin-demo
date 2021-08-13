import Vue from 'vue'
// 调用方式分为以下几种情况(最后一种用起来最舒服且方便)

// 1.不需要参数和事件对象   v-debounce="search"
// 2.不需要参数需要事件对象  v-debounce="[search,'even']"   或  v-debounce="{func:search,isEven:true}
// 3.需要参数和事件对象      v-debounce="[search,1,'even']"  或  v-debounce="{func:search,params:[1,3],isEven:true}"
// 4.需要参数不需要事件对象   v-debounce="() =>{search(1)}"
// 5.禁止事件冒泡             v-debounce:stop="search"

// 防抖：规定时间内最后一次执行
Vue.directive('debounce', {
  inserted: function (el, binding, vnode) {
    let timer
    el.addEventListener('click', (even) => {
      // arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
      if (binding.arg === 'stop') even.stopPropagation()
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        // 关键点：如果调用时候不需要获取事件对象建议都用函数方式调用
        if (Object.prototype.toString.call(binding.value) === '[object Function]') {
          binding.value()
        } else if (Object.prototype.toString.call(binding.value) === '[object Array]') {
          // 关键点：vue的自定义指令传递的参数binding如果是一个数组，则第一个是事件,后面是参数，最后一位是是否需要事件对象的标识
          const func = binding.value[0]
          // 获取后面的参数
          const params = binding.value.filter((item, inx) => inx > 0 && inx !== binding.length - 1)
          // console.log('params', params, even)
          if (binding.value[binding.value.length - 1] === 'even') {
            params.push(even)
            // console.log('updateParams', params)
            func.apply(this, params)
          } else {
            func()
          }
        } else if (Object.prototype.toString.call(binding.value) === '[object Object]') {
          const { func, params, isEven } = binding.value
          if (isEven) {
            params.push(even)
            // console.log('updateParams', params)
            func.apply(this, params)
          } else {
            func()
          }
        }
      }, 500)
    })
  }
})

// 节流：规定时间内第一次执行
Vue.directive('throttling', {
  // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted: function (el, binding) {
    el.time = 500
    el.addEventListener('click', (even) => {
      // arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
      if (binding.arg === 'stop') even.stopPropagation()
      const nowTime = new Date().getTime()
      if (!el.preTime || nowTime - el.preTime > el.time) {
        el.preTime = nowTime
        if (Object.prototype.toString.call(binding.value) === '[object Function]') {
          binding.value()
        } else if (Object.prototype.toString.call(binding.value) === '[object Array]') {
          // 关键点：vue的自定义指令传递的参数binding如果是一个数组，则第一个是事件,后面是参数，最后一位是是否需要事件对象的标识
          const func = binding.value[0]
          // 获取后面的参数
          const params = binding.value.filter((item, inx) => inx > 0 && inx !== binding.length - 1)
          // console.log('params', params, even)
          if (binding.value[binding.value.length - 1] === 'even') {
            params.push(even)
            // console.log('updateParams', params)
            func.apply(this, params)
          } else {
            func()
          }
        } else if (Object.prototype.toString.call(binding.value) === '[object Object]') {
          const { func, params, isEven } = binding.value
          if (isEven) {
            params.push(even)
            // console.log('updateParams', params)
            func.apply(this, params)
          } else {
            func()
          }
        }
      }
    })
  }
})

// 也可以再vue组件内局部使用directives: {throttle:{}}
Vue.directive('throttle', {
  inserted: (el, binding) => {
    const throttleTime = binding.value || 1000 // 防抖时间
    el.addEventListener('click', event => {
      if (el.nodeName === 'BUTTON' || el.type === 'button') {
        if (!el.disabled) {
          el.disabled = true
          setTimeout(() => {
            el.disabled = false
          }, throttleTime)
        }
      } else {
        // 设置pointer-events:none后，相当于该元素已经不存在了,阻止了div/span的onclick事件。点击了子节点是无效的，但同时相当于点击了其父节点。
        el.parentNode.style.pointerEvents = 'none'
        el.style.pointerEvents = 'none'
        setTimeout(() => {
          el.parentNode.style.pointerEvents = 'auto'
          el.style.pointerEvents = 'auto'
        }, throttleTime)
      }
    }, false)
  }
})
// 也可以再vue组件内局部使用directives: {debounce:{}} 最后一次执行
Vue.directive('debounce ', {
  inserted: function (el, binding) {
    let timer
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, 1000)
    })
  }
})
