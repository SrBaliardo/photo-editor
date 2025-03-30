const newImage = document.getElementById("btnNewImage");
const inputFile = document.querySelector("input[type=file]");
const image = document.querySelector(".container-image img");
const buttonsFilter = document.querySelectorAll(".container-filters button");
const range = document.querySelector("input[type=range]");
const rangeValue = document.getElementById("rangeValue");
const btnResetFilters = document.getElementById("btnResetFilters");
const btnSubmit = document.getElementById("btnSubmit");
const originalWidthValue = document.getElementById("originalWidthValue");
const originalHeightValue = document.getElementById("originalHeightValue");
const toResizeWidth = document.getElementById("toResizeWidth");
const toResizeHeight = document.getElementById("toResizeHeight");

let rotate;
let flipY;
let flipX;

let filterActive;

let filters;

btnSubmit.style = "visibility: hidden";

toResizeWidth.disabled = true;
toResizeHeight.disabled = true;

btnResetFilters.onclick = () => init();

init();

function init() {
  filters = {
    Brilho: { value: 100, max: 200 },
    Contraste: { value: 100, max: 200 },
    Saturação: { value: 100, max: 200 },
    Cinza: { value: 0, max: 100 },
    Inversão: { value: 0, max: 100 },
  };

  rotate = 0;
  flipY = 1;
  flipX = 1;

  filterActive = "Brilho";

  rangeValue.innerHTML = 100;
  range.max = 200;
  range.value = 100;

  image.style.transform = "";
  image.style.filter = "";

  toResizeWidth.value = originalWidthValue.value;
  toResizeHeight.value = originalHeightValue.value;

  document.querySelector(".active").classList.remove("active");
  document.getElementById("filterDefault").classList.add("active");
}

buttonsFilter.forEach((item) => {
  item.onclick = () => {
    document.querySelector(".active").classList.remove("active");

    item.classList.add("active");

    filterActive = item.innerHTML;

    range.max = filters[filterActive].max;
    range.value = filters[filterActive].value;

    rangeValue.innerHTML = range.value;
  };
});

newImage.onclick = () => inputFile.click();

inputFile.onchange = () => loadNewImage();

function loadNewImage() {
  let file = inputFile.files[0];

  if (file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      image.src = img.src;
      originalWidthValue.value = img.width;
      originalHeightValue.value = img.height;

      toResizeWidth.value = img.width;
      toResizeHeight.value = img.height;

      btnSubmit.style = "visibility: visible";

      toResizeWidth.disabled = false;
      toResizeHeight.disabled = false;
    };
  }

  init();
}

range.oninput = () => {
  filters[filterActive].value = range.value;
  rangeValue.innerHTML = range.value;

  image.style.filter = `
    brightness(${filters["Brilho"].value}%)
    contrast(${filters["Contraste"].value}%)
    saturate(${filters["Saturação"].value}%)
    grayscale(${filters["Cinza"].value}%)
    invert(${filters["Inversão"].value}%)
    `;
};

function handleDirection(type) {
  if (type === "rotateRight") {
    rotate += 90;
  } else if (type === "rotateLeft") {
    rotate -= 90;
  } else if (type === "reflectY") {
    flipY = flipY === 1 ? -1 : 1;
  } else if (type === "reflectX") {
    flipX = flipX === 1 ? -1 : 1;
  }

  image.style.transform = `rotate(${rotate}deg) scale(${flipY}, ${flipX})`;
}

btnSubmit.onclick = () => download();

function download() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let fileName = inputFile.files[0]?.name || "image";

  canvas.width = parseInt(toResizeWidth.value) || image.naturalWidth;
  canvas.height = parseInt(toResizeHeight.value) || image.naturalHeight;

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = `${fileName}_edited.png`;
  link.href = canvas.toDataURL();
  link.click();
}
