<script setup>
import { ref } from 'vue'
// Importamos los estilos externos
import './assets/styles.css'

// Importamos las vistas
import Inicio from './components/Inicio.vue'
import Consultar from './components/Consultar.vue'
import Insertar from './components/Insertar.vue'
import Editar from './components/Editar.vue'
import Eliminar from './components/Eliminar.vue'

// Estado de la vista activa (Inicia en 'inicio')
const vistaActual = ref('inicio')
</script>

<template>
  <div class="main-container">
    <!-- MENÚ DE NAVEGACIÓN -->
    <nav class="navbar">
      <div class="brand">🛒 E-Shop Manager</div>
      <div class="nav-links">
        <button 
          :class="['nav-btn', vistaActual === 'inicio' ? 'active' : '']" 
          @click="vistaActual = 'inicio'">Inicio</button>
        <button 
          :class="['nav-btn', vistaActual === 'consultar' ? 'active' : '']" 
          @click="vistaActual = 'consultar'">Consultar</button>
        <button 
          :class="['nav-btn', vistaActual === 'insertar' ? 'active' : '']" 
          @click="vistaActual = 'insertar'">Insertar</button>
        <button 
          :class="['nav-btn', vistaActual === 'editar' ? 'active' : '']" 
          @click="vistaActual = 'editar'">Editar</button>
        <button 
          :class="['nav-btn', vistaActual === 'eliminar' ? 'active' : '']" 
          @click="vistaActual = 'eliminar'">Eliminar</button>
      </div>
    </nav>

    <!-- VISTA DINÁMICA -->
    <main>
      <Inicio v-if="vistaActual === 'inicio'" />
      <Consultar v-if="vistaActual === 'consultar'" />
      <Insertar v-if="vistaActual === 'insertar'" />
      <Editar v-if="vistaActual === 'editar'" />
      <Eliminar v-if="vistaActual === 'eliminar'" />
    </main>
  </div>
</template>