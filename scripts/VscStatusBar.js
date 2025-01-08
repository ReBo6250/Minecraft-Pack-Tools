const vscode = require("vscode");

class StatusBarItem {
  constructor(
    command,
    alignment = vscode.StatusBarAlignment.Right,
    priority = undefined
  ) {
    this._item = vscode.window.createStatusBarItem(alignment, priority);
    this._item.command = command;
    this._text = null;
    this._tooltip = null;
    this._item.show();
  }

  set text(value) {
    this._text = value;
    this._item.text = value;
  }

  get text() {
    return this._text;
  }

  set tooltip(value) {
    this._tooltip = value;
    this._item.tooltip = value;
  }

  get tooltip() {
    return this._tooltip;
  }
  set icon(value) {
    this._item.iconPath = value;
  }

  get icon() {
    return this._item.iconPath;
  }

  show() {
    this._item.show();
  }

  hide() {
    this._item.hide();
  }

  dispose() {
    this._item.dispose();
  }
}

class StatusBarItemToggleable extends StatusBarItem {
  constructor(
    enableCommand,
    disableCommand,
    alignment = vscode.StatusBarAlignment.Right,
    priority = undefined
  ) {
    super(null, alignment, priority);
    this.enableCommand = enableCommand;
    this.disableCommand = disableCommand;
    this.disable();
  }
  enable() {
    this._item.command = this.disableCommand;
    this._item.text = "$(check) Enabled";
  }

  disable() {
    this._item.command = this.enableCommand;
    this._item.text = "$(circle-slash) Disabled";
  }

  toggle() {
    if (this._item.command === this.enableCommand) {
      this.enable();
    } else {
      this.disable();
    }
  }
}

module.exports = {
  StatusBarItem,
  StatusBarItemToggleable,
};
