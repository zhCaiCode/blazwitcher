import styled from 'styled-components'
import { HighlightClasses, HighlightWithRanges, type HighlightWithRangesProps } from 'text-search-engine/react'

export const HIGHLIGHT_TEXT_CLASS = HighlightClasses.highlight
export const NORMAL_TEXT_CLASS = HighlightClasses.normal
const HighlightWithRangesWrapper = styled(HighlightWithRanges)`
  display: flex;
  max-width: 100%;
  .${HIGHLIGHT_TEXT_CLASS} {
    color: var(--color-neutral-3);
  }
  .${NORMAL_TEXT_CLASS} {
    color: var(--highlight-text);
    background-color: var(--highlight-bg);
  }
`

export default function HighlightText(props: HighlightWithRangesProps) {
	return <HighlightWithRangesWrapper {...props}></HighlightWithRangesWrapper>
}
