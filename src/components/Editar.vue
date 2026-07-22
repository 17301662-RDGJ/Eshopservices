<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/products'

const nombreABuscar = ref('')
const form = ref({ newName: '', price: 0, description: '', imageFile: '' })
const categoriasTexto = ref('')
const productoCargado = ref(false)
const mensaje = ref('')
const esError = ref(false)

// Buscar producto por nombre para cargar en formulario
const cargarPorNombre = async () => {
  if (!nombreABuscar.value.trim()) return

  try {
    const res = await axios.get(`${API_URL}/search/${encodeURIComponent(nombreABuscar.value)}`)
    if (res.data.length > 0) {
      const prod = res.data[0]
      form.value = {
        newName: prod.name,
        price: prod.price,
        description: prod.description || '',
        imageFile: prod.imageFile || ''
      }
      categoriasTexto.value = Array.isArray(prod.category) ? prod.category.join(', ') : prod.category
      productoCargado.value = true
      mostrarMensaje(`Producto "${prod.name}" cargado`)
    } else {
      mostrarMensaje('No se encontró ningún producto con ese nombre', true)
      productoCargado.value = false
    }
  } catch (err) {
    mostrarMensaje('Error al buscar el producto', true)
  }
}

const actualizar = async () => {
  const payload = {
    newName: form.value.newName,
    category: categoriasTexto.value ? categoriasTexto.value.split(',').map(c => c.trim()) : [],
    description: form.value.description,
    imageFile: form.value.imageFile || 'default.png',
    price: Number(form.value.price)
  }

  try {
    await axios.put(`${API_URL}/by-name/${encodeURIComponent(nombreABuscar.value)}`, payload)
    mostrarMensaje('¡Producto actualizado con éxito por su nombre!')
    productoCargado.value = false
    nombreABuscar.value = ''
  } catch (err) {
    mostrarMensaje('Error al actualizar el producto', true)
  }
}

const mostrarMensaje = (txt, error = false) => {
  mensaje.value = txt
  esError.value = error
}
</script>

<template>
  <div class="card">
    <h2>✏️ Actualizar Producto por Nombre</h2>

    <div v-if="mensaje" :class="['alert', esError ? 'alert-error' : 'alert-success']">
      {{ mensaje }}
    </div>

    <div class="search-box">
      <label>Ingresa el nombre del producto a editar:</label>
      <input v-model="nombreABuscar" placeholder="Ej: Dell" class="form-control" />
      <button @click="cargarPorNombre" class="btn btn-primary" style="margin-top: 10px;">Cargar Datos</button>
    </div>

    <!-- FORMULARIO DE EDICIÓN -->
    <div v-if="productoCargado" class="edit-form" style="max-width: 500px; margin: 20px auto 0 auto;">
      <div class="form-group">
        <label>Nuevo Nombre:</label>
        <input v-model="form.newName" class="form-control" />
      </div>
      <div class="form-group">
        <label>Precio ($):</label>
        <input type="number" step="0.01" v-model.number="form.price" class="form-control" />
      </div>
      <div class="form-group">
        <label>Categorías:</label>
        <input v-model="categoriasTexto" class="form-control" />
      </div>
      <div class="form-group">
        <label>Descripción:</label>
        <textarea v-model="form.description" class="form-control" rows="2"></textarea>
      </div>
      <button @click="actualizar" class="btn btn-warning" style="margin-top: 15px; width: 100%;">
        Guardar Cambios por Nombre
      </button>
    </div>
  </div>
</template>