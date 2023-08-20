class SelfRequester {
  constructor(requester, request) {
    this.requester = requester;
    this.request = request;
    this.ans = null;
    this.json = value => {
      this.ans = value;
    }
  }

  async run() {
    await this.requester(this.request, {
      json: this.json,
    });

    return this.ans;
  }
}

module.exports = SelfRequester;