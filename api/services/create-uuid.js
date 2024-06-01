const { v4: uuidv4 } = require("uuid");

module.exports = {
  generateUniqueID: function () {
    let id = "O" + uuidv4().replace(/-/g, "").substr(1, 9); // Bắt đầu bằng 'O' và có 9 ký tự tiếp theo

    return id.toUpperCase(); // Chuyển đổi ID thành chữ hoa để đảm bảo duy nhất
  },
};
