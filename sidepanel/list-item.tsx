import chromeIcon from "data-base64:~assets/chrome-icon.svg"
import { useMemo } from "react"
import BookmarkSvg from "react:~assets/bookmark.svg"
import HistorySvg from "react:~assets/history.svg"
import NewWindow from "react:~assets/new-window.svg"
import RightArrow from "react:~assets/right-arrow.svg"
import TabSvg from "react:~assets/tab.svg"
import styled from "styled-components"

import { timeAgo } from "~shared/time"
import {
  type BookmarkItemType,
  type HistoryItemType,
  type ListItemType,
  type TabItemType
} from "~shared/types"
import { isBookmarkItem, isTabItem } from "~shared/utils"

import HighlightText from "./highlight-text"

export const VISIBILITY_CLASS = "list-visibility"
const ContentContainer = styled.div`
  display: flex;
  padding: 0 5px;
  width: 100%;
`
export const IMAGE_CLASS = "image-container"
const ImageContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-neutral-8);
`

export const RenderIcon = ({ iconUrl }: { iconUrl: string }) => {
  return (
    <ImageContainer className={IMAGE_CLASS}>
      <img
        src={iconUrl || chromeIcon}
        onError={(e) => (e.currentTarget.src = chromeIcon)}
        width={20}
        height={20}></img>
    </ImageContainer>
  )
}

export const HOST_CLASS = "host-text"
export const SVG_CLASS = "svg-icon"
const TitleContainer = styled.div`
  height: 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 4px;
  overflow: hidden;
  /* user-select: none; */
`

const SecondaryContainer = styled.div`
  font-size: 10px;
  height: 14px;
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: var(--color-neutral-4);
`

const ActiveStatus = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #0bc40b;
`

const LabelContainer = styled.div`
  margin-left: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
`

// export const TooltipWrap = styled(Tooltip)`
//   &.semi-tooltip-wrapper {
//     padding: 0 2px;
//     font-size: 12px;
//     border-radius: 2px;
//     background-color: var(--color-neutral-8);
//     color: var(--color-neutral-2);
//   }
// `
const Tag = styled.div`
  height: 13px;
  padding: 2px;
  line-height: 9px;
  font-size: 10px;
  border-radius: 2px;
  background-color: var(--color-neutral-8);
  color: var(--color-neutral-2);
`

const BookmarkLabel = ({ data }: { data: BookmarkItemType }) => {
  return (
    <LabelContainer>
      <BookmarkSvg className={SVG_CLASS}></BookmarkSvg>
      <Tag>{data.folderName}</Tag>
    </LabelContainer>
  )
}

const TabLabel = ({ data }: { data: TabItemType }) => {
  console.log(data.title, data.lastAccessed)
  return (
    <LabelContainer>
      <TabSvg className={SVG_CLASS}></TabSvg>
      {data.active && (
        <>
          <ActiveStatus></ActiveStatus>
          <Tag>Active</Tag>
        </>
      )}
      {data.active ||
        (data.lastAccessed && <Tag>{timeAgo(data.lastAccessed)}</Tag>)}
    </LabelContainer>
  )
}

const HistoryLabel = ({ data }: { data: HistoryItemType }) => {
  console.log("data.lastVisitTime", data.lastVisitTime)
  return (
    <LabelContainer>
      <HistorySvg className={SVG_CLASS}></HistorySvg>
      {data.lastVisitTime && <Tag>visited {timeAgo(data.lastVisitTime)}</Tag>}
    </LabelContainer>
  )
}

export const RenderContent = ({ item }: { item: ListItemType }) => {
  const { data } = item
  const host = useMemo(() => {
    const urlObj = new URL(data.url)
    return urlObj.host
  }, [data.url])
  return (
    <TitleContainer>
      <HighlightText
        content={data.title}
        hitRanges={data.hitRanges}
        id={data.id}
      />
      <SecondaryContainer>
        <HighlightText content={host} style={{ fontSize: "10px" }} />
        {isTabItem(item) ? (
          <TabLabel data={item.data}></TabLabel>
        ) : isBookmarkItem(item) ? (
          <BookmarkLabel data={item.data}></BookmarkLabel>
        ) : (
          <HistoryLabel data={item.data as HistoryItemType}></HistoryLabel>
        )}
      </SecondaryContainer>
    </TitleContainer>
  )
}

const OperationContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const OperationLinkIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-neutral-9);
  svg {
    fill: var(--color-neutral-3);
  }
`

const RenderOperation = ({ item }: { item: ListItemType }) => {
  return (
    <OperationContainer className={VISIBILITY_CLASS}>
      <OperationLinkIcon>
        {isTabItem(item) ? <RightArrow></RightArrow> : <NewWindow></NewWindow>}
      </OperationLinkIcon>
    </OperationContainer>
  )
}

export const RenderItem = ({ item }: { item: ListItemType }) => {
  return (
    <ContentContainer>
      <RenderIcon iconUrl={item.data.favIconUrl} />
      <RenderContent item={item}></RenderContent>
      <RenderOperation item={item}></RenderOperation>
    </ContentContainer>
  )
}