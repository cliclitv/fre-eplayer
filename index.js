import { h, render, useEffect, useState } from 'fre'
import { useRoutes } from 'use-routes'
import './style.css'

function EPlayer ({ vid }) {
  const [url, setUrl] = useState(0)
  const av = vid.replace('av', '')
  useEffect(() => {
    fetch(`https://jx.clicli.us/jx?url=${av}@dogecloud`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setUrl(data.url)
      })
  }, [])
  return <e-player src={url} type='hls' />
}

const routes = {
  '/video/:vid': EPlayer
}

const App = () => useRoutes(routes)

render(<App />, document.getElementById('root'))
