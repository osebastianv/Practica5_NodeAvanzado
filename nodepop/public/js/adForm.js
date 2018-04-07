// DECLARACIONES DE VARIABLES
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const form = document.getElementsByName("ad-new")[0];
console.log(form);

//Solo se usa en newAd.html
if (typeof form != "undefined") {
  console.log("SI");
  const nameInput = document.getElementById("ad-name");
  const priceInput = document.getElementById("ad-price");

  const typeRadios = document.getElementsByName("ad-type");
  const tagChecks = document.getElementsByName("ad-tag");

  const imageInput = document.getElementsByName("imagen");
  console.log("imageInput", imageInput);

  /*  const adTypeInput = {
    adType1: document.getElementById("ad-type-1"),
    adType2: document.getElementById("ad-type-2")
  };

  const adTagInput = {
    adTag1: document.getElementById("ad-tag-1"),
    adTag2: document.getElementById("ad-tag-2"),
    adTag3: document.getElementById("ad-tag-2"),
    adTag4: document.getElementById("ad-tag-2")
  };*/

  // DECLARACIÓN DE EVENTOS
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Envío de datos de contacto
  form.addEventListener("submit", sendAd);

  // FUNCIONES
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Función de envío de contactos
  async function sendAd(event) {
    var adOK = checkAd(event);
    if (adOK === false) {
      event.preventDefault();
      return false;
    }

    sendButton.setAttribute("disabled", "");
    event.preventDefault();

    let formData = new FormData(form);
    formData.append("imagen", imageInput);

    const response = await fetch("/newAd", {
      method: "post",
      body: formData
    });
    console.log(response);

    setTimeout(function() {
      sendButton.removeAttribute("disabled");
    }, 1000);
  }

  function checkAd(event) {
    // Validamos nombre
    if (nameInput.checkValidity() === false) {
      alert("Escriba un nombre de artículo, por favor");
      nameInput.focus();
      //event.preventDefault();
      return false;
    }

    // Validamos nombre
    if (priceInput.checkValidity() === false) {
      alert("Escriba un precio de artículo, por favor");
      priceInput.focus();
      //event.preventDefault();
      return false;
    }

    // Validamos type radios (no necesario, uno por defecto)
    let radiovalid = false;
    let i = 0;
    while (!radiovalid && i < typeRadios.length) {
      if (typeRadios[i].checked) radiovalid = true;
      i++;
    }

    if (radiovalid === false) {
      alert("Seleccione si el artículo es de venta o de compra, por favor");
      //event.preventDefault();
      return false;
    }

    // Validamos tag checks
    let checkvalid = false;
    i = 0;
    while (!checkvalid && i < tagChecks.length) {
      if (tagChecks[i].checked) checkvalid = true;
      i++;
    }

    if (checkvalid === false) {
      alert("Seleccione al menos un tag por artículo, por favor");
      //event.preventDefault();
      return false;
    }

    // Validamos imagen
    console.log(imageInput[0].files);
    if (imageInput[0].files.length === 0) {
      alert("Seleccione una foto para el artículo, por favor");
      //event.preventDefault();
      return false;
    }

    return true;
  }
}
