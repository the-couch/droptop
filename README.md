# droptop
Tiny, zero-config, accessible replacement for native select inputs. Falls back
to native for mobile browsers. **1.4kb gzipped.**

## Install
```bash
npm i droptop --save
```

# Usage
```javascript
import droptop from 'droptop'

droptop(document.getElementById('select'))
```
## Styles
You'll want to start with something like this:
```css
.droptop-button {
  display: block;
  padding: 1em 6em;
  background: white;
  border: 2px solid black;
}
.droptop {
  position: absolute;
  z-index: 9999;
  top: 0; left: 0;
  border: 2px solid black;
  margin-top: 0.5em;
}
.droptop__inner {
  max-height: 200px;
  overflow: auto;
}
.droptop__option {
  display: block;
  padding: 1em 6em;
  background: white;
  border: 0;
  width: 100%;
}
.droptop__option:focus {
  background: whitesmoke;
  outline: 0;
}
```

## License
MIT License © [Eric Bailey](https://estrattonbailey.com)
