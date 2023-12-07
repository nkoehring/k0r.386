import { ref } from 'vue'
import type { SimpleCommand, Uri } from './Config'
import { useRouter } from 'vitepress'

type PageInfo = {
  frontmatter: Record<string, string>
  src: string
  url: string
}

export default function useTerminal(inputEl: HTMLTextAreaElement, commands: SimpleCommand[], pages: PageInfo[]) {
  const prompt = '\n$> '
  const footerLinks = ref([])

  const router = useRouter()

  function moveCursorToEnd() {
    const pos = inputEl.value.length

    // allow text selection
    if (inputEl.selectionStart !== inputEl.selectionEnd) {
      console.debug('allowing text selection', inputEl.selectionStart, inputEl.selectionEnd)
      return
    }
    inputEl.setSelectionRange(pos, pos)
  }

  function setFocus() {
    inputEl.focus()
  }

  function addText(text: string, addPrompt=true) {
    const line = addPrompt ? text + prompt : text
    inputEl.value = inputEl.value + line
    inputEl.scrollTop = inputEl.scrollTopMax
  }

  function addLine(line: string) {
    addText('\n'+line)
  }

  function clear() {
    footerLinks.value = []
    inputEl.value = ''
    addText('')
  }

  type SYS_OUT = 'NOT_FOUND' | 'USAGE' | 'INFO' | '404'

  const SHELL = 'k0rSH'
  const INFO = 'k0rSH v0.1: the k0r SHell, fiddled together by k0r -- https://k0r.in'
  const PAD = 16
  const USAGE = [
    ...commands.map(cmd => {
      const command = `${(cmd.command+':').padEnd(PAD)}`
      const help = `${cmd.help ?? 'no helptext provided'}`
      const aliases = cmd.aliases ? ` (aliases: ${cmd.aliases?.join(', ')})` : ''
      return `${command}${help}${aliases}`
    }),
    `${'help:'.padEnd(PAD)}This help text. (aliases: usage)`,
    `${'version:'.padEnd(PAD)}Print version information.`,
    `${'clear:'.padEnd(PAD)}Clear the screen.`,
  ].join('\n')

  function systemOutput(output: SYS_OUT, arg = '') {
    switch (output) {
      case 'NOT_FOUND':
        console.debug('command not found')
        addLine(`${SHELL}: ${arg}: command not found...`)
        break
      case 'USAGE':
        console.log('help is underway')
        addLine(`${SHELL} - available commands:\n\n${USAGE}`)
        break
      case 'INFO':
        console.log('explaining myself')
        addLine(`${SHELL}: ${INFO}`)
        break
      case '404':
        console.log('page not found', arg)
        addLine(`${SHELL}: ${arg}: this page does not exist`)
        break
    }
  }
  
  function cursorAtPrompt() {
    return inputEl.value.endsWith(prompt)
  }

  function setFooter(uris: Uri[]) {
    footerLinks.value = uris
  }

  /// returns current command written in the command line
  /// in the format: [command, arg1, arg2, ..., argN]
  function getCurrentCommand() {
    const value = inputEl.value
    const start = value.lastIndexOf(prompt) + prompt.length
    const end = value.length

    return value.slice(start, end).trim().split(' ')
  }

  function execUserCommand(cmd: string) {
    const userCommand = commands.find(c => {
      const commandMatch = c.command === cmd
      const aliasesMatch = c.aliases.includes(cmd)
      return commandMatch || aliasesMatch
    })
    if (!userCommand) return systemOutput('NOT_FOUND', cmd)

    addLine(userCommand.message)
    setFooter(userCommand.uris)
  }

  const specialPages = ['README', 'not_found']
  const knownPages = []

  function fillKnownPages() {
    pages.forEach(p => {
      const title = p.frontmatter.title
      if (!title?.length || specialPages.includes(title)) return
      if (knownPages.includes(title)) return // no duplicates, please
      knownPages.push(title)
    })
  }

  function listPages() {
    if (knownPages.length === 0) fillKnownPages()
    addLine(`Following pages are available:\n\n${knownPages.join('\n')}\n\nUse the go command to switch pages.`)
  }

  async function openPage(page: string) {
    await router.go(page)
  }

  function handleCurrentCommand() {
    const [cmd, ...args] = getCurrentCommand()

    if (!cmd) {
      addText('')
      return
    }

    switch (cmd) {
      case 'help':
      case 'usage':
        systemOutput('USAGE')
        break
      case 'version':
        systemOutput('INFO')
        break
      case 'clear':
        clear()
        break
      case 'ls':
      case 'list':
        listPages()
        break
      case 'go':
      case 'open':
        addText('\n', false)
        if (!args.length) addText('USAGE: go page_name')
        else router.go(args[0])
        break
      default:
        execUserCommand(cmd)
    }
  }

  function handleInput(ev) {
    switch (ev.key) {
      case 'Enter':
        handleCurrentCommand()
        ev.preventDefault()
        break
      case 'Backspace':
        if (cursorAtPrompt()) ev.preventDefault()
        break
    }
  }

  inputEl.addEventListener('focus', () => moveCursorToEnd())
  inputEl.addEventListener('blur', () => inputEl.focus())
  inputEl.addEventListener('click', () => moveCursorToEnd())
  inputEl.addEventListener('keydown', handleInput)

  return { addText, addLine, setFocus, clear, footerLinks }
}
