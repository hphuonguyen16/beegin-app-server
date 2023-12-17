const Pusher = require("pusher");
console.log("tmep", process.env.NODE_ENV);
console.log("appid", process.env.PUSHER_APP_ID);
const pusher = new Pusher({
  appId: "1726124",
  key: "347a18ba158ea55c148d",
  secret: "935e6d0a12fb024b0a0c",
  cluster: "ap1",
  useTLS: true,
});

module.exports = pusher;
