class Promise2 {
  callbacks = [];
  state = "pending";
  resolve(result) {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    setTimeout(() => {
      this.callbacks.map(item => {
        if (typeof item[0] === "function") {
          item[0].call(undefined, result)
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
          item[1].call(undefined, reason)
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
    this.callbacks.push(handle);
    return undefined;
  }
}

export default Promise2;
