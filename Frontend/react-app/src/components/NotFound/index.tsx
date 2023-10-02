import './style.scss'
import notfound from '../../assets/not_found_404.jpg'
const NotFoundPage = () => {
  return (
    <div
      className='not-found-page'
      //   style={{
      //     backgroundImage: `url('https://img.freepik.com/vector-premium/error-404-ilustracion-concepto-paisaje-pagina-inicio-que-falta-web_697669-3.jpg')`,
      //     height: '100vh',
      //     width: '100vw',
      //     objectFit: 'cover'
      //   }}
    >
      <img
        src={notfound}
        alt=''
        style={{
          height: '100vh',
          width: '100vw',
          objectFit: 'contain'
        }}
      />
    </div>
  )
}

export default NotFoundPage
