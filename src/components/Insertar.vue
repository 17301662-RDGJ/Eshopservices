<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/products'

const form = ref({
  name: '',
  price: 0,
  description: '',
  imageFile: ''
})
const categoriasTexto = ref('')

const mensaje = ref('')
const esError = ref(false)

const guardar = async () => {
  if (!form.value.name) {
    mostrarMensaje('El campo Nombre es obligatorio', true)
    return
  }

  const payload = {
    name: form.value.name,
    category: categoriasTexto.value ? categoriasTexto.value.split(',').map(c => c.trim()) : ['General'],
    description: form.value.description || '',
    imageFile: form.value.imageFile || 'default.png',
    price: Number(form.value.price)
  }

  try {
    await axios.post(API_URL, payload)
    mostrarMensaje('¡Producto guardado exitosamente!')
    limpiar()
  } catch (err) {
    console.error('Error al insertar:', err)
    mostrarMensaje('No se pudo guardar el producto', true)
  }
}

const limpiar = () => {
  form.value = { name: '', price: 0, description: '', imageFile: '' }
  categoriasTexto.value = ''
}

const mostrarMensaje = (txt, error = false) => {
  mensaje.value = txt
  esError.value = error
}
</script>

<template>
  <div class="card">
    <h2>➕ Agregar Nuevo Producto</h2>

    <div v-if="mensaje" :class="['alert', esError ? 'alert-error' : 'alert-success']">
      {{ mensaje }}
    </div>

    <div class="edit-form" style="max-width: 500px; margin: 0 auto;">
      <div class="form-group">
        <label>Nombre (*):</label>
        <input v-model="form.name" class="form-control" />
      </div>

      <div class="form-group">
        <label>Precio ($):</label>
        <input type="number" step="0.01" v-model.number="form.price" class="form-control" />
      </div>

      <div class="form-group">
        <label>Categorías (separadas por coma):</label>
        <input v-model="categoriasTexto" placeholder="Laptop, Computadoras" class="form-control" />
      </div>

      <div class="form-group">
        <label>Descripción:</label>
        <textarea v-model="form.description" class="form-control" rows="3"></textarea>
      </div>

      <div class="form-group">
        <label>Imagen:</label>
        <input v-model="form.imageFile" class="form-control" />
      </div>

      <button @click="guardar" class="btn btn-primary" style="margin-top: 15px; width: 100%;">Guardar Producto</button>
    </div>
  </div>
</template>