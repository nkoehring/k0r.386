import { FLFParser, FontLayoutManager } from '@figlet-ts/lib'
import * as fonts from '@figlet-ts/fonts/dist/fonts'

function findFont(needle: string) {
  needle = needle.toLowerCase()
  for (let categoryName in fonts) {
    const category = fonts[categoryName]
    for (let name in category) {
      if (name.toLowerCase() === needle) return category[name]
    }
  }
}

function getFont(name: string) {
  const font = findFont(name)
  if (!font) throw new Error(`Cannot find font "${name}"!`)

  const flf = FLFParser.parse(atob(font._contents))
  return flf.font
}

export default function useFiglet() {
  const flm = new FontLayoutManager()

  function render(text: string, fontName: string, maxWidth: number) {
    flm.width.set(maxWidth)
    const figFont = getFont(fontName)
    const output = flm.renderText(text, figFont)
    return output
  }
  return { render }
}
