declare module "@nulogy/icons" {
  export type { IconData } from "./types.d.ts";

  export type IconName = "accessTime" | "add" | "addCircleOutline" | "apps" | "arrowBack" | "arrowForward" | "attachment" | "autoAwesome" | "barcode" | "block" | "building" | "calendarClock" | "calendarToday" | "cancel" | "chatBubble" | "check" | "checkCircleFilled" | "checkCircleOutline" | "close" | "collapse" | "copy" | "delete" | "downArrow" | "drag" | "edit" | "error" | "errorFilled" | "expand" | "filter" | "fitScreen" | "getApp" | "help" | "home" | "info" | "leftArrow" | "lock" | "maximize" | "menu" | "minimize" | "more" | "moveLeft" | "moveRight" | "openInNew" | "print" | "publish" | "queryBuilder" | "refresh" | "removeCircleOutline" | "reset" | "rightArrow" | "save" | "search" | "settings" | "shieldPerson" | "signpost" | "sort" | "sortDown" | "sortUp" | "stickyNote" | "stylusNote" | "substitutes" | "tune" | "undo" | "unlock" | "upArrow" | "update" | "user" | "visibility" | "visibilityOff" | "warning" | "warningOutline" | "wrench" | "zoomIn" | "zoomOut";

  const icons: { [K in IconName]: IconData };

  export default icons;
}