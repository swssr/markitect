import { EventHandler } from '@create-figma-plugin/utilities'

export interface InsertCodeHandler extends EventHandler {
  name: 'INSERT_CODE'
  handler: (code: string) => void
}


export interface PasteFromText extends EventHandler {
  name: 'PAST_FROM_TEXT',
  handle: (markdownText: string) => void
}

export interface FromSelection extends EventHandler {
  name: 'FROM_SELECTION',
  handle: (selection: readonly SceneNode[]) => void
}