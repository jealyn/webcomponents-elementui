export default class ElButton extends HTMLElement {
  // 需要监听的属性
  static get observedAttributes() {
    return [
      "disabled",
      "type",
      "icon",
      "loading",
      "size",
      "plain",
      "round",
      "circle",
    ];
  }

  constructor() {
    // 必须首先调用 super 方法，建立正确的原型链继承关系
    super();
    // 将shadow root附加到custom element上
    this.attachShadow({ mode: "open" });
    // 操作shadow root内部DOM结构
    this.renderHTML = (shadowRoot) => {
      shadowRoot.innerHTML = `
    <link rel="stylesheet" href="style/element-ui-button.css" />
        <button
          class="el-button el-button--${this.getAttribute("type") || "default"
        }${this.getAttribute("plain") !== null ? " is-plain" : ""}${this.getAttribute("round") !== null ? " is-round" : ""
        }${this.getAttribute("circle") !== null ? " is-circle" : ""}${this.disabled ? " is-disabled" : ""
        }${this.getAttribute("size") !== null
          ? " el-button--" + this.getAttribute("size")
          : ""
        }" 
          id="button"
        >
        ${this.getAttribute("loading") !== null
          ? '<i class="el-icon-loading"></i>'
          : ""
        }
        ${!this.getAttribute("loading") !== null && this.getAttribute("icon")
          ? "<i class=" + this.getAttribute("icon") + "></i>"
          : ""
        }<span><slot><span></span></slot></span>
        </button>
        `;
    };
    this.renderHTML(this.shadowRoot);
    /**
     * @description 点击事件处理函数，通过dispatchEvent分发出去
     * @param {Event} e 事件对象event
     */
    this.handleClick = (e) => {
      this.dispatchEvent(new CustomEvent("btn-click", { detail: e }));
    };
  }
  // 定义一系列的属性getter
  get disabled() {
    return (
      this.getAttribute("loading") !== null ||
      this.getAttribute("disabled") !== null
    );
  }

  /**
   * @description 元素首次被插入到DOM节点上时调用，相当于vue的mounted
   * @reference https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements#%E4%BD%BF%E7%94%A8%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0
   */
  connectedCallback() {
    this.btn = this.shadowRoot.getElementById("button");
    // 添加事件监听程序
    this.btn?.addEventListener("click", this.handleClick, false);
  }

  /**
   * @description 元素从DOM节点删除时调用，相当于vue的unmounted
   * @reference https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements#%E4%BD%BF%E7%94%A8%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0
   */
  disconnectedCallback() {
    // 移除事件监听程序
    this.btn?.removeEventListener("click", this.handleClick);
  }

  /**
   * @description 在增加、删除或者修改某个属性时被调用。相当于vue的updated
   * @reference https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements#%E4%BD%BF%E7%94%A8%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0
   */
  attributeChangedCallback(name, oldValue, newValue) {
    this.renderHTML(this.shadowRoot);

    if (["loading", "disabled"].includes(name) && this.btn) {
      if (newValue !== null) {
        this.btn.setAttribute("disabled", "disabled");
      } else {
        this.btn.removeAttribute("disabled");
      }
    }
  }
}

// 定义 custom element
customElements.define("el-button", ElButton);
