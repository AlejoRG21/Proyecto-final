class Cliente {
    constructor(id, cuotaInicial, costoTotal, tasaInteres, plazoAnio) {
      this.id = id;
      this.cuotaInicial = cuotaInicial;
      this.costoTotal = costoTotal;
      this.tasaInteres = tasaInteres;
      this.plazoAnio = plazoAnio;
      this.hipoteca = null;
    }
  
    asignarHipoteca(hipoteca) {
      this.hipoteca = hipoteca;
    }
  }
  
  class Hipoteca {
    constructor(cuotaInicial, costoTotal, tasaInteres, plazoAnio) {
      this.totalPrestamo = costoTotal - cuotaInicial;
      this.totalInteres = 0;
      this.cuotaMensual = 0;
      this.calcularHipoteca(tasaInteres, plazoAnio);
    }
  
    calcularHipoteca(tasaInteres, plazoAnio) {
      const MONTHS_IN_YEAR = 12;
      const tasaInteresMensual = tasaInteres / 100 / MONTHS_IN_YEAR;
  
      this.cuotaMensual =
        this.totalPrestamo *
        tasaInteresMensual /
        (1 - Math.pow(1 + tasaInteresMensual, -plazoAnio * MONTHS_IN_YEAR));
  
      this.totalInteres =
        this.cuotaMensual * plazoAnio * MONTHS_IN_YEAR - this.totalPrestamo;
    }
  }
  
  class GestorHipotecas {
    constructor() {
      this.clientes = [];
      this.matrizClientes = [];
    }
  
    añadirCliente(cliente) {
      this.clientes.push(cliente);
      this.matrizClientes.push([
        cliente.id,
        cliente.hipoteca.totalInteres.toFixed(2),
        cliente.hipoteca.totalPrestamo.toFixed(2),
      ]);
    }
  
    borrarCliente(id) {
      const index = this.clientes.findIndex(cliente => cliente.id === id);
      if (index !== -1) {
        this.clientes.splice(index, 1);
        this.matrizClientes = this.matrizClientes.filter(row => row[0] !== id);
        console.log(`Cliente con ID ${id} eliminado correctamente.`);
      } else {
        console.log(`Cliente con ID ${id} no encontrado.`);
      }
    }
  
    editarCliente(id) {
      const cliente = this.clientes.find(cliente => cliente.id === id);
      if (cliente) {
        let cuota = parseFloat(
          prompt(`Ingrese la nueva cuota inicial (actual: ${cliente.cuotaInicial}): `)
        );
        let costoTotal = parseFloat(
          prompt(`Ingrese el nuevo costo total (actual: ${cliente.costoTotal}): `)
        );
        let tasaInteres = parseFloat(
          prompt(`Ingrese la nueva tasa de interés (actual: ${cliente.tasaInteres}): `)
        );
        let plazoAnio = parseFloat(
          prompt(`Ingrese el nuevo plazo en años (actual: ${cliente.plazoAnio}): `)
        );
  
        if (
          isNaN(cuota) || isNaN(costoTotal) || isNaN(tasaInteres) || isNaN(plazoAnio) ||
          cuota < 0 || costoTotal < 0 || tasaInteres < 0 || plazoAnio < 0
        ) {
          alert("Error: Por favor ingrese valores válidos.");
          return;
        }
  
        cliente.cuotaInicial = cuota;
        cliente.costoTotal = costoTotal;
        cliente.tasaInteres = tasaInteres;
        cliente.plazoAnio = plazoAnio;
  
        const nuevaHipoteca = new Hipoteca(cuota, costoTotal, tasaInteres, plazoAnio);
        cliente.asignarHipoteca(nuevaHipoteca);
  
        const index = this.matrizClientes.findIndex(row => row[0] === id);
        this.matrizClientes[index] = [
          id,
          nuevaHipoteca.totalInteres.toFixed(2),
          nuevaHipoteca.totalPrestamo.toFixed(2),
        ];
  
        console.log(`Cliente con ID ${id} actualizado correctamente.`);
      } else {
        console.log(`Cliente con ID ${id} no encontrado.`);
      }
    }
  
    mostrarDatosCliente(cliente) {
      const hipoteca = cliente.hipoteca;
      alert(`Cliente ${cliente.id}:
  El valor del préstamo es: ${hipoteca.totalPrestamo.toFixed(2)}
  El valor del interés es: ${hipoteca.totalInteres.toFixed(2)}
  El valor de la cuota mensual es: ${hipoteca.cuotaMensual.toFixed(2)}`);
    }
  
    ordenarClientesPorBurbuja(tipo = "ascendente") {
      const n = this.matrizClientes.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          const actual = parseFloat(this.matrizClientes[j][2]);
          const siguiente = parseFloat(this.matrizClientes[j + 1][2]);
  
          const comparar =
            tipo === "ascendente" ? actual - siguiente : siguiente - actual;
  
          if (comparar > 0) {
            [this.matrizClientes[j], this.matrizClientes[j + 1]] = [
              this.matrizClientes[j + 1],
              this.matrizClientes[j],
            ];
          }
        }
      }
      console.log("Clientes ordenados:");
      console.table(this.matrizClientes);
    }
  
    ejecutar() {
      while (true) {
        const opcion = prompt(`Seleccione una opción:
  1. Añadir cliente
  2. Mostrar datos de un cliente
  3. Borrar cliente
  4. Editar cliente
  5. Ordenar clientes
  6. Salir`);
  
        switch (opcion) {
          case "1":
            const cuota = parseFloat(prompt("Ingrese la cuota inicial: "));
            const costoTotal = parseFloat(prompt("Ingrese el valor de la casa: "));
            const tasaInteres = parseFloat(prompt("Ingrese la tasa de interés (anual en porcentaje): "));
            const plazoAnio = parseFloat(prompt("Ingrese el plazo en años: "));
            const id = this.clientes.length + 1;
  
            if (
              isNaN(cuota) || isNaN(costoTotal) || isNaN(tasaInteres) || isNaN(plazoAnio) ||
              cuota < 0 || costoTotal < 0 || tasaInteres < 0 || plazoAnio < 0
            ) {
              alert("Error: Por favor ingrese valores válidos.");
              break;
            }
  
            const cliente = new Cliente(id, cuota, costoTotal, tasaInteres, plazoAnio);
            const hipoteca = new Hipoteca(cuota, costoTotal, tasaInteres, plazoAnio);
            cliente.asignarHipoteca(hipoteca);
  
            this.añadirCliente(cliente);
  
            console.log(`Cliente con ID ${id} añadido correctamente.`);
            break;
  
          case "2":
            const idMostrar = parseInt(prompt("Ingrese el ID del cliente para mostrar: "));
            const clienteMostrar = this.clientes.find(c => c.id === idMostrar);
            if (clienteMostrar) {
              this.mostrarDatosCliente(clienteMostrar);
            } else {
              console.log("Cliente no encontrado.");
            }
            break;
  
          case "3":
            const idBorrar = parseInt(prompt("Ingrese el ID del cliente a borrar: "));
            this.borrarCliente(idBorrar);
            break;
  
          case "4":
            const idEditar = parseInt(prompt("Ingrese el ID del cliente a editar: "));
            this.editarCliente(idEditar);
            break;
  
          case "5":
            const tipoOrden = prompt("¿Ordenar por monto del crédito hipotecario? (ascendente/descendente): ").toLowerCase();
            if (tipoOrden === "ascendente" || tipoOrden === "descendente") {
              this.ordenarClientesPorBurbuja(tipoOrden);
            } else {
              console.log("Opción no válida. No se realizó el ordenamiento.");
            }
            break;
  
          case "6":
            console.log("Saliendo del programa...");
            return;
  
          default:
            console.log("Opción no válida.");
        }
      }
    }
  }
  
  const gestor = new GestorHipotecas();
  gestor.ejecutar();
  
