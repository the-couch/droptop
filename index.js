import { tack } from 'tackjs'

const keys = {
  up: 38,
  down: 40,
  enter: 13,
  esc: 27
}

function h(tag, props, children) {
  if (!props) return document.createTextNode(tag)
  const e = document.createElement(tag)
  const attrs = Object.keys(props)
  for (let i = 0; i < attrs.length; i++) {
    e.setAttribute(attrs[i], props[attrs[i]])
  }
  for (let i = 0; i < children.length; i++) {
    e.appendChild(children[i])
  }
  return e
}

export default function drop (select) {
  if (/iPad|iPhone|Android/i.test(navigator.userAgent)) return

  let i = 0
  let opts = []
  let selectedIndex
  let active = false
  let focusNode = null
  let scrollDisabled = false

  while (select[i]) {
    const opt = select[i]
    if (opt.selected) selectedIndex = i
    opts.push({
      selected: opt.selected,
      value: opt.value,
      label: opt.text
    })
    i++
  }

  const button = h('button', { class: 'drop-button' }, [ h(opts[0].label) ])
  const options = opts.map(opt => {
    return h('button', { class: 'drop__opt' }, [ h(opt.label) ])
  })
  const dropdown = h('div', {
    class: 'drop',
    'aria-hidden': true
  }, [
    h('div', { class: 'drop__inner' }, options)
  ])

  function toggle () {
    active ? close() : open()
  }
  function open () {
    if (!active) {
      document.body.appendChild(dropdown)
      dropdown.setAttribute('aria-hidden', false)
      dropdown.setAttribute('tabindex', 0)
      focusNode = document.activeElement
      tack(dropdown, button, 'bottom')
      options[selectedIndex].focus()
      active = true
    }
  }
  function close () {
    if (active) {
      document.body.removeChild(dropdown),
      active = false
      enableScroll()
      focusNode && focusNode.focus()
      dropdown.setAttribute('aria-hidden', true)
      dropdown.removeAttribute('tabindex')
    }
  }
  function selectOption (cb) {
    let i = 0
    while (options[i]) {
      if (i === selectedIndex) {
        button.innerHTML = options[i].innerHTML
        select[i].selected = true
        selectedIndex = i
      } else {
        select[i].selected = false
      }
      i++
    }
    select.dispatchEvent(new Event('change'))
    cb && cb()
  }
  function focusOption (type) {
    if (document.activeElement === dropdown) {
      return options[0].focus()
    }
    document.activeElement[type] && document.activeElement[type].focus()
  }
  function disableScroll () {
    scrollDisabled = true
    document.body.style.overflow = 'hidden'
  }
  function enableScroll () {
    scrollDisabled = false
    document.body.style.overflow = ''
  }

  select.onchange = function () {
    selectedIndex = e.target.selectedIndex
    button.innerHTML = options[selectedIndex].innerHTML
  }
  select.onmouseenter = disableScroll
  select.onmouseleave = enableScroll
  button.onmouseenter = disableScroll
  button.onmouseleave = enableScroll
  button.onclick = toggle

  document.addEventListener('click', e => {
    if (dropdown.contains(e.target) || e.target === button) return
    close()
  })

  document.addEventListener('keydown', e => {
    if (!active) return
    e.preventDefault()
    const key = e.keyCode
    if (key === keys.esc) close()
    if (key === keys.enter) {
      selectedIndex = options.indexOf(document.activeElement)
      selectOption(close)
    }
    if (key === keys.down) focusOption('nextSibling')
    if (key === keys.up) focusOption('previousSibling')
  })

  for (let i = 0; i < options.length; i++) {
    options[i].onclick = () => {
      selectedIndex = i
      selectOption(close)
    }
  }

  button.innerHTML = options[selectedIndex].innerHTML
  select.parentNode.insertBefore(button, select)
  select.style.display = 'none'
}