import { emit, loadFontsAsync, once, showUI } from '@create-figma-plugin/utilities'

import { FromSelection, InsertCodeHandler, PasteFromText } from './types'
import convertMarkdownToTextLayer from './utils'

export default function () {
  once<InsertCodeHandler>('INSERT_CODE', async function (code: string) {
    debugger;
    
    const text = figma.createText()
    await loadFontsAsync([text])
    text.characters = code
    figma.currentPage.selection = [text]
    figma.viewport.scrollAndZoomIntoView([text])
    figma.closePlugin()
  })

  once<PasteFromText>("PAST_FROM_TEXT", convertMarkdownToTextLayer)

  showUI({ height: 240, width: 320 })

  // After
  figma.currentPage.selection.forEach(node => {
    if(node.type === "TEXT") {
      emit<FromSelection>("FROM_SELECTION", node.characters)
    }
  })
}
