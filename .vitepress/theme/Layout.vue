<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import useTerminal from './useTerminal'
import titleArt from './titles'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
const enhancedReadability = ref(false)

const title = computed(() => {
  const titleKey = frontmatter.value.title
  const title = titleArt[titleKey] || titleArt['welcome']

  return title.join('\n')
})
const content = computed(() => frontmatter.value.content ?? [])
const commands = computed(() => site.value.themeConfig.commands)

const prompt = '\n$> '
const lines = ref(title.value + '\n\n' + content.value.join('\n') + '\n' + prompt)

const textArea = ref<HTMLTextAreaElement | null>(null)
const footer = ref([])

onMounted(() => {
  if (textArea.value === null) {
    console.error('textarea is missing')
    return
  }

  const { addText, addLine, clear, footerLinks } = useTerminal(textArea.value, commands.value)

  watch(frontmatter, () => {
    addText(title.value + '\n', false)
    addLine(content.value.join('\n'))
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
