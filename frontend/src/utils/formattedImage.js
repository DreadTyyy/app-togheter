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

async function getImageBlob(url) {
  const image = await fetch(url, {
    method: "GET",
  });
  const blob = await image.blob();
  const data = URL.createObjectURL(blob);
  return data;
}

export { checkFormattedImage, getImageBlob };
