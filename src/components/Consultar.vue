<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/products'

const nombreBusqueda = ref('')
const resultados = ref([])
const mensaje = ref('')
const esError = ref(false)

const buscarPorNombre = async () => {
  if (!nombreBusqueda.value.trim()) {
    mostrarMensaje('Ingresa un nombre para buscar', true)
    resultados.value = []
    return
  }

  try {
    const res = await axios.get(`${API_URL}/search/${encodeURIComponent(nombreBusqueda.value)}`)
    resultados.value = res.data

    if (resultados.value.length > 0) {
      mostrarMensaje(`Se encontraron ${resultados.value.length} producto(s)`)
    } else {
      mostrarMensaje('No se encontró ningún producto con ese nombre', true)
    }
  } catch (err) {
    mostrarMensaje('Error al realizar la búsqueda', true)
  }
}

const mostrarMensaje = (txt, error = false) => {
  mensaje.value = txt
  esError.value = error
}
</script>

<template>
  <div class="card">
    <h2>🔍 Consultar Productos por Nombre</h2>

    <div v-if="mensaje" :class="['alert', esError ? 'alert-error' : 'alert-success']">
      {{ mensaje }}
    </div>

    <div class="search-box">
      <label><strong>Nombre del Producto:</strong></label>
      <input 
        v-model="nombreBusqueda" 
        @keyup.enter="buscarPorNombre" 
        placeholder="Ej: Dell" 
        class="form-control" 
      />
      <button @click="buscarPorNombre" class="btn btn-primary" style="margin-top: 10px;">Buscar</button>
    </div>

    <!-- RESULTADOS -->
    <div v-for="prod in resultados" :key="prod.id" class="product-card">
      <h3>📦 {{ prod.name }}</h3>
      <p><strong>Precio:</strong> ${{ prod.price }}</p>
      <p><strong>Descripción:</strong> {{ prod.description || 'Sin descripción' }}</p>
      <p><strong>Categorías:</strong> {{ Array.isArray(prod.category) ? prod.category.join(', ') : prod.category }}</p>
    </div>
  </div>
</template>

