class Promise2 {
  callbacks = [];
  state = "pending";
  resolve(result) {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    setTimeout(() => {
      this.callbacks.map(item => {
        if (typeof item[0] === "function") {
          const x = item[0].call(undefined, result)
          item[2].resolveWith(x)
        }
        return item;
      })
    }, 0);
  }
  reject(reason) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    setTimeout(() => {
      this.callbacks.map(item => {
        if (typeof item[1] === "function") {
          const x = item[1].call(undefined, reason)
          item[2].resolveWith(x)
        }
        return item;
      })
    }, 0);
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("我只接受函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(succeed?, fail?) {
    const handle = []
    if (typeof succeed === "function") {
      handle[0] = succeed;
    }
    if (typeof fail === "function") {
      handle[1] = fail;
    }
    handle[2] = new Promise2(() => { });
    this.callbacks.push(handle);
    return handle[2];
  }

  resolveWith(x) {
    if (this === x) {
      return this.reject(new TypeError("不能调用自身"))
    }
    if (x instanceof Promise2) {
      x.then((result) => {
        this.resolve(result)
      }, (reason) => {
        this.reject(reason)
      })
    }
    if (x instanceof Object) {
      let then
      try {
        then = x.then
      } catch (e) {
        this.reject(e)
      }
      if (then instanceof Function) {
        try {
          x.then((y) => {
            this.resolveWith(y)
          }, (r) => {
            this.reject(r)
          })
        } catch (e) {
          this.reject(e)
        }
      } else {
        this.resolve(x)
      }
    } else {
      this.resolve(x)
    }
  }
}

export default Promise2;
