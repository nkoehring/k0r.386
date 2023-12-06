import { ref } from 'vue'
import type { SimpleCommand, Uri } from './Config'

export default function useTerminal(inputEl: HTMLTextAreaElement, commands: SimpleCommand[]) {
  const prompt = '\n$> '
  const footerLinks = ref([])

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

  function addText(text: string) {
    const line = text + prompt
    inputEl.value = inputEl.value + line
    inputEl.scrollTop = inputEl.scrollTopMax
  }

  function addLine(line: string) {
    addText('\n'+line)
  }

  function clear() {
    inputEl.value = ''
    addText('')
  }

  type SYS_OUT = 'NOT_FOUND' | 'USAGE' | 'INFO'

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
    }
  }
  
  function cursorAtPrompt() {
    return inputEl.value.endsWith(prompt)
  }

  function setFooter(uris: Uri[]) {
    footerLinks.value = uris
  }

  function getCurrentCommand() {
    const value = inputEl.value
    const start = value.lastIndexOf(prompt) + prompt.length
    const end = value.length

    return value.slice(start, end).trim()
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

  function handleCurrentCommand() {
    const cmd = getCurrentCommand()

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
