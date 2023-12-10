import { FLFParser, FontLayoutManager } from '@figlet-ts/lib'

async function loadFont(name: string) {
  try {
    const font = await import(`./fonts/${name}.flf?raw`)
    return font.default
  } catch (e) {
    console.error('Cannot load font', name, e)
  }
}

async function getFont(name: string, fallback: string) {
  name = name ?? fallback ?? 'Standard'
  const font = await loadFont(name) ?? await loadFont(fallback) ?? await loadFont('Standard') 
  const flf = FLFParser.parse(font)
  return flf.font
}

export default function useFiglet(defaultFontName = 'Standard', htmlElement?: HTMLElement) {
  const flm = new FontLayoutManager()

  let inputElement: HTMLElement | null = null

  function calcMaxWidth() {
    // 1150px default width / 10px per char - 2 char padding
    if (inputElement === null) return 113
    const elWidth = inputElement.getBoundingClientRect().width
    return Math.round(elWidth / 10) - 2
  }

  function setInputElement(el: HTMLElement) {
    el.value = ''
    inputElement = el
  }

  async function render(text: string, fontName?: string) {
    flm.width.set(calcMaxWidth())
    const figFont = await getFont(fontName, defaultFontName)
    const output = flm.renderText(text, figFont)
    return output
  }
  return { render, setInputElement }
}
