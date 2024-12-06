import { defineLogger } from 'reactive-vscode'

export const logger = defineLogger('vscode-comment-switcher')

const SINGLE_LINE_COMMENT_WITH_TEXT = /\/\*\* ([^*]+) \*\//g
const MULTI_LINE_COMMENT_CONTENT = /\/\*\*([\s\S]*?)\*\//g
const SINGLE_LINE_COMMENT_WITHOUT_SPACE = /\/\*\*([^*]+)\*\//g
const MULTI_LINE_COMMENT_BLOCK = /(\/\/ .+\n?)+/g
const SINGLE_LINE_COMMENT = /\/\/ (.+)/g
const MULTI_LINE_COMMENT_PREFIX = /^\s*\*\s?/gm

/** generated by ai, and it works */
export function multi2single(input: string) {
  input = input.replace(SINGLE_LINE_COMMENT_WITH_TEXT, '// $1')

  input = input.replace(MULTI_LINE_COMMENT_CONTENT, (_, p1) => {
    return p1.replace(MULTI_LINE_COMMENT_PREFIX, '// ')
  })

  input = input.replace(SINGLE_LINE_COMMENT_WITHOUT_SPACE, '// $1')

  return input
}

export function single2multi(input: string) {
  // single `//`
  if (input.match(SINGLE_LINE_COMMENT)) {
    return input.replace(SINGLE_LINE_COMMENT, '/** $1 */')
  }

  // multiple `//`
  input = input.replace(MULTI_LINE_COMMENT_BLOCK, (match) => {
    return `/**\n${match.replace(SINGLE_LINE_COMMENT, ' * $1')}\n */`
  })

  return input
}
