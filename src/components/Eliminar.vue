<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/products'

const nombreABorrar = ref('')
const mensaje = ref('')
const esError = ref(false)

const eliminarPorNombre = async () => {
  if (!nombreABorrar.value.trim()) {
    mostrarMensaje('Por favor, escribe el nombre del producto a borrar', true)
    return
  }

  const confirmacion = confirm(`¿Estás seguro de borrar el producto "${nombreABorrar.value}"?`)
  if (!confirmacion) return

  try {
    await axios.delete(`${API_URL}/by-name/${encodeURIComponent(nombreABorrar.value)}`)
    mostrarMensaje(`¡Producto "${nombreABorrar.value}" eliminado con éxito!`)
    nombreABorrar.value = ''
  } catch (err) {
    mostrarMensaje('No se pudo eliminar el producto. Verifica que el nombre exista.', true)
  }
}

const mostrarMensaje = (txt, error = false) => {
  mensaje.value = txt
  esError.value = error
}
</script>

<template>
  <div class="card">
    <h2>🗑️ Eliminar Producto por Nombre</h2>

    <div v-if="mensaje" :class="['alert', esError ? 'alert-error' : 'alert-success']">
      {{ mensaje }}
    </div>

    <div class="delete-box" style="max-width: 500px; margin: 0 auto; text-align: center;">
      <div class="form-group">
        <label><strong>Nombre del producto a borrar:</strong></label>
        <input 
          v-model="nombreABorrar" 
          placeholder="Ej: Dell" 
          class="form-control" 
        />
      </div>

      <button @click="eliminarPorNombre" class="btn btn-danger" style="margin-top: 15px; width: 100%;">
        Eliminar Definitivamente por Nombre
      </button>
    </div>
  </div>
</template>