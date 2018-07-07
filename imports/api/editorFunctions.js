export const editorFunctions = {

    getHeight: function() {
      return (3 * window.innerHeight) + "px";
    },

    getWidth: function() {
      return window.innerWidth + "px";
    },

    padDocument: function(editor, currRow, numRows) {
      editor.selection.moveCursorToPosition({row: currRow, column: Number.MAX_VALUE});

      for (var rowNum = currRow; rowNum < numRows; rowNum++) {
        editor.insert("\n");
      }
    }
}

export const editorVariables = {
    languages: [
      'openedge',
      'javascript',
      'java',
      'python',
      'xml',
      'ruby',
      'sass',
      'markdown',
      'mysql',
      'json',
      'html',
      'handlebars',
      'golang',
      'csharp',
      'elixir',
      'typescript',
      'css',
    ],

    statusBarStyle: {
      zIndex: '9999',
      bottom: '0',
      position: 'fixed'
    }
}
