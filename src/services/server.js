import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Inicializar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// Helper para estandarizar la respuesta hacia Vue.js
const formatProduct = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  description: p.description,
  imageFile: p.image_file,
  price: p.price
})

// -------------------------------------------------------------
// RUTAS DE LA API (SUPABASE)
// -------------------------------------------------------------

// 1. GET: Obtener todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')

    if (error) throw error

    res.json(data.map(formatProduct))
  } catch (error) {
    console.error('Error al consultar Supabase:', error.message)
    res.status(500).json({ error: 'Error al consultar la base de datos' })
  }
})

// 2. GET: Buscar / Consultar producto por NOMBRE
app.get('/api/products/search/:name', async (req, res) => {
  try {
    const { name } = req.params
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${name}%`) // Coincidencia parcial (no sensible a mayúsculas)

    if (error) throw error

    res.json(data.map(formatProduct))
  } catch (error) {
    console.error('Error al buscar por nombre:', error.message)
    res.status(500).json({ error: 'Error al realizar la búsqueda' })
  }
})

// 3. POST: Crear nuevo producto
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, description, imageFile, price } = req.body

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          category,
          description,
          image_file: imageFile || 'default.png',
          price
        }
      ])
      .select()

    if (error) throw error

    res.status(201).json(formatProduct(data[0]))
  } catch (error) {
    console.error('Error al insertar en Supabase:', error.message)
    res.status(500).json({ error: 'Error al crear el producto' })
  }
})

// 4. PUT: Actualizar producto por ID
app.put('/api/products', async (req, res) => {
  try {
    const { id, name, category, description, imageFile, price } = req.body

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        category,
        description,
        image_file: imageFile,
        price
      })
      .eq('id', id)
      .select()

    if (error) throw error

    res.json(formatProduct(data[0]))
  } catch (error) {
    console.error('Error al actualizar en Supabase:', error.message)
    res.status(500).json({ error: 'Error al actualizar el producto' })
  }
})

// 5. PUT: Actualizar producto por NOMBRE
app.put('/api/products/by-name/:name', async (req, res) => {
  try {
    const { name } = req.params
    const { newName, category, description, imageFile, price } = req.body

    const { data, error } = await supabase
      .from('products')
      .update({
        name: newName || name,
        category,
        description,
        image_file: imageFile,
        price
      })
      .ilike('name', name)
      .select()

    if (error) throw error
    if (!data.length) return res.status(404).json({ error: 'Producto no encontrado' })

    res.json(formatProduct(data[0]))
  } catch (error) {
    console.error('Error al actualizar por nombre:', error.message)
    res.status(500).json({ error: 'Error al actualizar el producto por nombre' })
  }
})

// 6. DELETE: Eliminar producto por ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Producto eliminado con éxito' })
  } catch (error) {
    console.error('Error al eliminar en Supabase:', error.message)
    res.status(500).json({ error: 'Error al eliminar el producto' })
  }
})

// 7. DELETE: Eliminar producto por NOMBRE
app.delete('/api/products/by-name/:name', async (req, res) => {
  try {
    const { name } = req.params

    const { data, error } = await supabase
      .from('products')
      .delete()
      .ilike('name', name)
      .select()

    if (error) throw error
    if (!data.length) return res.status(404).json({ error: 'No se encontró el producto a eliminar' })

    res.json({ message: `Producto '${name}' eliminado con éxito` })
  } catch (error) {
    console.error('Error al eliminar por nombre:', error.message)
    res.status(500).json({ error: 'Error al eliminar el producto por nombre' })
  }
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor Node.js corriendo en http://localhost:${PORT}`)
})