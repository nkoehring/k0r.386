<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import useTerminal from './useTerminal'
import useFiglet from './useFiglet'
import { data as pages } from './pages.data'

import type { Uri } from './Config'

const { site, page } = useData()
const enhancedReadability = ref(false) // TODO!

const commands = computed(() => site.value.themeConfig.commands)
const prompt = '\n$> '

const textArea = ref<HTMLTextAreaElement | null>(null)
const footer = ref([])

const figlet = useFiglet(site.value.themeConfig.defaultHeaderFont)

function parsedContent(src: string) {
  const pieces = src.split('---').map(s => s.trim())
  const [_frontmatter, ...content] = pieces.filter(x => x.length)

  return content.join('\n\n')
}

type Page = {
  title: string
  headerArt: string
  content: string
  uris: Uri[]
}

function getCurrentPage(title: string) {
  const page = pages.find(p => p.frontmatter.title === title)
  if (!page) {
    console.error('☠️ current page not found in the list. This should never happen.')
    return {
      title: 'not_found',
      headerArt: figlet.render('404'),
      content: 'The page could not be found.',
      uris: [],
    }
  }
  const { header, headerFont, uris } = page.frontmatter
  const headerArt = figlet.render(header, headerFont)
  const content = parsedContent(page.src)

  return { title, headerArt, content, uris: uris ?? [] }
}

onMounted(() => {
  if (textArea.value === null) {
    console.error('textarea is missing')
    return
  }

  figlet.setInputElement(textArea.value)
  const { addText, addLine, clear, footerLinks, setFooter } = useTerminal(textArea.value, commands.value, pages)

  watch(page, () => {
    const { title, headerArt, content, uris } = getCurrentPage(page.value.title)
    addText(`${headerArt}\n${title}\n\n${content}`)
    setFooter(uris)
  }, { immediate: true })

  watch(footerLinks, () => {
    footer.value = footerLinks.value
  }, { immediate: true })
})
</script>

<template>
  <div id="screen" :class="{ 'enhanced-readability': enhancedReadability }">
    <div id="wrap">
      <div id="interlace" />
      <div id="scanline" />
      <div id="inner">
        <textarea ref="textArea"
          spellcheck="false"
          autocorrect="false"
          autocapitalize="false"
          autocomplete="false"
          autofocus
        ></textarea>
        <footer>
          <a v-for="({ uri, label}) in footer"
            :href="uri"
            target="_blank"
            rel="noopener"
          >
            {{ label }}
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>
