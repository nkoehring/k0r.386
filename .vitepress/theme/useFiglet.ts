import { FLFParser, FontLayoutManager } from '@figlet-ts/lib'
import * as fonts from '@figlet-ts/fonts/dist/fonts'

function findFont(needle: string) {
  if (!needle) return

  needle = needle.toLowerCase()
  for (let categoryName in fonts) {
    const category = fonts[categoryName]
    for (let name in category) {
      if (name.toLowerCase() === needle) return category[name]
    }
  }
  console.error(`Cannot find font "${needle}"!`)
}

function getFont(name: string, fallback: string) {
  const font = findFont(name) ?? findFont(fallback) ?? fonts.Core.standard

  const flf = FLFParser.parse(atob(font._contents))
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
    inputElement = el
  }

  function render(text: string, fontName?: string) {
    flm.width.set(calcMaxWidth())
    const figFont = getFont(fontName, defaultFontName)
    const output = flm.renderText(text, figFont)
    return output
  }
  return { render, setInputElement }
}
