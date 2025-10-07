import { useState } from "react";
import { motion } from "framer-motion";

/**
 * PresenteSection.jsx
 * Seção elegante para sugerir presentes em forma de contribuição para a Lua de Mel/Viagem.
 *
 * ✅ Recursos:
 * - Texto institucional (editável)
 * - Botão "Copiar chave Pix" com feedback
 * - Exibição de dados bancários (opcional)
 * - QR Code (coloque a imagem em /public/pix-qr.png)
 * - Link para lista externa (Casar.com, iCasei etc.)
 * - Grade de "cotas" (valores de contribuição) com rótulos e ação rápida
 *
 * 🛠 Como usar (Next.js com Tailwind):
 * 1) Salve este arquivo em: /components/PresenteSection.jsx
 * 2) Coloque seu QR em: /public/pix-qr.png (ou mude a prop `qrSrc`)
 * 3) Em alguma página, importe e use:
 *    import PresenteSection from "@/components/PresenteSection";
 *    export default function Pagina() {
 *      return (
 *        <PresenteSection
 *          pixKey="000.000.000-00" // sua chave Pix (CPF/CNPJ/Email/Telefone)
 *          bankData={{ banco: "Banco do Brasil", agencia: "0001", conta: "12345-6", titular: "André Ricardo & Marilene" }}
 *          qrSrc="/pix-qr.png"
 *          externalListUrl="https://www.icasei.com.br/seu-link"
 *          externalListLabel="Ver nossa lista de presentes"
 *          giftLabel="Nossa Lua de Mel 💕"
 *          introText={[
 *            "O maior presente é ter você conosco nesse momento tão especial!",
 *            "Se desejar nos presentear, você pode contribuir com nossa Lua de Mel.",
 *          ]}
 *          cotas={[
 *            { titulo: "1 noite aconchegante", valor: 250, descricao: "Ajude com a hospedagem.", ref: "noite" },
 *            { titulo: "Jantar romântico", valor: 180, descricao: "Um brinde ao amor!", ref: "jantar" },
 *            { titulo: "Passeio especial", valor: 120, descricao: "Momento inesquecível.", ref: "passeio" },
 *          ]}
 *        />
 *      );
 *    }
 */

export default function PresenteSection({
  pixKey = "000.000.000-00",
  bankData = null, // { banco, agencia, conta, titular }
  qrSrc = "/pix-qr.png",
  externalListUrl = "",
  externalListLabel = "Ver nossa lista de presentes 💝",
  giftLabel = "Nossa Lua de Mel 💕",
  introText = [
    "O maior presente é a sua presença em nosso grande dia.",
    "Mas, se desejar contribuir com nossa Lua de Mel, ficaremos muito gratos!",
  ],
  cotas = [], // [{titulo, valor:number, descricao, ref}]
}) {
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState("");

  const copyToClipboard = async (text, msg = "Chave Pix copiada!") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedMsg(msg);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error(e);
    }
  };

  const currency = (v) => v?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Gera uma mensagem Pix "copia e cola" simplificada (texto indicativo para descrição do pagamento)
  const buildPixMemo = ({ valor, ref }) => {
    const base = `Casamento André & Marilene — Cota: ${ref ?? "contribuicao"}`;
    return `${base} — ${valor ? currency(valor) : "valor livre"}`;
  };

  return (
    <section className="relative py-16 px-6 sm:px-10 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-emerald-900 tracking-tight">
            {giftLabel}
          </h2>
          <div className="mt-4 text-gray-700 max-w-2xl mx-auto space-y-2">
            {introText.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </motion.div>

        {/* Cartões principais: Pix / QR / Lista */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {/* Card Pix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl shadow-sm border border-emerald-100 p-6"
          >
            <h3 className="text-lg font-semibold text-emerald-800">Contribua via Pix</h3>
            <p className="text-sm text-gray-600 mt-2">Chave Pix</p>
            <p className="text-base font-medium text-gray-900 break-all">{pixKey}</p>
            <button
              onClick={() => copyToClipboard(pixKey, "Chave Pix copiada! ✅")}
              className="mt-3 inline-flex items-center justify-center rounded-xl px-4 py-2 bg-emerald-700 text-white hover:bg-emerald-800 transition"
            >
              Copiar chave Pix
            </button>

            {bankData && (
              <div className="mt-5 text-sm text-gray-700">
                <div className="font-semibold text-emerald-800">Dados bancários (opcional)</div>
                <ul className="mt-2 space-y-0.5">
                  {bankData.titular && <li><span className="text-gray-600">Titular:</span> {bankData.titular}</li>}
                  {bankData.banco && <li><span className="text-gray-600">Banco:</span> {bankData.banco}</li>}
                  {bankData.agencia && <li><span className="text-gray-600">Agência:</span> {bankData.agencia}</li>}
                  {bankData.conta && <li><span className="text-gray-600">Conta:</span> {bankData.conta}</li>}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Card QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col items-center justify-center"
          >
            <h3 className="text-lg font-semibold text-emerald-800">Pague pelo QR Code</h3>
            <p className="text-sm text-gray-600 mt-2 text-center">Abra o app do seu banco e aponte para o QR</p>
            <div className="mt-4 w-48 h-48 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              {/* Substitua a imagem pelo seu QR real */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrSrc} alt="QR Code do Pix" className="w-full h-full object-contain" />
            </div>
          </motion.div>

          {/* Card Lista Externa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl shadow-sm border border-emerald-100 p-6"
          >
            <h3 className="text-lg font-semibold text-emerald-800">Lista de presentes</h3>
            <p className="text-sm text-gray-600 mt-2">Prefere pagar com cartão? Acesse nossa lista.</p>
            {!!externalListUrl && (
              <a
                href={externalListUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2 bg-emerald-700 text-white hover:bg-emerald-800 transition"
              >
                {externalListLabel}
              </a>
            )}
            {!externalListUrl && (
              <p className="text-sm text-gray-500 mt-4">(Adicione o link da sua lista externa pela prop <code>externalListUrl</code>)</p>
            )}
          </motion.div>
        </div>

        {/* Cotas de presente */}
        {Array.isArray(cotas) && cotas.length > 0 && (
          <div className="mt-12">
            <h4 className="text-xl font-semibold text-emerald-900 text-center">Escolha uma cota (opcional)</h4>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cotas.map((c, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-emerald-800 font-semibold">{c.titulo}</div>
                      {c.descricao && <div className="text-sm text-gray-600 mt-1">{c.descricao}</div>}
                    </div>
                    {typeof c.valor === "number" && (
                      <div className="text-base font-bold text-emerald-900 whitespace-nowrap">{currency(c.valor)}</div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* Copiar chave Pix */}
                    <button
                      onClick={() => copyToClipboard(pixKey, "Chave Pix copiada! ✅")}
                      className="rounded-xl px-3 py-2 text-sm bg-emerald-700 text-white hover:bg-emerald-800"
                    >
                      Copiar chave Pix
                    </button>

                    {/* Copiar descrição/memo sugerido */}
                    <button
                      onClick={() => copyToClipboard(buildPixMemo({ valor: c.valor, ref: c.ref || c.titulo }), "Descrição copiada! 📝")}
                      className="rounded-xl px-3 py-2 text-sm border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                    >
                      Copiar descrição
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Toast simples de cópia */}
        <div
          className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-50 transition-opacity ${
            copied ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="rounded-xl bg-emerald-700 text-white px-4 py-2 shadow-lg">
            {copiedMsg || "Copiado!"}
          </div>
        </div>

        {/* Rodapé discreto */}
        <div className="mt-12 text-center text-sm text-gray-500">
          Sua contribuição é totalmente opcional. Obrigado pelo carinho! 💚
        </div>
      </div>
    </section>
  );
}
