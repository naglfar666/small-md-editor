# small-md-editor
**Initialize MD editor**

```javascript
var editor = new Editor('mdeditor');
editor.render().renderTextarea();
```
**Get value of editor**

```javascript
editor.getValue();
```
**Render preloaded code**

```javascript
var editorValue = "**Some title**";
editor.setValue(editorValue);
editor.renderResult();
```

**Dependencies**

* UIKit JS
* UIKit Icons
* UIKit CSS

**Additional**
To see full example with minified UIKit open *example* folder 
