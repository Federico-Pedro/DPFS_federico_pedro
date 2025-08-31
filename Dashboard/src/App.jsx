import { useState } from 'react'
import { useEffect } from 'react'

import './App.css'

function App() {
  const [userData, setUserData] = useState(0)
  const [productsData, setProductsData] = useState(0)
  const [ultimoProducto, setUltimoProducto] = useState(0)
  const urlBase = 'http://localhost:3000'


  const fetchUsersData = async () => {
    try {
      const res = await fetch(`${urlBase}/api/users`)
      const data = await res.json()
      console.log(data)
      setUserData(data)

    } catch (error) {
      console.error('Ha habido un error', error)
    }
  }

  const fetchProductsData = async () => {
    try {
      const res = await fetch(`${urlBase}/api/products`)
      const data = await res.json()
      const productos = data.data;
      console.log(productos)
      const ultimoProducto = productos[productos.length - 1];
      setUltimoProducto(ultimoProducto)

      setProductsData(data)
    } catch (error) {
      console.log('Ha habido un error', error)
    }
  }

  useEffect(() => {
    fetchUsersData();
    fetchProductsData()
  }, [])

  async function deleteProduct(productId) {
    console.log('Intentando eliminar producto con ID:', productId);
    try {
      const res = await fetch(`http://localhost:3000/delete/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer leonardo1452` //este token debe ser luego generado en el loggin por seguridad
        }
      });
      console.log('Status de respuesta:', res.status);
      if (res.ok) {
        console.log('Usuario eliminado correctamente');

        location.reload();
      } else {
        console.error('Error al eliminar usuario');
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="main-container">
      <h1 className="title">Dashboard - Raton Blanco</h1>
      <div className="container">
        


          <div className="quantity-container item1">
            <h1 className='subtitle'>Estadísticas</h1>
            <div className='quantity'>
              <h2>Total de usuarios:</h2><h2> {userData.quantity}</h2>
            </div>

            <div className='quantity'>
              <h2>Total de productos: </h2><h2>{productsData.quantity}</h2>
            </div>
          </div>

          <div className="quantity-container item2">
            <h1 className='subtitle'>Categorías</h1>
            <div className='quantity'>
              <h2>Cantidad de muñecas:</h2><h2> {productsData.muñecas}</h2>
            </div>

            <div className='quantity'>
              <h2>Cantidad de animales: </h2><h2>{productsData.animales}</h2>
            </div>

            <div className='quantity'>
              <h2>Cantidad de ovejas: </h2><h2>{productsData.ovejas}</h2>
            </div>
          </div>

          <div className="quantity-container item3">
            <div className='last-product'>
              <h1 className='subtitle'>Ultimo producto cargado:</h1>
              <h2>ID: {ultimoProducto.id}</h2>
              <h2>Nombre: {ultimoProducto.name}</h2>
              <h2>Precio: $ {ultimoProducto.price}</h2>
            </div>


          </div>

        {userData ? (
          
            <table className='item4'>
              <thead>
                <tr>
                  <th className='subtitle'>ID</th>
                  <th className='subtitle'>Nombre</th>
                  <th className='subtitle'>Apellido</th>
                  <th className='subtitle'>Email</th>
                </tr>
              </thead>
              <tbody>
                {userData.data.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          
        ) : (
          <p>Cargando usuarios...</p>
        )}



        {productsData ? (
          
            <table className='item5'>
              <thead>
                <tr>
                  <th className='subtitle'>ID</th>
                  <th className='subtitle'>Nombre</th>
                  <th className='subtitle'>Descripcion</th>
                  <th className='subtitle'>Precio</th>
                  <th className='subtitle'>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {productsData.data.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>$ {product.price}</td>
                    <td className="td-button"><button className="delete-button" onClick={() => deleteProduct(product.id)}>&#x1F4A3;</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          
        ) : (
          <p>Cargando usuarios...</p>
        )}
      </div>
    </div>
  )
}

export default App
