;(() => {
  const leaflet = document.querySelector('.leaflet')
  const pageElems = document.querySelectorAll('.page')
  let openCount = 0
  let currentMenu

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

    document.body.classList.add('zoom-in')
    leaflet.style.transform = `translate3d(${dx}px, ${dy}px, 60vw) rotateY(${angle}deg)`
    currentMenu = elem
    currentMenu.classList.add('current-menu')
  }

  function zoomOut() {
    document.body.classList.remove('zoom-in')
    leaflet.style.transform = 'none'
    currentMenu.classList.remove('current-menu')
    currentMenu = null
  }

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
    }

    let menuItemElem = getTarget(e.target, 'menu-item')
    if (menuItemElem) {
      zoomIn(menuItemElem)
    }

    let backBtnElem = getTarget(e.target, 'back-btn')
    if (backBtnElem) {
      zoomOut()
    }
  })
})()
