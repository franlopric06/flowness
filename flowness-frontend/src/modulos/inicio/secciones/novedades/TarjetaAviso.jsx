import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { resolverDestino } from '../../../../compartido/utilidades/destinos'
import { tipoDeAviso, textoBotonAviso } from '../../../../compartido/utilidades/tiposAviso'
import { imagenReducida } from '../../../../compartido/utilidades/medios'

// Botón del aviso: a una página del sitio, a WhatsApp o a otro link
function BotonAviso({ aviso, whatsapp }) {
  const destino = resolverDestino(aviso, whatsapp, `Hola! Vi en la página: "${aviso.titulo}". Quiero más info.`)
  if (!destino) return null
  const clase = 'btn btn-chico btn-primario mt-4 self-start whitespace-nowrap'
  const contenido = <>{textoBotonAviso(aviso)} <ArrowRight size={14} /></>
  return destino.interno
    ? <Link to={destino.interno} className={clase}>{contenido}</Link>
    : <a href={destino.externo} target="_blank" rel="noreferrer" className={clase}>{contenido}</a>
}

// Un aviso del Inicio: imagen opcional, tipo, título, texto y botón
function TarjetaAviso({ aviso, whatsapp }) {
  const { nombre, Icono, chip, icono } = tipoDeAviso(aviso.tipo)
  return (
    <article className="card-vidrio overflow-hidden h-full flex flex-col">
      {aviso.imagenUrl && (
        <img src={imagenReducida(aviso.imagenUrl, 700)} alt="" loading="lazy" className="w-full aspect-[16/9] object-cover" />
      )}
      <div className="p-5 flex gap-4 items-start flex-1">
        {!aviso.imagenUrl && <span className={`icono-caja shrink-0 hidden sm:flex ${icono}`}><Icono size={20} /></span>}
        <div className="flex flex-col min-w-0 h-full">
          <span className={`chip self-start mb-2 ${chip}`}><Icono size={11} /> {nombre}</span>
          <h3 className="font-semibold text-texto mb-1">{aviso.titulo}</h3>
          {aviso.descripcion && <p className="text-texto/70 text-sm whitespace-pre-line">{aviso.descripcion}</p>}
          <BotonAviso aviso={aviso} whatsapp={whatsapp} />
        </div>
      </div>
    </article>
  )
}

export default TarjetaAviso
