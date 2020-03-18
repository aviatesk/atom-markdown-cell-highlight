/** @babel */

import { Point, Range, CompositeDisposable, Disposable } from 'atom'

function getCellRanges(editor) {
  const ranges = []
  const n = editor.getLineCount()
  let inCell = false
  let startPosition = new Point(0, 0)
  for (let i = 0; i < n; i++) {
    const bufferPosition = new Point(i, 0)
    const scopeDescriptor = editor.syntaxTreeScopeDescriptorForBufferPosition(bufferPosition)
    const scopes = scopeDescriptor.scopes
    const targetScopes = atom.config.get('markdown-cell-highlight.targetScopes')
    if (scopes.some(s => targetScopes.some(ts => s.startsWith(ts)))) {
      if (!inCell) {
        startPosition = bufferPosition
        inCell = true
      }
    } else {
      if (inCell) {
        ranges.push(new Range(startPosition, bufferPosition))
        inCell = false
      }
    }
  }
  return ranges
}

function decorateRanges(editor, ranges) {
  return ranges.map(range => {
    const marker = editor.markBufferRange(range)
    editor.decorateMarker(marker, {
        type: 'line-number',
        class: 'markdown-cell-highlight'
    })
    editor.decorateMarker(marker, {
        type: 'line',
        class: 'markdown-cell-highlight'
    })
    return marker
  })
}

function decorateCells(editor) {
  const ranges = getCellRanges(editor)
  return decorateRanges(editor, ranges)
}

const editorStore = new WeakMap()

function observeEditor(editor) {
  if (!editor || editorStore.has(editor)) return
  const markerSubscription = new CompositeDisposable()
  const markdownScopes = atom.config.get('markdown-cell-highlight.markdownScopes')
  if (editor.getGrammar && markdownScopes.includes(editor.getGrammar().id)) {
    // init
    // NOTE: have to wait for an editor to finish initial tokenizing
    let markers = []
    setTimeout(() => markers = decorateCells(editor), 250)
    markerSubscription.add(
      editor.onDidStopChanging(() => {
        markers.forEach(marker => marker.destroy())
        markers = decorateCells(editor)
      }),
      // clean up
      new Disposable(() => markers.forEach(marker => marker.destroy()))
    )
  }
  markerSubscription.add(
    editor.onDidDestroy(() => {
      editorStore.delete(editor)
      markerSubscription.dispose()
    }),
    editor.onDidChangeGrammar(grammar => {
      editorStore.delete(editor)
      markerSubscription.dispose()
      observeEditor(editor)
    })
  )
  editorStore.set(editor, markerSubscription)
}

let subscriptions = null

// atom package API
export function activate() {
  subscriptions = new CompositeDisposable()
  subscriptions.add(atom.workspace.observeTextEditors(observeEditor))
}

export function deactivate() {
  atom.workspace.getTextEditors().forEach(editor => {
    if (editorStore.has(editor)) {
      editorStore.get(editor).dispose()
      editorStore.delete(editor)
    }
  })
  subscriptions.dispose()
  subscriptions = null
}
