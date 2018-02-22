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

  const button = h('button', { class: 'droptop-button' }, [ h(opts[0].label) ])
  const options = opts.map(opt => {
    return h('button', { class: 'droptop__option' }, [ h(opt.label) ])
  })
  const dropdown = h('div', {
    class: 'droptop',
    'aria-hidden': true
  }, [
    h('div', { class: 'droptop__inner' }, options)
  ])

  const transitionDelay = parseFloat(window.getComputedStyle(dropdown).getPropertyValue('transition-duration'), 10) * 1000

  function toggle () {
    active ? close() : open()
  }
  function open () {
    if (!active) {
      document.body.appendChild(dropdown)
      const attachment = (window.innerHeight - button.getBoundingClientRect().bottom) < dropdown.clientHeight ? 'top' : 'bottom'
      dropdown.setAttribute('aria-hidden', false)
      dropdown.setAttribute('tabindex', 0)
      dropdown.classList.add(attachment)
      tack(
        dropdown,
        button,
        (window.innerHeight - button.getBoundingClientRect().bottom) < dropdown.clientHeight ? 'top' : 'bottom'
      )
      focusNode = document.activeElement
      options[selectedIndex].focus()
      active = true
      setTimeout(() => {
        dropdown.classList.add('active')
      }, 0)
    }
  }
  function close () {
    if (active) {
      dropdown.classList.add('hiding')
      active = false
      enableScroll()
      focusNode && focusNode.focus()
      dropdown.setAttribute('aria-hidden', true)
      dropdown.removeAttribute('tabindex')
      setTimeout(() => {
        document.body.removeChild(dropdown)
        dropdown.classList.remove('active')
        dropdown.classList.remove('hiding')
      }, transitionDelay)
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
  dropdown.onmouseenter = disableScroll
  dropdown.onmouseleave = enableScroll
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
