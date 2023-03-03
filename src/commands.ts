import { invoke } from "@tauri-apps/api"

async function isDirectory(path: string) {
  return invoke("is_directory", { path })
}

async function showNoteMenu(x: number, y: number) {
  return invoke("show_note_menu", { x, y })
}

const git = {
  async clone(url: string) {
    return invoke("git_clone", { url })
  },
}

const commands = { isDirectory, git, showNoteMenu }

export default commands
