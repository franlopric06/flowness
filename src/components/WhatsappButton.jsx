function WhatsappButton() {
  return (
    
     <a href="https://wa.me/543837691106"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 left-2 z-50 flex items-center gap-2 group"
      aria-label="Contactar por WhatsApp"
    >
      {/* Botón */}
      <div className="bg-green-500 hover:bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.554 4.1 1.523 5.828L.057 23.888a.5.5 0 0 0 .611.61l6.198-1.45A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.373l-.36-.214-3.733.874.936-3.629-.235-.374A9.861 9.861 0 0 1 2.1 12C2.1 6.525 6.525 2.1 12 2.1S21.9 6.525 21.9 12 17.475 21.9 12 21.9z"/>
        </svg>
      </div>
      {/* Mensaje que aparece al hover */}
      <span className="bg-green-500 text-[#F5F0EB] text-xs font-medium px-2 py-2 rounded-full shadow-lg opacity-2 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        ¡Hablemos!
      </span>

    </a>
  )
}

export default WhatsappButton