import { MSym } from "@/v4-eos/ui/msym";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/v4-eos/ui/dropdown-menu";

// Object-action model for Structure rows (mirrors the real Iceberg editor, V1):
// Rename, Duplicate, Copy, Paste, Disable/Enable, Delete. Handlers are supplied
// by the shell and operate on the editable Structure state.
export interface RowActionsHandlers {
  disabled?: boolean;
  canPaste?: boolean;
  onRename: () => void;
  onDuplicate: () => void;
  onCopy: () => void;
  onPaste: () => void;
  /** Page sections only: save the section as a reusable widget. */
  onSaveAsWidget?: () => void;
  onToggleDisabled: () => void;
  onDelete: () => void;
}

// Overflow (⋮) trigger + menu. Stays visible so the action set is discoverable;
// stops propagation so opening the menu never also selects/toggles the row.
export function RowActionsMenu({
  label,
  disabled,
  canPaste,
  minimal,
  onRename,
  onDuplicate,
  onCopy,
  onPaste,
  onSaveAsWidget,
  onToggleDisabled,
  onDelete,
}: { label: string; minimal?: boolean } & RowActionsHandlers) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        aria-label={`Actions for ${label}`}
        className="flex size-5 items-center justify-center rounded-sm text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:bg-accent data-[state=open]:text-foreground"
      >
        <MSym name="more_vert" size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(e) => e.stopPropagation()}
        className="w-44"
      >
        <DropdownMenuItem onSelect={onRename}>
          <MSym name="edit" size={16} />
          Rename
        </DropdownMenuItem>
        {!minimal && (
          <DropdownMenuItem onSelect={onDuplicate}>
            <MSym name="content_copy" size={16} />
            Duplicate
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onCopy}>
          <MSym name="content_copy" size={16} />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!canPaste}
          onSelect={() => canPaste && onPaste()}
        >
          <MSym name="content_paste" size={16} />
          Paste
        </DropdownMenuItem>
        {onSaveAsWidget && (
          <DropdownMenuItem onSelect={onSaveAsWidget}>
            <MSym name="widgets" size={16} />
            Save as widget
          </DropdownMenuItem>
        )}
        {/* Duplicate / Disable / Delete are omitted in the minimal set (widget
            context) — only Rename · Copy · Paste are offered there. */}
        {!minimal && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onToggleDisabled}>
              <MSym name={disabled ? "check_circle" : "block"} size={16} />
              {disabled ? "Enable" : "Disable"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <MSym name="delete" size={16} />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
