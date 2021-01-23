const { spawnSync } = require("child_process")
const tabs = {}

exports.middleware = ({ getState }) => next => async (action) => {
  switch (action.type) {
    case "UI_COMMAND_EXEC":
      if (action.command === "window:new") {
        const { sessions } = getState()
        const tab = tabs[sessions.activeUid]
        const cwd = spawnSync("readlink", ["-e", `/proc/${tab.pid}/cwd`])
        spawnSync("hyper", [cwd.stdout.toString().trim()])
        return
      }
      break
    case "SESSION_ADD":
      tabs[action.uid] = { pid: action.pid }
      break
    case "SESSION_PTY_EXIT":
    case "SESSION_USER_EXIT":
      delete tabs[action.uid]
      break
    default:
      break
  }
  next(action)
}
