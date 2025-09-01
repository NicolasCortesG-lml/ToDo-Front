export default function TermsPage() {
  return (
    <div
      className="max-w-3xl mx-auto p-6 shadow rounded mt-10"
      style={{ background: "#F5F5F5", color: "#121212" }}
    >
      <h1 className="text-3xl font-bold mb-4">📜 Términos de Servicio</h1>
      <p className="mb-4">
        Bienvenido a nuestra aplicación. Al usar este servicio, aceptas cumplir
        con los siguientes términos y condiciones. Por favor, léelos
        cuidadosamente.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Uso del servicio</h2>
      <p className="mb-4">
        Este servicio está diseñado para ayudarte a gestionar tareas y mantener
        conversaciones con un asistente virtual. Te comprometes a usarlo de
        manera responsable y a no realizar actividades que puedan dañar el
        sistema o a otros usuarios.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Privacidad</h2>
      <p className="mb-4">
        Respetamos tu privacidad. Tu información personal será tratada de
        acuerdo con nuestra política de privacidad y nunca será compartida sin
        tu consentimiento.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Limitación de responsabilidad</h2>
      <p className="mb-4">
        Este servicio se proporciona &quot;tal cual&quot;. No garantizamos que siempre
        esté disponible o libre de errores. No somos responsables de pérdidas o
        daños derivados del uso del servicio.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Modificaciones</h2>
      <p className="mb-4">
        Nos reservamos el derecho de modificar estos términos en cualquier
        momento. Te notificaremos de cambios relevantes a través de la
        aplicación o por correo electrónico.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contacto</h2>
      <p>
        Si tienes dudas sobre estos términos, puedes ponerte en contacto con
        nosotros en{" "}
        <a
          href="mailto:nicolas.cortes.lml@gmail.com"
          className="text-blue-500 underline"
        >
          nicolas.cortes.lml@gmail.com
        </a>
        .
      </p>

      <p>
        By using this site, you agree to our &quot;Terms of Service&quot; and &quot;Privacy Policy&quot;.
      </p>
    </div>
  );
}
