// frontend/src/pages/CookiesPolicy.jsx
export default function CookiePolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
      <p>
        Este site usa cookies para melhorar a tua experiência de navegação. Cookies são pequenos ficheiros
        armazenados no teu dispositivo que ajudam a personalizar conteúdo, fornecer funcionalidades sociais,
        analisar o tráfego e oferecer anúncios direcionados.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-3">Tipos de Cookies</h2>
      <ul className="list-disc ml-6">
        <li><strong>Cookies essenciais:</strong> necessários para o funcionamento do site.</li>
        <li><strong>Cookies de desempenho:</strong> ajudam-nos a entender como usas o site.</li>
        <li><strong>Cookies de funcionalidade:</strong> guardam as tuas preferências.</li>
        <li><strong>Cookies de marketing:</strong> usados para publicidade personalizada.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-3">Como controlar os cookies</h2>
      <p>
        Podes configurar o teu navegador para recusar cookies ou avisar quando um cookie está a ser enviado.
        No entanto, algumas partes do site podem não funcionar corretamente se os cookies forem desativados.
      </p>
      <p className="mt-6">
        Para mais informações, consulta a nossa <a href="/privacy-policy" className="text-blue-600 underline">Política de Privacidade</a>.
      </p>
    </div>
  );
}