import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SaveShortcutForm } from "./SaveShortcutForm";

const simpleFormMock = vi.fn(
  ({ children, ...props }: Record<string, unknown>): React.ReactElement => (
    <form data-testid="simple-form" data-props={JSON.stringify(props)}>
      {children}
    </form>
  ),
);

const useSaveContextMock = vi.fn();
const saveContextProviderMock = vi.fn(
  ({ value, children }: { value: unknown; children: React.ReactNode }): React.ReactElement => (
    <div data-testid="save-context-provider" data-has-save={String(typeof (value as { save?: unknown })?.save === "function")}>
      {children}
    </div>
  ),
);

vi.mock("react-admin", async () => {
  const ReactModule = await import("react");

  return {
    SaveContextProvider: saveContextProviderMock,
    SimpleForm: simpleFormMock,
    useSaveContext: useSaveContextMock,
  };
});

describe("SaveShortcutForm", () => {
  const renderWithSaveContext = (saveContext: { save?: unknown }): ReturnType<typeof render> => {
    useSaveContextMock.mockReturnValue(saveContext);

    return render(
      <SaveShortcutForm toolbar={false}>
        <input aria-label="name" />
      </SaveShortcutForm>,
    );
  };

  beforeEach(() => {
    simpleFormMock.mockClear();
    saveContextProviderMock.mockClear();
    useSaveContextMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the underlying React-Admin form with the provided props and children", () => {
    renderWithSaveContext({ save: vi.fn() });

    expect(screen.getByTestId("simple-form")).toBeInTheDocument();
    expect(screen.getByLabelText("name")).toBeInTheDocument();
    expect(simpleFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        toolbar: false,
        children: expect.anything(),
      }),
      undefined,
    );
    expect(saveContextProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expect.objectContaining({ save: expect.any(Function) }),
        children: expect.anything(),
      }),
      undefined,
    );
  });

  it("triggers save and prevents default on Ctrl+S when saveContext.save exists", () => {
    const save = vi.fn();
    renderWithSaveContext({ save });

    const input = screen.getByLabelText("name");
    input.focus();

    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      cancelable: true,
      bubbles: true,
    });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("triggers save and prevents default on Cmd+S when saveContext.save exists", () => {
    const save = vi.fn();
    renderWithSaveContext({ save });

    const input = screen.getByLabelText("name");
    input.focus();

    const event = new KeyboardEvent("keydown", {
      key: "S",
      metaKey: true,
      cancelable: true,
      bubbles: true,
    });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("does not trigger save for unrelated key combinations", () => {
    const save = vi.fn();
    renderWithSaveContext({ save });

    const event = new KeyboardEvent("keydown", {
      key: "p",
      ctrlKey: true,
      cancelable: true,
      bubbles: true,
    });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(save).not.toHaveBeenCalled();
  });

  it("does not prevent default or invoke save when saveContext.save is missing", () => {
    renderWithSaveContext({});

    const input = screen.getByLabelText("name");
    input.focus();

    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      cancelable: true,
      bubbles: true,
    });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("does not prevent default or invoke save when saveContext.save is not a function", () => {
    renderWithSaveContext({ save: "not-a-function" });

    const input = screen.getByLabelText("name");
    input.focus();

    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      cancelable: true,
      bubbles: true,
    });

    expect(() => {
      document.dispatchEvent(event);
    }).not.toThrow();
    expect(event.defaultPrevented).toBe(false);
  });

  it("does not prevent default or invoke save when the event target is not a Node", () => {
    const save = vi.fn();
    renderWithSaveContext({ save });

    const event = new Event("keydown", { cancelable: true, bubbles: true }) as KeyboardEvent;
    Object.defineProperty(event, "key", { value: "s" });
    Object.defineProperty(event, "ctrlKey", { value: true });
    Object.defineProperty(event, "target", { value: { value: "not-a-node" } });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(save).not.toHaveBeenCalled();
  });

  it("does not prevent default or invoke save when the event target is detached from the document", () => {
    const save = vi.fn();
    renderWithSaveContext({ save });

    const detachedInput = document.createElement("input");
    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      cancelable: true,
      bubbles: true,
    });
    Object.defineProperty(event, "target", { value: detachedInput });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(save).not.toHaveBeenCalled();
  });

  it("removes the keyboard listener on unmount", () => {
    const save = vi.fn();
    const { unmount } = renderWithSaveContext({ save });

    unmount();

    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      cancelable: true,
      bubbles: true,
    });

    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(save).not.toHaveBeenCalled();
  });

  it("responds to shortcuts from descendant elements rendered by the form", () => {
    const save = vi.fn();
    renderWithSaveContext({ save });

    fireEvent.keyDown(screen.getByLabelText("name"), {
      key: "s",
      ctrlKey: true,
    });

    expect(save).toHaveBeenCalledTimes(1);
  });
});
