<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import useTerminal from './useTerminal'
import titleArt from './titles'
import { data as pages } from './pages.data'

import type { Uri } from './Config'

const { site, page } = useData()
const enhancedReadability = ref(false) // TODO!

const commands = computed(() => site.value.themeConfig.commands)
const prompt = '\n$> '

const textArea = ref<HTMLTextAreaElement | null>(null)
const footer = ref([])

function getTitleArt(key: string) {
  const art = titleArt[key] ?? titleArt['not_found']
  return art.join('\n')
}

function parsedContent(src: string) {
  const pieces = src.split('---').map(s => s.trim())
  const [_frontmatter, ...content] = pieces.filter(x => x.length)

  return content.join('\n\n')
}

type Page = {
  title: string
  titleArt: string
  content: string
  uris: Uri[]
}

function getCurrentPage(title: string) {
  const page = pages.find(p => p.frontmatter.title === title)
  if (!page) {
    console.error('☠️ current page not found in the list. This should never happen.')
    return {
      title: 'not_found',
      titleArt: getTitleArt('not_found'),
      content: 'The page could not be found.',
      uris: [],
    }
  }
  const titleArt = page.frontmatter.titleArt ?? getTitleArt(title)
  const content = parsedContent(page.src)

  return { title, titleArt, content, uris: page.frontmatter.uris ?? [] }
}

onMounted(() => {
  if (textArea.value === null) {
    console.error('textarea is missing')
    return
  }

  const { addText, addLine, clear, footerLinks, setFooter } = useTerminal(textArea.value, commands.value, pages)

  watch(page, () => {
    const { title, titleArt, content, uris } = getCurrentPage(page.value.title)
    addText(`${titleArt}\n${title}\n\n${content}`)
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
