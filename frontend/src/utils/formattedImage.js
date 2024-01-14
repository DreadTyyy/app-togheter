function checkFormattedImage(data) {
  const type = ["jpg", "png", "jpeg", "jfif"];
  const dataType = data.type;
  const splitType = dataType.split("/");
  const dataSize = data.size;
  if (!type.includes(splitType[1])) {
    alert("Silahkan masukkan format gambar!");
    return false;
  }
  if (dataSize >= 5000000) {
    alert("Maksimal ukuran gambar adalah 5mb!");
    return false;
  }
  return true;
}

export default checkFormattedImage;
