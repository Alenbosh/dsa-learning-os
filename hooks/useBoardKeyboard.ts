import { useEffect, useCallback, useRef } from "react";

/**
 * useBoardKeyboard — shared keyboard navigation for Kanban-style boards.
 *
 * Keybindings (only active when no input/modal is focused):
 *
 *   n          → open "add new" modal
 *   Escape     → clear selected card
 *   ↑ / k      → select previous card within current column
 *   ↓ / j      → select next card within current column
 *   ← / h      → move selected card one column left
 *   → / l      → move selected card one column right
 *   e / Enter  → open edit modal for selected card
 *   ?          → toggle shortcut help overlay (handled externally via onShowHelp)
 *   1–4        → jump focus to column 1–4 (selects first card in that column)
 *
 * @param columns   ordered list of column keys (e.g. ["NotStarted","InProgress",...])
 * @param items     all items, each with { id, [columnKey]: string }
 * @param columnKey the property name that determines which column an item belongs to
 * @param selectedId  currently selected card id (controlled)
 * @param setSelectedId  setter for selectedId
 * @param onAddNew  called when user presses 'n'
 * @param onEdit    called with item when user presses 'e' or Enter on selected card
 * @param onMove    called with (id, newColumnValue) when user moves a card
 */

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  if (target.closest("[contenteditable='true']")) return true;
  return false;
}

interface UseBoardKeyboardOptions<T extends { id: string }> {
  columns: readonly string[];
  items: T[];
  columnKey: keyof T;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onAddNew: () => void;
  onEdit: (item: T) => void;
  onMove: (id: string, newColumn: string) => void;
  disabled?: boolean; // e.g. when a modal is open
}

export function useBoardKeyboard<T extends { id: string }>({
  columns,
  items,
  columnKey,
  selectedId,
  setSelectedId,
  onAddNew,
  onEdit,
  onMove,
  disabled = false,
}: UseBoardKeyboardOptions<T>) {
  // Keep stable refs so the keydown handler doesn't go stale
  const stateRef = useRef({
    columns,
    items,
    columnKey,
    selectedId,
    setSelectedId,
    onAddNew,
    onEdit,
    onMove,
    disabled,
  });
  useEffect(() => {
    stateRef.current = {
      columns,
      items,
      columnKey,
      selectedId,
      setSelectedId,
      onAddNew,
      onEdit,
      onMove,
      disabled,
    };
  });

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const s = stateRef.current;
    if (s.disabled) return;
    if (isEditableTarget(e.target)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const key = e.key;

    // ── n → add new ─────────────────────────────────────────
    if (key === "n") {
      e.preventDefault();
      s.setSelectedId(null);
      s.onAddNew();
      return;
    }

    // ── Escape → deselect ───────────────────────────────────
    if (key === "Escape") {
      if (s.selectedId) {
        e.preventDefault();
        s.setSelectedId(null);
      }
      return;
    }

    // ── 1–4 → jump to column, select first card ─────────────
    const colJump = parseInt(key);
    if (colJump >= 1 && colJump <= s.columns.length) {
      e.preventDefault();
      const colValue = s.columns[colJump - 1];
      const colItems = s.items.filter((i) => i[s.columnKey] === colValue);
      if (colItems.length > 0) s.setSelectedId(colItems[0].id);
      else s.setSelectedId(null);
      return;
    }

    // ── Everything below requires a selected card ────────────
    if (!s.selectedId) {
      // j / ↓ with nothing selected → select first item overall
      if (key === "j" || key === "ArrowDown") {
        e.preventDefault();
        if (s.items.length > 0) s.setSelectedId(s.items[0].id);
      }
      return;
    }

    const selectedItem = s.items.find((i) => i.id === s.selectedId);
    if (!selectedItem) {
      s.setSelectedId(null);
      return;
    }

    const currentCol = selectedItem[s.columnKey] as string;
    const colIdx = s.columns.indexOf(currentCol);
    const colItems = s.items.filter((i) => i[s.columnKey] === currentCol);
    const itemIdx = colItems.findIndex((i) => i.id === s.selectedId);

    // ── ↑ / k → previous card in column ────────────────────
    if (key === "ArrowUp" || key === "k") {
      e.preventDefault();
      if (itemIdx > 0) s.setSelectedId(colItems[itemIdx - 1].id);
      return;
    }

    // ── ↓ / j → next card in column ─────────────────────────
    if (key === "ArrowDown" || key === "j") {
      e.preventDefault();
      if (itemIdx < colItems.length - 1)
        s.setSelectedId(colItems[itemIdx + 1].id);
      return;
    }

    // ── ← / h → move card one column left ──────────────────
    if (key === "ArrowLeft" || key === "h") {
      e.preventDefault();
      if (colIdx > 0) {
        const newCol = s.columns[colIdx - 1];
        s.onMove(s.selectedId, newCol);
      }
      return;
    }

    // ── → / l → move card one column right ─────────────────
    if (key === "ArrowRight" || key === "l") {
      e.preventDefault();
      if (colIdx < s.columns.length - 1) {
        const newCol = s.columns[colIdx + 1];
        s.onMove(s.selectedId, newCol);
      }
      return;
    }

    // ── e / Enter → edit selected card ─────────────────────
    if (key === "e" || key === "Enter") {
      e.preventDefault();
      s.onEdit(selectedItem);
      return;
    }
  }, []); // empty deps — we use stateRef instead

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);
}
