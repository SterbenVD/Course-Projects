import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import url from './url'
import axios from 'axios'

export function Auth () {
  const navigate = useNavigate();
  const Auth = async () => {
    let token = document.cookie
    try {
      const response = await axios.post(`${url}/checkToken`, { "token": token });
      if (response.data.success) {
        return response.data.id
      }
      else {
        navigate("/")
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    Auth()
  }, [])
}

export function delete_cookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
