;(() => {
  const leaflet = document.querySelector('.leaflet')
  const pageElems = document.querySelectorAll('.page')
  const hand = document.querySelector('.hand')
  let openCount = 0
  let currentMenu
  let isZoomIn = false

  const handPos = { x: 0, y: 0 }
  const targetPos = { x: 0, y: 0 }
  let distX
  let distY

  function getTarget(elem, className) {
    while (!elem.classList.contains(className)) {
      elem = elem.parentNode

      if (elem.nodeName === 'BODY') {
        elem = null
        return
      }
    }
    return elem
  }

  function closeLeaflet() {
    openCount = 0
    leaflet.classList.remove('leaflet-opened')
    pageElems[2].classList.remove('page-flipped')
    setTimeout(() => {
      pageElems[0].classList.remove('page-flipped')
    }, 1000)
  }

  function zoomIn(elem) {
    const rect = elem.getBoundingClientRect()
    const dx = window.innerWidth / 2 - (rect.x + rect.width / 2)
    const dy = window.innerHeight / 2 - (rect.y + rect.height / 2)
    let angle

    //페이지 번호에 따라 줌인 실행
    switch (elem.parentNode.parentNode.parentNode.dataset.page * 1) {
      case 1:
        angle = -30
        break
      case 2:
        angle = 0
        break
      case 3:
        angle = 30
        break
    }

    isZoomIn = true
    document.body.classList.add('zoom-in')
    leaflet.style.transform = `translate3d(${dx}px, ${dy}px, 60vw) rotateY(${angle}deg)`
    currentMenu = elem
    currentMenu.classList.add('current-menu')
  }

  function zoomOut() {
    isZoomIn = false
    document.body.classList.remove('zoom-in')
    leaflet.style.transform = 'none'
    if (currentMenu) {
      currentMenu.classList.remove('current-menu')
      currentMenu = null
    }
  }

  function render() {
    distX = targetPos.x - handPos.x
    distY = targetPos.y - handPos.y
    handPos.x = handPos.x + distX * 0.1
    handPos.y = handPos.y + distY * 0.1

    if (isZoomIn) {
      hand.style.transform = `translate(${handPos.x - 130}px, ${
        handPos.y + 10
      }px)`
    } else {
      hand.style.transform = `translate(${handPos.x - 70}px, ${handPos.y}px)`
    }
    requestAnimationFrame(render)
  }

  render()

  window.addEventListener('mousemove', e => {
    targetPos.x = e.clientX - window.innerWidth * 0.7
    targetPos.y = e.clientY - window.innerHeight * 0.7
  })

  leaflet.addEventListener('click', e => {
    let pageElem = getTarget(e.target, 'page')
    if (pageElem) {
      pageElem.classList.add('page-flipped')
      openCount++
    }

    if (openCount == 2) {
      leaflet.classList.add('leaflet-opened')
    }

    let closeBtnElem = getTarget(e.target, 'close-btn')
    if (closeBtnElem) {
      closeLeaflet()
      zoomOut()
    }

    let menuItemElem = getTarget(e.target, 'menu-item')
    if (menuItemElem && !isZoomIn) {
      zoomIn(menuItemElem)
    }

    let backBtnElem = getTarget(e.target, 'back-btn')
    if (backBtnElem) {
      zoomOut()
    }
  })

  leaflet.addEventListener('animationend', () => {
    leaflet.style.animation = 'none'
  })
})()
