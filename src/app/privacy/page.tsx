export default function PrivacyPage() {
  return (
    <div
      className="max-w-3xl mx-auto p-6 shadow rounded mt-10"
      style={{ background: "#F5F5F5", color: "#121212" }} // Fondo gris y letras negras
    >
      <h1 className="text-3xl font-bold mb-4">🔒 Política de Privacidad</h1>
      <p className="mb-4">
        Tu privacidad es importante para nosotros. Esta política explica cómo
        recopilamos, usamos y protegemos tu información personal cuando utilizas
        nuestra aplicación.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Información que recopilamos
      </h2>
      <p className="mb-4">
        Recopilamos información que nos proporcionas directamente, como tu
        correo electrónico y los datos que ingresas en la aplicación. También
        podemos recopilar información técnica sobre tu dispositivo y uso del
        servicio.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Uso de la información</h2>
      <p className="mb-4">
        Utilizamos tu información para ofrecer y mejorar el servicio,
        personalizar tu experiencia y comunicarnos contigo sobre actualizaciones
        o soporte.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Compartir información</h2>
      <p className="mb-4">
        No compartimos tu información personal con terceros, excepto cuando sea
        necesario para cumplir con la ley o proteger nuestros derechos.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Seguridad</h2>
      <p className="mb-4">
        Implementamos medidas de seguridad para proteger tu información contra
        accesos no autorizados, alteraciones o destrucción.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cambios en la política</h2>
      <p className="mb-4">
        Podemos actualizar esta política ocasionalmente. Te notificaremos sobre
        cambios importantes a través de la aplicación o por correo electrónico.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contacto</h2>
      <p>
        Si tienes preguntas sobre esta política, contáctanos en{" "}
        <a
          href="mailto:soporte@todo-ai.com"
          className="text-blue-500 underline"
        >
          soporte@todo-ai.com
        </a>
        .
      </p>
    </div>
  );
}
