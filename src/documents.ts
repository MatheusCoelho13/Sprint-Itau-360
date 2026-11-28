/** Texto puro de .txt, .docx e .pdf, lido no próprio navegador (nada é enviado a servidor). */

export const DOC_EXT = ['txt', 'docx', 'pdf'] as const
export const isDocument = (name: string): boolean => (DOC_EXT as readonly string[]).includes(name.split('.').pop()?.toLowerCase() ?? '')

const u16 = (b: DataView, o: number) => b.getUint16(o, true)
const u32 = (b: DataView, o: number) => b.getUint32(o, true)

/** Extrai um arquivo de dentro de um .zip (o .docx é um zip): lê o diretório central e descomprime com o DecompressionStream nativo. */
async function unzip(buf: ArrayBuffer, wanted: string): Promise<Uint8Array> {
  const v = new DataView(buf)
  let eocd = buf.byteLength - 22
  while (eocd >= 0 && u32(v, eocd) !== 0x06054b50) eocd--
  if (eocd < 0) throw new Error('Arquivo .docx inválido (não é um zip).')
  let p = u32(v, eocd + 16)
  for (let n = u16(v, eocd + 10); n > 0; n--) {
    const method = u16(v, p + 10), size = u32(v, p + 20), nameLen = u16(v, p + 28), extra = u16(v, p + 30), comment = u16(v, p + 32), local = u32(v, p + 42)
    const name = new TextDecoder().decode(new Uint8Array(buf, p + 46, nameLen))
    p += 46 + nameLen + extra + comment
    if (name !== wanted) continue
    const start = local + 30 + u16(v, local + 26) + u16(v, local + 28)
    const raw = new Uint8Array(buf, start, size)
    if (method === 0) return raw
    if (method !== 8) throw new Error('Compressão do .docx não suportada.')
    const out = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
    return new Uint8Array(await new Response(out).arrayBuffer())
  }
  throw new Error(`"${wanted}" não encontrado no .docx.`)
}

async function docx(file: File): Promise<string> {
  const xml = new TextDecoder().decode(await unzip(await file.arrayBuffer(), 'word/document.xml'))
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.querySelector('parsererror')) throw new Error('Conteúdo do .docx ilegível.')
  const text = (p: Element) => Array.from(p.getElementsByTagName('*')).map(e =>
    e.localName === 't' ? e.textContent : e.localName === 'tab' ? '\t' : e.localName === 'br' ? '\n' : '').join('')
  return Array.from(doc.getElementsByTagName('*')).filter(e => e.localName === 'p').map(text).join('\n')
}

/** PDF com texto selecionável. PDF escaneado (só imagem) não tem texto: avisa em vez de gravar vazio. */
async function pdf(file: File): Promise<string> {
  const [lib, worker] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')])
  lib.GlobalWorkerOptions.workerSrc = worker.default
  const doc = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  const pages: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const { items } = await (await doc.getPage(i)).getTextContent()
    pages.push(items.map(it => 'str' in it ? it.str + (it.hasEOL ? '\n' : ' ') : '').join('').replace(/ +\n/g, '\n').trim())
  }
  return pages.join('\n\n')
}

export async function readDocument(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const text = ext === 'docx' ? await docx(file) : ext === 'pdf' ? await pdf(file) : await file.text()
  if (!text.trim()) throw new Error(`${file.name}: nenhum texto encontrado${ext === 'pdf' ? ' (PDF escaneado precisa de OCR)' : ''}.`)
  return text.replace(/\r\n?/g, '\n').trim()
}
