var nama = "willy";
var isStudent = true;
// module.exports = { nama, isStudent: true }; //! ini kalo mau export lebih dari satu
module.exports = {
  nama,
  isStudent,
  kalimat: () => {
    if (isStudent) {
      return nama + " adalah student";
    } else {
      return "bukan student";
    }
  },
};
