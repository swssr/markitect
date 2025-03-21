import '!prismjs/themes/prism.css'

import {
  Button,
  Container,
  render,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit, once } from '@create-figma-plugin/utilities'
import { h, RefObject } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import {highlight, languages } from 'prismjs'
import Editor from 'react-simple-code-editor'

import styles from './styles.css'
import { FromSelection, InsertCodeHandler, PasteFromText } from './types'

function Plugin() {
  const [code, setCode] = useState("")
  const containerElementRef : RefObject<HTMLDivElement> = useRef(null)

  const handleInsertCodeButtonClick = useCallback(() => {
      emit<PasteFromText>('PAST_FROM_TEXT', code)
    }, [code])

  useEffect(() => {
    once<FromSelection>("FROM_SELECTION", setCode)
  }, []);

  // TODO: Move to custom hook
  // Patch to make `react-simple-code-editor` compatible with Preact
  useEffect(() => {
    const containerElement = containerElementRef.current
    if (containerElement === null) {
      return
    }
    const textAreaElement = containerElement.querySelector('textarea')
    if (textAreaElement === null) {
      return
    }
    textAreaElement.textContent = code
    const preElement = containerElement.querySelector('pre')
    if (preElement === null) {
      return
    }
    if (textAreaElement.nextElementSibling !== preElement) {
      textAreaElement.after(preElement)
    }
  }, [code]);

  return (
    <Container space="medium">
      <VerticalSpace space="small" />
      <div class={styles.container} ref={containerElementRef}>
        <Editor
          highlight={(code: string) => highlight(code, languages.markup, 'markup')}
          onValueChange={setCode}
          preClassName={styles.editor}
          textareaClassName={styles.editor}
          value={code}
        />
      </div>
      <VerticalSpace space="large" />
      <Button fullWidth disabled={!code.length} onClick={handleInsertCodeButtonClick}>
        Markdown to Figma!
      </Button>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
