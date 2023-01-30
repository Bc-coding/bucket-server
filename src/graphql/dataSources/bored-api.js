const { RESTDataSource } = require("@apollo/datasource-rest");

class BoredAPI extends RESTDataSource {
  baseURL = "http://www.boredapi.com/api/activity";

  // get a random activity
  async getActivity() {
    return this.get(this.baseURL);
  }
  // get a random activity by its type
  async getActivityByType(type) {
    return this.get(`?type=${type}`);
  }
}

module.exports = BoredAPI;
