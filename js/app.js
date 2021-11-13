let restante = 0

const guardarPresupuesto = () => {

  let presupuesto = parseInt(document.querySelector("#presupuestoInicial").value)

  if (presupuesto < 1 || isNaN(presupuesto)) {
    mostrarError("#msj-error-pregunta", "Cantidad no valida")
    return
  }

  localStorage.setItem("presupuesto", presupuesto)
  localStorage.setItem("gastos", JSON.stringify([]))

  actualizarVista()

}

const actualizarVista = () => {
  let presupuesto = localStorage.getItem("presupuesto")
  restante = presupuesto

  let divPregunta = document.querySelector("#pregunta")
  let divGastos = document.querySelector("#divGastos")
  let divControlGastos = document.querySelector("#divControlGastos")

  //ocultos por default
  divPregunta.style.display = "none"
  divGastos.style.display = "none"

  let controlGastos = `<div class="gastos-realizados">
                        <h2>Listado de Gastos</h2>
                        <div class="alert alert-primary">
                          Presupuesto: ${presupuesto}
                        </div>
                        <div class="alert alert-success">
                          Restante: ${presupuesto}
                        </div>
                      </div>`

  //muestra y oculta si hay presupuesto
  if (!presupuesto) {
    divPregunta.style.display = "block"
  } else {
    divPregunta.style.display = "none"
    divGastos.style.display = "block"
    divControlGastos.innerHTML = controlGastos
    refrescarListado()
  }
}

const agregarGasto = () => {
  let tipoGasto = document.getElementById("tipoGasto").value
  let cantidadGasto = parseInt(document.getElementById("cantidadGasto").value)

  if (cantidadGasto < 1 || isNaN(cantidadGasto) || tipoGasto.trim() === '') {
    mostrarError("#msj-error-creargasto", "Error en uno de los campos")
    return
  }
  if (cantidadGasto > restante) {
    mostrarError("#msj-error-creargasto", "Sin saldo")
    return
  }

  //creamos el nuevo gasto
  let nuevoGasto = {
    tipo: tipoGasto,
    cantidad: cantidadGasto
  }

  //accedemos a los gastos de localStorage
  let gastos = JSON.parse(localStorage.getItem("gastos"))

  gastos.push(nuevoGasto)

  localStorage.setItem("gastos", JSON.stringify(gastos))

  document.getElementById("formGastos").reset()

  refrescarListado()
}

refrescarListado = () => {

  let presupuesto = localStorage.getItem("presupuesto")
  let gastos = JSON.parse(localStorage.getItem("gastos"))

  let totalGastos = 0
  let listadoHTML = ``

  gastos.map(gasto => {
    listadoHTML += `<li class="gastos">
                      <p> ${gasto.tipo}
                        <span class="gasto">
                          $ ${gasto.cantidad}
                        </span>
                      </p>
                    </li>`
    totalGastos += parseInt(gasto.cantidad)
  })

  //actualiza restante
  restante = presupuesto - totalGastos

  //reinicia template
  let divControlGastos = document.querySelector("#divControlGastos")
  divControlGastos.innerHTML = ``

  //validación de restante
  if ((presupuesto / 4) > restante) {
    clase = "alert alert-danger"
  }
  else if ((presupuesto / 2) > restante) {
    clase = "alert alert-warning"
  }
  else {
    clase = "alert alert-success"
  }

  //template a imprimir
  divControlGastos.innerHTML = `<div class="gastos-realizados">
                                  <h2>Listado de Gastos</h2>
                                  ${listadoHTML}
                                  <div class="alert alert-primary">
                                    Presupuesto: $ ${presupuesto}
                                  </div>
                                  <div class="${clase}">
                                    Restante: $ ${restante}
                                  </div>
                                  <br />  
                                  <button class="button u-full-width" onclick="reiniciarPresupuesto()">Reiniciar</button>
                                </div>
                                `
}

reiniciarPresupuesto = () => {
  localStorage.clear()
  location.reload(true)
}

const mostrarError = (elemento, mensaje) => {
  divError = document.querySelector(elemento)
  divError.innerHTML = `<p class="alert alert-danger error">${mensaje}</p>`
  setTimeout(() => { divError.innerHTML = `` }, 2000)
}