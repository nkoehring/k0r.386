export type Uri = {
  label: string
  uri: string
}

export type SimpleCommand = {
  command: string,
  aliases?: string[],
  help?: string,
  message: string,
  uris: Uri[],
}

export interface ThemeConfig {
  defaultHeaderFont: string
  commands: SimpleCommand[]
}
