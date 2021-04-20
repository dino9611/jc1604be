module.exports = {
  getMessages: (req, res) => {
    res.status(200).send(req.app.msg);
  },
  sendMessage: (req, res) => {
    req.app.msg.push(req.body);
    req.app.io.emit("chat message", req.app.msg);
    res.status(200).send({ message: "Send Message Success" });
  },
  clearMessage: (req, res) => {
    req.app.msg = [];
    req.app.io.emit("chat message", req.app.msg);
    res.status(200).send({ message: "Message Clear" });
  },
};
