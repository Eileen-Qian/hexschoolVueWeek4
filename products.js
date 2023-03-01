import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      api: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'qian14',
      products: [],
      productDetail: {},
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false //用來確認是新增或是編輯
    };
  },
  methods: {
    checkLogin() {
      axios.post(`${this.api}/api/user/check`)
        .then((response) => {
          // console.log(response);
          this.showProducts();
        })
        .catch((error) => {
          // console.log(error.data.message);
          window.location = 'login.html';
        })
    },
    showProducts() {
      axios.get(`${this.api}/api/${this.apiPath}/admin/products`)
        .then((response) => {
          // console.log(response.data.products);
          this.products = response.data.products;
        }).catch((error) => {
          alert(error.data.message);
        })
    },
    showProductDetail(productDetail) {
      this.productDetail = productDetail;
    },
    openModal(status, product) {
      if (status === 'create') {
        productModal.show();
        this.isNew = true;
        // 新增時會帶入初始化資料
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (status === 'edit') {
        productModal.show();
        this.isNew = false;
        // 編輯的話，會帶入當前要編輯的原資料
        this.tempProduct = { ...product };
      } else if (status === 'delete') {
        delProductModal.show();
        this.tempProduct = { ...product }; // 取 id 使用
      }
    },
    // 新增或編輯修改產品
    updateProduct() {
      let url = `${this.api}/api/${this.apiPath}/admin/product`;
      // 用 this.isNew 判斷 API 要 POST 還是 PUT
      let method = 'post';
      if (!this.isNew) {
        url = `${this.api}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }
      axios[method](url, { data: this.tempProduct })
        .then(() => {
          this.showProducts();
          productModal.hide(); //關閉 modal        
        })
    },
    deleteProduct() {
      const url = `${this.api}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
        .then(() => {
          this.showProducts();
          delProductModal.hide(); //關閉 modal        
        })
        .catch((error) => {
          alert(error.response.data.message);
        })
    },
    createImg(){
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)qianToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // console.log(token);
    axios.defaults.headers.common['Authorization'] = token;
    this.checkLogin();

    // 初始化 bootstrap modal
    productModal = new bootstrap.Modal('#productModal');
    delProductModal = new bootstrap.Modal('#delProductModal');
  }
}).mount('#app');
