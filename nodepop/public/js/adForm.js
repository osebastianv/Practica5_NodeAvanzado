// DECLARACIONES DE VARIABLES
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const form = document.getElementsByName("ad-new")[0];
console.log(form);

//Solo se usa en newAd.html
if (typeof form != "undefined") {
  console.log("SI");
  const nameInput = document.getElementById("nombre");
  const priceInput = document.getElementById("precio");

  const typeRadios = document.getElementsByName("venta");
  const tagChecks = document.getElementsByName("tags");

  const imageInput = document.getElementsByName("imagen");
  console.log("imageInput", imageInput);

  // DECLARACIÓN DE EVENTOS
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Envío de datos
  form.addEventListener("submit", sendAd);

  // FUNCIONES
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Función de envío
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
      return false;
    }

    // Validamos nombre
    if (priceInput.checkValidity() === false) {
      alert(
        "Escriba un precio de artículo, por favor. Recuerde que debe estar entre 1 y 50.000 euros"
      );
      priceInput.focus();
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
      return false;
    }

    // Validamos imagen
    console.log(imageInput[0].files);
    if (imageInput[0].files.length === 0) {
      alert("Seleccione una foto para el artículo, por favor");
      return false;
    }

    return true;
  }
}
