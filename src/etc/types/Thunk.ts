import type { CommandThunk } from './CommandThunk'
import type { FnThunk } from './FnThunk'
import type { ScriptThunk } from './ScriptThunk'

export type Thunk = ScriptThunk | CommandThunk | FnThunk;