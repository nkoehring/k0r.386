import { FLFParser, FontLayoutManager } from '@figlet-ts/lib'

const fontGlob = import.meta.glob('./fonts/*.flf', { as: 'raw' })

async function loadFont(name: string) {
  const key = Object.keys(fontGlob).find(path => path.toLowerCase() === `./fonts/${name.toLowerCase()}.flf`)
  if (!key) console.error(`Cannot find font "${name}"!`)

  console.log('found font', name, key)
  const font = await fontGlob[key]()
  return font
}

async function getFont(name: string, fallback: string) {
  name = name ?? fallback ?? 'standard'
  const font = await loadFont(name) ?? await loadFont(fallback) ?? await loadFont('standard') 
  const flf = FLFParser.parse(font)
  return flf.font
}

export default function useFiglet(defaultFontName = 'standard', htmlElement?: HTMLElement) {
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
