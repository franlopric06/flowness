-- Preguntas frecuentes para el asistente del sitio
CREATE TABLE "PreguntaFrecuente" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "palabrasClave" TEXT NOT NULL DEFAULT '',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreguntaFrecuente_pkey" PRIMARY KEY ("id")
);

-- Preguntas de ejemplo para arrancar (se pueden editar o borrar desde el panel)
INSERT INTO "PreguntaFrecuente" ("pregunta", "respuesta", "palabrasClave", "orden") VALUES
('¿Cómo compro una clase o un curso?', 'Entrá a Clases o a Formación, elegí la que te guste y tocá "Comprar". Si todavía no tenés cuenta, te la pide primero (es gratis). El pago se hace ahí mismo, de forma segura con Mercado Pago.', 'comprar, pagar, adquirir, como hago para comprar, precio', 1),
('¿Qué medios de pago aceptan?', 'Podés pagar con tarjeta de crédito o débito, con dinero en tu cuenta de Mercado Pago o en efectivo en Rapipago y Pago Fácil. Todo se procesa con Mercado Pago, así que tus datos están protegidos.', 'tarjeta, efectivo, mercado pago, rapipago, pago facil, debito, credito, cuotas, medios de pago', 2),
('¿Por cuánto tiempo tengo acceso a lo que compro?', 'Para siempre. Lo que comprás queda en tu cuenta y lo podés ver todas las veces que quieras, desde el celular o la compu.', 'acceso, vence, cuanto dura, para siempre, tiempo, caduca', 3),
('¿Hay alguna clase gratis?', 'Sí. Registrate gratis y vas a poder ver la clase gratis desde la sección Clases.', 'gratis, prueba, clase de prueba, sin pagar, gratuita', 4),
('¿Dónde veo lo que compré?', 'Ingresá con tu cuenta y entrá a "Mi cuenta": ahí están todas tus clases y cursos.', 'mis clases, mis cursos, compre, compras, donde esta, no encuentro', 5),
('Me olvidé la contraseña, ¿qué hago?', 'En la pantalla de Ingresar tocá "¿Olvidaste tu contraseña?", poné tu email y te llega un link para crear una nueva. Revisá también la carpeta de spam.', 'contraseña, clave, olvide, no puedo entrar, recuperar, password', 6),
('¿Qué es la Formación?', 'Es la formación profesional del método Flowness, pensada para profes y personas que trabajan con el movimiento. Tiene 3 niveles que se compran por separado; cada lección trae su video y su material en PDF.', 'formacion, curso, profesores, niveles, instructor, profesional', 7);
