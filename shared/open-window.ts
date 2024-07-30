import { SELF_WINDOW_ID_KEY } from "./constants"
import {
  getCurrentWindow,
  getDisplayInfo,
  getWindowById,
  storageGet,
  storageSet
} from "./promisify"

const SEARCH_WINDOW_WIDTH = 800
const SEARCH_WINDOW_HEIGHT = 500

async function activeWindow() {
  const storage = await storageGet(SELF_WINDOW_ID_KEY)
  if (storage[SELF_WINDOW_ID_KEY]) {
    try {
      const _window = await getWindowById(Number(storage[SELF_WINDOW_ID_KEY]))
      chrome.windows.update(_window.id, { focused: true })
      return
    } catch (error) {}
  }
  const currentWindow = await getCurrentWindow()
  const displays = await getDisplayInfo()
  // find the display that the current window is in
  const focusedDisplay = displays.find((display) => {
    const { width, height, left, top } = display.bounds
    // strict bounds detection
    return (
      currentWindow.left >= left &&
      currentWindow.left < left + width &&
      currentWindow.top >= top &&
      currentWindow.top < top + height
    )
  }) || displays.find((display) => {
    const { width, height, left, top } = display.bounds
    //  loose bounds detection
    return (
      currentWindow.left >= left &&
      currentWindow.left < left + width ||
      currentWindow.top >= top &&
      currentWindow.top < top + height
    )
  })
  
  // if focusedDisplay is not found, just lower the standard about bounds
  const { width, height, left, top } = focusedDisplay.bounds
  chrome.windows.create(
    {
      width: SEARCH_WINDOW_WIDTH,
      height: SEARCH_WINDOW_HEIGHT,
      left: Math.floor((width - SEARCH_WINDOW_WIDTH) / 2 + left),
      top: Math.floor((height - SEARCH_WINDOW_HEIGHT) / 2 + top),
      focused: true,
      type: "popup",
      url: "./sidepanel.html"
    },
    (window) => {
      storageSet({
        [SELF_WINDOW_ID_KEY]: window.id
      })
    }
  )
}

export function weakUpWindowIfActiveByUser() {
  chrome.action.onClicked.addListener(activeWindow)
  chrome.commands.onCommand.addListener((command) => {
    if (command === "_execute_action") {
      activeWindow()
    }
  })
}
