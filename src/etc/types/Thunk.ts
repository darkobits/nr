import type { CommandThunk } from './CommandThunk';
import type {ScriptThunk } from './ScriptThunk';
import type { TaskThunk } from './TaskThunk';


export type Thunk = ScriptThunk | CommandThunk | TaskThunk;
