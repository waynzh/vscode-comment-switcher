import { computed, defineExtension, useActiveTextEditor, useCommand, useTextEditorSelection } from 'reactive-vscode'
import { logger, multi2single, single2multi } from './utils'

const { activate, deactivate } = defineExtension(() => {
  logger.info('vscode-comment-switcher is running...')

  const editor = useActiveTextEditor()

  const document = computed(() => editor.value?.document)
  const selection = useTextEditorSelection(editor)

  function switchText() {
    if (editor.value && document.value) {
      const text = document.value.getText(selection.value) || ''
      if (text.startsWith('/**') && text.endsWith('*/')) {
        const newText = multi2single(text)

        editor.value.edit((editBuilder) => {
          editBuilder.replace(selection.value, newText)
        })

        logger.info(text, '==>', newText)
      }
      else if (text.startsWith('//')) {
        const newText = single2multi(text)

        editor.value.edit((editBuilder) => {
          editBuilder.replace(selection.value, newText)
        })

        logger.info(text, '==>', newText)
      }
    }
  }

  useCommand('vscode-comment-switcher.switchComment', () => {
    logger.info('Trigger command.')
    switchText()
  })
})

export { activate, deactivate }
